class notification {
    static yuklendi(version = null) {
        var id = Math.floor((Math.random() * 100) + 1);
        const opt = {
            type: 'basic',
            iconUrl: '../logos/48-logo.png',
            title: util.ceviri("uygulama_baslik"),
            message: version + ' ' + util.ceviri("uygulama_baslik")+ " " + util.ceviri("basari_ile_yuklendi"),
            contextMessage: util.ceviri("created_by")
        };
        chrome.notifications.create(id.toString(), opt);
    }

    static sifreuyar() {
        if (localStorage.BidaUyarma != "true") {
            var id = Math.floor((Math.random() * 100) + 1);
            const opt = {
                type: 'basic',
                iconUrl: '../logos/48-logo.png',
                title: util.ceviri("uygulama_baslik"),
                message: util.ceviri("tarayici_kilitle_uyari"),
                contextMessage: util.ceviri("created_by"),
                requireInteraction: true,
                priority: 2,
                buttons: [
                    {
                        title: util.ceviri("evet_btn")
                    },
                    {
                        title: util.ceviri("tekrar_sorma_btn")
                    }
                ]
            };
            chrome.notifications.create(id.toString(), opt);
            chrome.notifications.onButtonClicked.addListener((nid, btnindex) => {
                if (btnindex == 0) {
                    util.ContextTiklama();
                }
                else if (btnindex == 1) {
                    localStorage.BidaUyarma = "true";
                }
                chrome.notifications.clear(nid);
            });
            //chrome.notifications.onClicked.addListener(() => util.ContextTiklama());
        }
    }

    static UyariKaldir(notid = null) {
        return new Promise(resolve => {
            try {
                if (!notid) return false;
                chrome.notifications.clear(notid.toString(), donus => {
                    console.log(donus);
                });
                resolve(true);
            } catch (error) {
                resolve(false);
            }
        })
    }
}