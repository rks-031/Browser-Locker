class BrowserLock {

    static start() {
        BrowserLock.__onCommand();
        BrowserLock.__onInstalled();
        BrowserLock.UnistalURL();
        BrowserLock.__onTabCreate();
        BrowserLock.__onWindowClose();
        BrowserLock.__onWindowsCreate();
        BrowserLock.ContextOlustur();
        util.localduzen()
            .then(() => {
                if (localStorage.KilitAcik === "true") {
                    setTimeout(() => {
                        BrowserLock.Lock()
                    }, 1500);
                   
                } else {
                    notification.sifreuyar();
                }
            })
            .catch(err => {
                console.log(err);
            });

    }

    static UnistalURL() {
        const url = "https://docs.google.com/forms/d/e/1FAIpQLSfHgB_RKR1ZRR8e9pHQuEo6s58NMc-DwP4BvgX-gf1Ji7Kp2g/viewform";
        chrome.runtime.setUninstallURL(url);
    }
    //Tarayıcıyı Kilitle
    static Lock() {
        try {
            util.StorageSet("kilit__giris", "true").then(resolve => {
                const {
                    KilitAcik,
                    KilitEkran,
                    Kilitli
                } = localStorage;
                if (KilitAcik === "true") {
                    if (KilitEkran != "true" && Kilitli != "false") {
                        chrome.windows.getAll({
                            populate: true
                        }, Pencere => {
                            if (Pencere.length > 0) {
                                localStorage.KayitliPencereler = JSON.stringify(Pencere);
                                BrowserLock.GirisEkrani().then(() => util._removeOpenWindows());
                            }
                        });
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }
    }




    static GirisEkrani() {
        return new Promise(resolve => {

            chrome.tabs.create({ url: 'html/login.html?wndid=hmbldmplgscrn' }, (tab) => {
                const width = 640;
                const height = 540;
                const left = parseInt((screen.width / 2) - (width / 2));
                const top = parseInt((screen.height / 2) - (height / 2));
                localStorage.ilkekran = "false";
                const GirisBilgileri = {
                    left,
                    top,
                    width,
                    height,
                    //state: 'fullscreen',
                    focused: true,
                    incognito: false,
                    type: 'panel',
                    tabId: tab.id
                };

                chrome.windows.create(GirisBilgileri, (wnd) => {
                    localStorage.KilitEkran = "true";
                    localStorage.setItem('EkranID', wnd.id);
                    resolve()
                })
            })



        });
    }

    static ContextOlustur() {
        chrome.contextMenus.removeAll();
        chrome.contextMenus.create({
            title: util.ceviri("tarayici_kilitle"),
            onclick: util.yenidenKilit.bind(this),
            contexts: ['all'],
        });
        chrome.contextMenus.create({
            title: util.ceviri("ayarlari_degistir"),
            onclick: util.ContextTiklama.bind(this),
            contexts: ['all'],
        });
    }

    //This is a mess bro we need to fix this :/
    static __onTabCreate() {

        chrome.tabs.onCreated.addListener((created) => {
            console.log(created);
            const WndID = localStorage.getItem('EkranID');
            
            if (created.windowId == WndID) {
                console.log("Login Screen opened on " + WndID);
            }
            else {
                const { Kilitli, KilitEkran, KilitAcik } = localStorage;
                if (KilitAcik != "false" && Kilitli != "false" && KilitEkran != "false") {
                    chrome.tabs.remove(created.id, () => {
                        chrome.windows.remove(created.windowId)
                    })

                    if (KilitEkran == "true") {
                        util.WndwFocus(WndID)
                    }
                }
            }

        })
    }

    static __onCommand(){
        chrome.commands.onCommand.addListener((e) =>{
            if (e == "lock-the-browser") {
                util.yenidenKilit()
            }
        });
    }
    static __CheckWindows(id) {
        chrome.windows.get(id, { populate: true }, (s) => {
            if (s.tabs.length == 0) {
                chrome.windows.remove(id, (z) => {
                    if (chrome.runtime.lastError) {
                        console.log("sa");
                    }
                });
            }
        })
    }

    static __onWindowsCreate() {
        // chrome.windows.onCreated.addListener(donus => {
        //     const {
        //         KilitAcik,
        //         Kilitli,
        //         KilitEkran,
        //         ilkekran
        //     } = localStorage;
        //     if (KilitAcik === "true") {

        //         if (Kilitli != "false") {
        //             //Kilitle
        //             if (KilitEkran != "true" && ilkekran != "false") {
        //                 localStorage.ilkekran = "false";
        //                 setTimeout(() => {
        //                     BrowserLock.Lock()
        //                 }, 1500);
        //             } else if (KilitEkran === "true") {
        //                 chrome.windows.get(donus.id, (sonuc) => {
        //                     chrome.windows.remove(donus.id);
        //                 })
        //             }
        //         }
        //     }
        // })

        chrome.windows.onCreated.addListener((created) => {
            const WndID = localStorage.getItem('EkranID');

            if (created.id == WndID) {
                console.log("Login Screen opened on " + WndID);
            }
            else {
                const { Kilitli, KilitEkran, KilitAcik, ilkekran } = localStorage;

                if (KilitAcik == "true" && Kilitli == "true") {

                    if (KilitEkran == "false" && ilkekran == "true") {
                        setTimeout(() => {
                            BrowserLock.Lock();
                        }, 1500);
                    }
                    else if (KilitEkran == "true") {
                        chrome.windows.remove(created.id)
                    }

                }

            }
        })
    }

    static __onWindowClose() {
        chrome.windows.onRemoved.addListener(donus => {
            const {
                EkranID
            } = localStorage;
            var sa = Number(EkranID);
            if (donus === sa) {
                localStorage.kalanhak = 3;
                localStorage.KilitEkran = "false";
                localStorage.KayitliPencereler = JSON.stringify([]);
                util.StorageGet("kilit__giris").then(donusum => {
                    if (donusum === "true") {
                        chrome.windows.getAll(resolve => {
                            for (const winsd of resolve) {
                                chrome.windows.remove(winsd.id);
                            }
                        });
                    }
                });
                util.StorageRemove("kilit__giris")
            }

            chrome.windows.getAll(wins => {
                if (wins.length === 0) localStorage.ilkekran = 'true';
            });
        });
    }

    static __onInstalled() {
        chrome.runtime.onInstalled.addListener(detay => {
            const {
                reason
            } = detay;
            const suanversion = chrome.runtime.getManifest().version;
            if (reason === "update") {
                //alert("sorry for v1.0.3 bug, for fixed that new update gonna remove your password and lock! its not gonna happen every update");
            } else if (reason == 'install') {
                notification.yuklendi(suanversion);
            }

            chrome.runtime.openOptionsPage()
        })
    }
}