var hkljdm = "false";

document.addEventListener("DOMContentLoaded", function () {
    util.htmlceviri();
    util.darkMode();
    util.Analytics();
});

$(document).contextmenu(function () {
    return false;
});

$("form").submit(function (e) { 
    e.preventDefault();
});

$("#login_btn_field").on("click", function (e) {
    if (localStorage.settime) return false;
    e.preventDefault();
    const input = $(".tarayici__pwd");
    if (input.val().length === 0) {
        input.parent().addClass("alert");
    } else {
        util.sifredogrula(input.val()).then(donus => {
            if (donus) {
                util.dogru().then(() => {
                    chrome.windows.getCurrent({
                        populate: false
                    }, a => {
                        localStorage.setItem("KilitEkran", "false");
                        chrome.windows.remove(a.id);
                    });
                });
            } else {
                $(".password_lost").removeClass("hidden");
                if (localStorage.getItem('WrongAttempt') != "true") {
                    $(input).val("");
                } else {
                    kalanhak.kalan().then(donus => {
                        if (donus <= 0) {
                            util.uyarigonder("opps!", util.ceviri("deneme_kaldi_bir") + donus + util.ceviri("deneme_kaldi_iki"));
                            kalanhak.kilitle();
                        } else {
                            util.uyarigonder("opps!", util.ceviri("deneme_kaldi_bir") + donus + util.ceviri("deneme_kaldi_iki"));
                            $(input).val("");
                        }
                    });
                }
            }
        })
    }
});


//Şifreyi göster eventi
$(document).on("mouseup mousedown mouseleave",".show_password",  function (e) {
    

    let sclass = (e.type == "mousedown") ? "text" : (e.type == "mousedown" || e.type == "mouseleave") ? "password" : "password"
    $( this ).siblings("#pass__field").attr('type',sclass)


});

$("input").focus(function (event) {
    if ($(this).parent(".validate-area").hasClass('alert')) {
        $(this).parent(".validate-area").removeClass('alert');
    }
});


$(document).ready(async function () {
    kalanhak.checkfortrue();
    await login.LoadRecaptcha();
    $(".tarayici__pwd").focus();
});

/* Açılışa yeni link ekle */
$(".linkekleme").on("click", function (e) {
    var link = $(this).attr("link");
    if (link.length > 0) {
        util.UrlEkle(link);
    }
});

/* Şifre sıfırlama bölümü eventleri */

$(".password_lost").click(function (e) { 
    e.preventDefault();
    $(".bars__location i").trigger("click");
});

$(".bars__location i").on("click", (event) => {
    if (util.ValidMail(localStorage.getItem('MainMail')) == false) {
        util.uyarigonder("Browser Lock", "We couldn't find your mail adress." );
    }
    else if (localStorage.getItem('PassRecovery') != 'true') {
        util.uyarigonder("Browser Lock", "nope" );
    }
    else {
        if (hkljdm == "false") {
            alert("try again later! Google script couldnt loaded!")
            console.log("Recaptcha Script Yüklenemedi!");
        } else {
            login.recaptcha().then((resolve, reject) => {
                util.AnalyticsEvent("sifre_recovery","sifre recovery has been started")
                if (resolve == "true") {
                    $(".pass_root, #" + event.target.id).toggleClass("kapali").trigger("ackapa");
                    if ($(event.target).hasClass("fa-bars")) {
                        $(event.target).removeClass("fa-bars").addClass("fa-times");
                    } else {
                        $(event.target).removeClass("fa-times").addClass("fa-bars");
                    }

                    login.sifirlaFront();

                } else {
                    console.log(reject);
                }
            });
        }
    }
});

$(".pass_root").on("ackapa", function () {
    const sa = $(this).hasClass("kapali");
    if (sa === false) {
        $("#login_btn_field").prop("disabled", true)
    } else {
        $("#login_btn_field").prop("disabled", false)
    }
});

$(document).on("click", "#recovery_btn_field", function (e) {
    let time = +new Date(localStorage.lastrecovery) - +new Date() ;
    if (time > 0) {
        util.uyarigonder("Browser Lock", util.ceviri("gunde_sadece_birkez") );
        return false;
    }
    e.preventDefault();
    if (login.secToken == null) {
        grecaptcha.execute();
    } else {
        login.SifreSifirla();
    }
});

$(document).on("click", "#change__pass_btn", function (e) {
    e.preventDefault();
    login.ChangePass();
});

window.addEventListener('unhandledrejection', function (event) {
    alert("something went wrong: " + event.reason);
});

class login {


    static ChangePass(){
        const ircode = $("#change__pass__input");
        const npass = $("#new__pass__input");
        const rcode = localStorage.getItem("RecoveryCode");
        if (rcode == null || rcode == "") {
            login.sifirlaFront();
        }
        else{
            if (md5($(ircode).val()) === rcode) {
                if (npass.val().length > 0 && npass.val().length <= 25) {
                    try {
                        util.StorageSet("user__pass", md5(npass.val())).then(()=>{
                            util.onaygonder("Browser Lock", util.ceviri("sifre_ok_degisti")+ npass.val());
                            localStorage.removeItem("RecoveryCode");

                            let s = new Date();
                            s.setHours(s.getHours() + 24);
                            localStorage.setItem( "lastrecovery", s );
                            login.sifirlaFront();
                        });
                    } catch (error) {
                        alert(error);
                        login.sifirlaFront();
                    }
                }
                else{
                    util.uyarigonder("Browser Lock", util.ceviri("sifre_uzunluk_kontrol"));
                    npass.parent().addClass("alert");
                }
            }
            else{
                util.uyarigonder("Browser Lock", util.ceviri("kurtarma_kod_yanlis"));
                $(ircode).parent().addClass("alert");
            }
        }
    }

    static recaptcha() {
        return new Promise((resolve, reject) => {
            try {
                if (this.grendered === "true") {
                    resolve("true");
                }
                grecaptcha.render("antibotDogrula", {
                    "sitekey": "6Ld3_L4ZAAAAAPwvE3CnW25c_hGwUHjRMpjk5ZWj",
                    "size": "invisible",
                    "callback": (donus) => {
                        this.secToken = donus;
                        console.log(donus);
                        login.SifreSifirla();
                    },
                    'isolated': false
                });
                this.grendered = "true";
                resolve("true");
            } catch (error) {
                reject(error);
            }
        });
    }

    static SifreSifirla() {
        return new Promise((resolve, reject) => {
            let sifre = $('#recovery__input');
            let userMail = localStorage.getItem('MainMail');
            if ($(sifre).val() == null || $(sifre).val() == "") {
                $(sifre).parent().addClass("alert");
                resolve();
            } else if ($(sifre).val() != userMail) {
                util.uyarigonder("Browser Lock", util.ceviri("eposta_yanlis") );
                resolve();
            } else if (login.secToken == null || login.secToken == "") {
                util.uyarigonder("Browser Lock", util.ceviri("grecaptcha_hatasi") );
            } else {
                login.KodDonder(userMail).then((c, reject) => {
                    if (c['hata'] != false) {
                        var uyari;
                        switch (c.hata) {
                            case 1:
                                uyari = "Something went wrong with mail adress. Please try again later."
                                break;
                            case 2:
                                uyari = "Something went wrong with mail adress. Please try again later."
                                break;
                            case 3:
                                uyari = "Something went wrong with recaptcha. Please try again later."
                                break;
                            case 4:
                                uyari = "Something went wrong with mail sending. Please try again later. If this keep happining please contact with me on humbldump@protonmail.com"
                                break;
                            case 5:
                                uyari = "Something went wrong with recaptcha. Please restart your browser."
                                break;
                            default:
                                uyari = "Something went wrong . Please restart your browser."
                                break;
                        }
                        if (uyari) {
                            util.uyarigonder("Browser Lock", uyari);
                        }
                    } else {
                        localStorage.setItem("RecoveryCode", c['rcode']);
                        login.sifirlaFront();
                    }
                });
            }
        });

    }

    static sifirlaFront() {
        const rcode = localStorage.getItem("RecoveryCode");
        if (rcode == null || rcode == "") {
            $("#recovery__container").removeClass("hidden");
            $("#change__pass__container").addClass("hidden");
        }
        else{
            $("#recovery__container").addClass("hidden");
            $("#change__pass__container").removeClass("hidden");
        }
    }

    static KodDonder(mailAdd) {
        return new Promise((resolve, reject) => {
            login.showLoading("ac");
            $.ajax({
                    type: "POST",
                    url: "https://worker.indiryo.com/browserlock/mail/",
                    data: {
                        mail: mailAdd,
                        grecaptcha: login.secToken
                    },
                    dataType: "json"
                })
                .done((a, b) => {
                    if (b === "success") {
                        login.showLoading("kapat");
                        resolve(a);
                    }
                })
                .catch((a, b) => {
                    if (b) {
                        if (a['status'] == 401) {
                            util.uyarigonder("error", "Something went wrong!");
                        }
                        login.showLoading("kapat");
                        reject(a['statusText']);
                    }
                })
        });
    }


    static LoadRecaptcha() {
        return new Promise((resolve, reject) => {
            $.getScript("https://www.google.com/recaptcha/api.js?render=explicit", function (script, textStatus, jqXHR) {
                if (textStatus != "success") {
                    reject("Yüklenemedi");
                } else {
                    hkljdm = "true";
                    resolve();
                }
            });
        });
    }

    static showLoading(komut) {

        if (komut === "ac") {
            $(".form__loading").removeClass("hidden").siblings(".btn__text").addClass("hidden").parent("button").prop('disabled', true);
        } else if (komut === "kapat") {
            $(".form__loading").addClass("hidden").siblings(".btn__text").removeClass("hidden").parent("button").prop('disabled', false);
        }
    }

}