$(document).ready(async function () {
    await option.start();
    util.Analytics();
    setTimeout(() => {
        showalerts()

    }, 500);
});

//Puanla uyarısı
function showalerts() {
    option.notfyMe(util.ceviri("bizi_puanla"), "puanla");

    //Ext gizlilik uyarısı
    chrome.extension.isAllowedIncognitoAccess(donus => {
        if (donus) return false;
        option.notfyMe(util.ceviri("gizli_pencere"), "gizli");
    })
}


document.addEventListener("DOMContentLoaded", function () {
    util.htmlceviri();
    util.darkMode();
});

var uygulamaBaslik = util.ceviri("uygulama_baslik");

$(window).on("error", function () {
    //alert("error!");
});

//Switch Kontrol
$("input[type='checkbox']").on("click", function (e) {
    const localname = $(this).attr("local");
    option.switchSonuc(this.id, $(this).is(':checked')).then((resolve, reject) => {
        if (resolve === "true") {
            localStorage.setItem(localname, $(this).is(':checked'))
            util.darkMode();
        } else {
            e.preventDefault()
        }
    })
});

//Şifre Değiştirme
$(".change__pass__btn").on("click", donus => {
    donus.preventDefault()
    option.checkinput().then(resolve => {
        if (resolve) {
            const oldInput = $("input[name=old-browser-pass]");
            const newInput = $("input[name=new-browser-pass]");
            const newaInput = $("input[name=new-again-browser-pass]");
            const oldPassHash = md5($(oldInput).val());
            util.StorageGet("user__pass").then(sonuc => {
                if (sonuc) {

                    if (oldPassHash === sonuc) {

                        if ($(newInput).val() === $(newaInput).val()) {

                            if ($(newInput).val() != $(oldInput).val()) {
                                const nesPassHash = md5($(newInput).val());
                                util.StorageSet("user__pass", nesPassHash).finally(() => {
                                    util.onaygonder(uygulamaBaslik, util.ceviri("sifre_degisti"));
                                });
                            } else {
                                option.Alert($(newInput));
                                util.uyarigonder(uygulamaBaslik, util.ceviri("eski_yeni_sifre_ayni"));
                            }

                        } else {
                            option.Alert($(newaInput));
                            util.uyarigonder(uygulamaBaslik, util.ceviri("yeni_sifre_eslesmedi"));
                        }

                    } else {
                        option.Alert($(oldInput));
                        util.uyarigonder(uygulamaBaslik, util.ceviri("sifre_yanlis"));
                    }
                } else {
                    util.TabiKapat();
                }
            })
        } else {
            event.preventDefault();
        }
    });
});

//İnput Odaklanma
$("input").on("focus", donus => {
    if ($(donus.target).parent().hasClass("alert")) {
        $(donus.target).parent().removeClass("alert");
    }
});
$("form").submit(function (e) { 
    e.preventDefault();
});
//Sağ üst uyarıları
$(document).on('click', '.notifyjs-uyar-base', (e) => {

    switch (Object.values(e.currentTarget.classList)[1]) {
        case "notifyjs-uyar-gizli":
            chrome.tabs.query({}, tabs => {
                const tabara = tabs.find(tab => tab.url.indexOf('chrome://extensions') !== -1)
                if (tabara) {
                    chrome.tabs.update(tabara.id, {
                        url: 'chrome://extensions/?id=' + chrome.runtime.id,
                        active: true
                    });
                } else {
                    chrome.tabs.create({
                        url: 'chrome://extensions/?id=' + chrome.runtime.id
                    });
                }
            })
            break;
        case "notifyjs-uyar-puanla":
            chrome.tabs.create({
                url: 'https://www.patreon.com/humbldump'
            });
            break;
        default:
            console.log("bip bap bop");
            break;
    }

})

//Change mail butonu tıklaması
$(document).on("click", ".mail_button_section button#btn__field.btn-1e.main__mail__btn", function maildegis() {
    if (mail = util.ValidMail(window.prompt(alert(util.ceviri('epostani_gir')), "e.g. humbldump@protonmail.com"))) {
        localStorage.setItem('MainMail', mail)
    }
    else {
        alert(util.ceviri('eposta_hatali'))
    }
});




class option {
    static start() {
        return new Promise((resolve, reject) => {
            util.StorageGet("user__pass").then(async sonuc => {
                if (!sonuc) {
                    await option.girisyap();
                } else if (localStorage.FormLogin != "true") {
                    await option.LoginPass(sonuc);
                }
            }).finally(() => {
                option.MailKontrol();
                option.switchKontrol();
                option.notifyCSS();

                $("body .options .wrapper.disabled").removeClass('disabled');
                resolve();
            });
        });
    }




    static switchSonuc(elm, iliski) {
        return new Promise((resolve, reject) => {
            switch (elm) {
                //Kilit Ayarı
                case "browser__lock__switch":
                    if (iliski == true) {
                        util.onaygonder(uygulamaBaslik, util.ceviri("tarayici_kilit") + util.ceviri("acik"));
                    } else {
                        util.onaygonder(uygulamaBaslik, util.ceviri("tarayici_kilit") + util.ceviri("kapali"));
                    }
                    break;
                //Karanlık Mod Ayarı
                case "dark__mode__switch":
                    if (iliski == true) {
                        util.onaygonder(uygulamaBaslik, util.ceviri("karanlik_mod") + util.ceviri("acik"));
                    } else {
                        util.onaygonder(uygulamaBaslik, util.ceviri("karanlik_mod") + util.ceviri("kapali"));
                    }
                    break;
                //Şifre Sıfırlama Ayarı
                case "password__recovery__switch":
                    if (iliski == true) {
                        util.onaygonder(uygulamaBaslik, util.ceviri("sifremi_unuttum") + util.ceviri("acik"));
                    } else {
                        util.onaygonder(uygulamaBaslik, util.ceviri("sifremi_unuttum") + util.ceviri("kapali"));
                    }
                    break;
                //Derin Güvenlik Ayarı
                case "password__attempt__switch":
                    if (iliski == true) {
                        util.onaygonder(uygulamaBaslik, util.ceviri("derin_guvenlik") + util.ceviri("acik"));
                    } else {
                        util.onaygonder(uygulamaBaslik, util.ceviri("derin_guvenlik") + util.ceviri("kapali"));
                    }
                    break;
                //Geçmiş Temizleme Ayarı
                case "clear__history__switch":
                    if (localStorage.getItem('WrongAttempt') != "true") {
                        util.uyarigonder(uygulamaBaslik, util.ceviri("derin_guvenlik") + util.ceviri("kapali"));
                        resolve("false");
                    } else {
                        if (iliski == true) {
                            util.onaygonder(uygulamaBaslik, util.ceviri("gecmisi_temizle") + util.ceviri("acik"));
                        } else {
                            util.onaygonder(uygulamaBaslik, util.ceviri("gecmisi_temizle") + util.ceviri("kapali"));
                        }
                    }
                    break;
                default:
                    resolve("false");
                    break;
            }
            resolve("true");
        });
    }

    static switchKontrol() {
        $("input[type='checkbox']").each((index, elm) => {
            const localname = $(elm).attr("local");
            const ayar = localStorage.getItem(localname) === 'true';
            $(elm).prop("checked", ayar);
        });

    }

    static MailKontrol() {

        if (util.ValidMail(localStorage.getItem("MainMail")) == false) {

            //todo tekrar bak bura knk
            //? Kullanıcı maili sisteme kayıtlı mı kontrolü

            var mail = window.prompt(util.ceviri('epostani_gir'), "e.g. humbldump@protonmail.com")
            if (util.ValidMail(mail) != false) {
                //mail ayarları
                localStorage.setItem('MainMail', mail); 
                localStorage.setItem('PassRecovery','true');
            }
            else {
                alert(util.ceviri('eposta_hatali'))
                this.MailKontrol()
            }

        }

        $(".main__mail__btn").text(util.ceviri("eposta_degistir"));
        $(".email__show_").text(localStorage.getItem("MainMail")).parent().removeClass("disabled");
    }

    static notfyMe(text = "Error!", className = "hata") {
        $.notify(text, {
            style: 'uyar',
            autoHide: false,
            className: className
        });
    }

    static notifyCSS() {
        $.notify.addStyle('uyar', {
            html: '<div><div class="notfy__class"><div class="notify__ic"><div class="notify__icon"><i class="fa fa-exclamation"></i></div><div class="notfiy__text"><span data-notify-text></span></div></div></div></div>',
        });
    }

    static LoginPass(pass = null) {

        return new Promise((resolve, reject) => {
            if (pass) {
                $.confirm({
                    title: util.ceviri("oturum_ac_buton"),
                    content: 'url:loginform.html',
                    type: 'blue',
                    theme: 'lock-noti',
                    boxWidth: '30%',
                    useBootstrap: false,
                    draggable: false,
                    onContentReady: function () {
                        util.htmlceviri();
                    },
                    buttons: {
                        save: {
                            text: 'Login in',
                            btnClass: 'btn-blue',
                            keys: ['enter'],
                            action: function () {
                                var Sifre = this.$content.find('input#login__pass');

                                try {
                                    if (!Sifre.val()) throw util.ceviri('sifre_gir_uyari');
                                    if (md5(Sifre.val()) != pass) throw util.ceviri('sifre_yanlis');


                                    localStorage.setItem('FormLogin', 'true');



                                    resolve()
                                    return true;
                                } catch (error) {
                                    alert(error);
                                    $(Sifre).focus().val("");
                                    return false;
                                }
                            }
                        }
                    }
                })
            }
        });


    }

    static checkinput() {
        return new Promise(resolve => {
            var hata = true;
            $("input[type=password]").each(function (index, element) {
                if ($(this).val().length <= 0) {
                    $(this).parent().addClass('alert');
                    hata = false;
                }
            });
            resolve(hata);
        });
    }

    static Alert(element = null) {
        if ($(element).hasClass("validate-area")) {
            $(element).addClass("alert").focus().val("");
        } else if ($(element).parent().hasClass("validate-area")) {
            $(element).parent().addClass("alert").focus().val("");
        } else {
            console.log("Hata");
        }
    };


    static checkAlert() {
        if ($("validate-area").hasClass("alert")) {
            return false;
        } else {
            return true;
        }
    }


    static LockKapa() {
        return new Promise(resolve => {
            $.confirm({
                title: uygulamaBaslik,
                content: util.ceviri("tarayici_kilit_ac"),
                icon: 'fa fa-info-circle',
                type: 'orange',
                theme: 'lock-noti',
                boxWidth: '30%',
                useBootstrap: false,
                draggable: false,
                buttons: {
                    yes: {
                        text: util.ceviri("evet_btn"),
                        action: function () {
                            resolve(true);
                        }
                    },
                    no: {
                        text: util.ceviri("hayir_btn"),
                        action: function () {
                            resolve(true);
                        }
                    }
                }
            });
        });
    }

    //Kayit
    static girisyap() {
        return new Promise((resolve, reject) => {
            $.confirm({
                title: util.ceviri("ana_sifre_olustur"),
                content: 'url:form.html',
                type: 'blue',
                theme: 'lock-noti',
                boxWidth: '30%',
                useBootstrap: false,
                draggable: false,
                onContentReady: function () {
                    util.htmlceviri();
                },
                buttons: {
                    save: {
                        text: util.ceviri("kaydet_buton"),
                        btnClass: 'btn-blue',
                        keys: ['enter'],
                        action: function () {
                            var Sifre = this.$content.find('input#first__pass');
                            var Sifret = this.$content.find('input#first__pass__again');
                            var Mail = this.$content.find('input#pass__mail');

                            if (Sifre.val().length > 0 && Sifre.val().length <= 25) {

                                if (util.ValidMail(Mail.val()) == false) {
                                    alert(util.ceviri('eposta_hatali'))
                                    $(Mail).focus()
                                    return false
                                }


                                if (Sifre.val() === Sifret.val()) {
                                    try {
                                        util.StorageSet("user__pass", md5(Sifre.val()))
                                            .then(() => {
                                                localStorage.setItem('KilitAcik', 'true');
                                                localStorage.setItem('Kilitli', 'false');

                                                //mail ayarları
                                                localStorage.setItem('MainMail', $(Mail).val()); localStorage.setItem('PassRecovery','true');
                                                
                                                $("#browser__lock__switch").prop("checked", true);


                                                alert(util.ceviri("ana_sifre_olusturuldu"));


                                            }).finally(() => {
                                                resolve()
                                                return true;

                                            });
                                    } catch (error) {
                                        alert(util.ceviri("ana_sifre_kaydedilmedi"));
                                        util.TabiKapat();
                                    }
                                } else {
                                    alert(util.ceviri("yeni_sifre_eslesmedi"));
                                    $(Sifret).focus();
                                    return false;
                                }

                            } else {
                                alert(util.ceviri("sifre_uzunluk_kontrol"));
                                $(Sifre).focus();
                                return false;
                            }
                        }
                    }
                }
            });
        });

    }


}