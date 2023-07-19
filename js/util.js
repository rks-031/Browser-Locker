const KayitType = "local";
var _gaq = _gaq || [];
class util {
    static localduzen() {
        return new Promise((resolve, reject) => {
            util.StorageGet("user__pass").then(resolve => {
                if (!resolve) {
                    localStorage.setItem('KilitAcik', 'false');
                }
            }).then(() => {
                if (!localStorage.getItem('KilitAcik')) localStorage.setItem('KilitAcik', 'false');
                if (!localStorage.getItem('settime')) localStorage.setItem('kalanhak', 3);
                if (!localStorage.getItem('settime')) localStorage.setItem('kalanhak', 3);
                localStorage.setItem('Kilitli', 'true');
                localStorage.setItem('KilitEkran', 'false');
                localStorage.setItem('ilkekran', 'true');
                localStorage.setItem('FormLogin', 'false');
            });
            resolve();
        });
    }

    static Analytics() {
        _gaq.push(['_setAccount', 'UA-57988211-7']);
        _gaq.push(['_trackPageview']);

        (function () {
            var ga = document.createElement('script');
            ga.type = 'text/javascript';
            ga.async = true;
            ga.src = 'https://ssl.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ga, s);
        })();
    }

    static AnalyticsEvent(isim,event){
        _gaq.push(['_trackEvent', isim, event]);
    }

    static darkMode() {
        var html = document.getElementsByTagName("html")[0];
        if (localStorage.DarkMode != "true") {
            html.id = "light_mode";
            $(".logo__sphere img").attr("src", "../logos/128-logo.png");
        } else {
            html.id = "dark_mode";
            $(".logo__sphere img").attr("src", "../logos/128-logo-light.png");
        }
    }

    static ContextTiklama() {
        chrome.runtime.openOptionsPage()
    }

    static yenidenKilit() {
        const {
            KilitAcik,
            KilitEkran,
            Kilitli
        } = localStorage;
        if (KilitAcik === "true") {
            if (KilitEkran != "true") {
                util.localduzen().then(()=>{
                    BrowserLock.Lock()
                })
            }
        } else {
            notification.sifreuyar();
        }
    }

    static uyarigonder(title = null, context = null) {
        $.confirm({
            icon: 'fa fa-exclamation-triangle',
            title: title,
            content: context,
            type: 'red',
            theme: 'lock-noti',
            draggable: false,
            buttons: {
                ok: function () {}
            }
        });
    }

    static _removeOpenWindows() {
        try {
            const tarayici = util.Tarayici();
            if (tarayici) {

                const savedWindows = JSON.parse(localStorage.KayitliPencereler);
                for (const windows of savedWindows) {
                    var z = 1;
                    for (const tabs of windows.tabs) {
                        if (tarayici === "opera") {
                            chrome.tabs.remove(tabs.id);
                            if (z === windows.tabs.length) {
                                chrome.windows.remove(windows.id);
                            }
                        } else {
                            chrome.tabs.remove(tabs.id);
                        }
                        z++;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    static onaygonder(title = null, context = null) {
        $.confirm({
            icon: 'fa fa-info-circle',
            title: title,
            content: context,
            type: 'orange',
            theme: 'lock-noti',
            boxWidth: '30%',
            useBootstrap: false,
            draggable: false,
            buttons: {
                ok: function () {}
            }
        });
    }

    static htmlceviri() {
        const prefix = "lblm";

        const html = "html";
        const uyari = "uyari";
        const placeholder = "placeholder";
        const lang = "lang"
        $(`[${prefix}]`).each(function () {
            const yazi = $(this).attr("text");

            if ($(this).attr(prefix) === html) {
                $(this).html(util.ceviri(yazi));
            }
            if ($(this).attr(prefix) === uyari) {
                $(this).attr(uyari, util.ceviri(yazi));
            }
            if ($(this).attr(prefix) === placeholder) {
                $(this).attr(placeholder, util.ceviri(yazi));
            }
            if ($(this).attr(prefix) === lang) {
                $(this).attr(lang, chrome.i18n.getUILanguage());
            }
        });
    }

    static sifredogrula(pwd = null) {
        return new Promise(resolve => {
            util.StorageGet('user__pass').then(sonuc => {
                const hash = md5(pwd);
                const dogrumu = hash === sonuc;
                resolve(dogrumu);
            });
        });
    }

    static WndwFocus(wmd) {
        const opt = {
            focused: true,
        }
        chrome.windows.update(Number(wmd), opt);
    }

    static dogru() {
        return new Promise(resolve => {
            util.StorageRemove("kilit__giris").then(() => {
                util.TabGeriDondur()

                localStorage.Kilitli = "false"
                localStorage.removeItem("settime");
                localStorage.kalanhak = 3;
                resolve("true");
            })
        });
    }

    static TabGeriDondur() {
        const KayitliPencereler = JSON.parse(localStorage.KayitliPencereler),
            tabNewTabID = [];
        KayitliPencereler.forEach((el, index) => {
            const WndwAyarlar = {
                focused: el.focused,
                incognito: el.incognito,
                type: el.type,
                left: el.left,
                top: el.top,
                width: el.width,
                height: el.height
            };
            chrome.windows.create(WndwAyarlar, wnd => {
                if (wnd.tabs.length > 0) tabNewTabID.push(wnd.tabs[0].id);
                chrome.windows.update(wnd.id, { state: el.state })
                for (const tab of el.tabs) {
                    chrome.tabs.create({
                        windowId: wnd.id,
                        index: tab.index,
                        url: tab.url,
                        active: tab.active,
                        selected: tab.selected,
                        pinned: tab.pinned
                    });
                }

                if (KayitliPencereler.length === (index + 1)) {
                    for (const tabID of tabNewTabID) {
                        chrome.tabs.remove(tabID);
                    }
                }
            })
        })
        localStorage.removeItem("KayitliPencereler");
    }

    static ValidMail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return (re.test(String(email).toLowerCase())) ? email : false;
    }

    static LoginKapat() {
        return new Promise(resolve => {
            const {
                EkranID
            } = localStorage;
            chrome.windows.remove(Number(EkranID), doru => {});
            resolve();
        });
    }

    static getDomain(url) {
        try {
            return new URL(url).hostname;
        } catch (err) {
            return;
        }
    }

    static PassRecover() {
        return new Promise((resolve, reject) => {
            let gun = new Date()
            gun.setHours(gun.getHours() + 24)
            util.StorageSet("passDate", gun).then(resolve())
        });
    }

    static StorageSet(kayit, deger, tip = KayitType) {
        return new Promise((resolve, reject) => {

            if (kayit) {
                const stg = {};
                stg[kayit] = deger;
                chrome.storage[tip].set(stg, resolve);
            } else {
                reject("Error, cant save!");
            }

        });
    }

    static TabiKapat() {
        chrome.tabs.getCurrent(function (tab) {
            chrome.tabs.remove(tab.id, function () {});
        });
    }

    static StorageGet(kayit, tip = KayitType) {
        return new Promise((resolve, reject) => {

            if (kayit) {
                chrome.storage[tip].get(kayit, sonuc => {
                    return resolve(sonuc[kayit]);
                });
            } else {
                return reject("Error, cant save!");
            }

        });

    }

    static StorageRemove(kayit, tip = KayitType) {
        return new Promise((resolve, reject) => {

            if (kayit) {
                chrome.storage[tip].remove(kayit, resolve);
            } else {
                return reject("Error, cant save!");
            }

        });
    }

    static ceviri(id) {
        return chrome.i18n.getMessage(id);
    }

    static Tarayici() {
        return ((agent) => {
            switch (true) {
                case agent.includes('edge'):
                    return 'edge';
                case agent.includes('edg'):
                    return 'chromium based edge (dev or canary)';
                case agent.includes('opr') && !!window.opr:
                    return 'opera';
                case agent.includes('chrome') && !!window.Brave && !!navigator.brave && !!navigator.brave.isBrave:
                    return 'brave';
                case agent.includes('chrome') && !!window.navigator.plugins && Array.from(window.navigator.plugins).findIndex(pl => pl.name && pl.name.includes('Chromium PDF')) > -1:
                    return 'chromium';
                case agent.includes('chrome') && !!window.chrome:
                    return 'chrome';
                case agent.includes('firefox'):
                    return 'firefox';
                default:
                    return 'other';
            }
        })(navigator.userAgent.toLowerCase());
    }

    static UrlEkle(link = null) {
        if (link == null || link == "") {
            return false;
        }

        const savedWindows = JSON.parse(localStorage.KayitliPencereler);
        const bilgiler = {
            "index": savedWindows[0].tabs.length,
            "active": true,
            "url": link,
            "selected": true,
            "pinned": false

        }
        for (const tabs of savedWindows[0].tabs) {
            if (tabs.url === link) {
                util.uyarigonder("Browser Lock", util.ceviri("link_zaten_ekli"));
                return false;
            }
        }
        savedWindows[0].tabs.push(bilgiler);
        localStorage.setItem("KayitliPencereler", JSON.stringify(savedWindows));
        util.onaygonder("Browser Lock", util.ceviri("link_eklendi"));
        return true;
    }
}