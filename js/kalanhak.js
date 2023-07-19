class kalanhak {
    static kilitle() {
        if (localStorage.getItem('ClearHistory') === 'true') {
            chrome.history.deleteAll(() => {
                console.log('gg silindi geçmiş');
            })
        }
        kalanhak.surebaslat();
    }

    static kalan() {
        return new Promise(resolve => {
            var kalandeneme = localStorage.kalanhak;
            kalandeneme = kalandeneme - 1;
            localStorage.kalanhak = kalandeneme;
            resolve(kalandeneme);
        });
    }


    static surebaslat() {
        var s = new Date();
        s.setSeconds(s.getSeconds() + 180);
        localStorage.settime = s;
        kalanhak.gerisayim();
    }


    static forumkilitle() {
        document.getElementById('count__base').classList.remove("hidden");
        document.getElementById('pass__field').disabled = true;
        document.getElementById('login_btn_field').disabled = true;
    }

    static forumkilitac() {
        document.getElementById('count__base').classList.add("hidden");
        document.getElementById('pass__field').disabled = false;
        document.getElementById('login_btn_field').disabled = false;
    }

    static SureBitir() {
        localStorage.removeItem("settime");
        localStorage.kalanhak = 3;
        kalanhak.forumkilitac();
    }


    static gerisayim() {
        if (localStorage.settime === false || !localStorage.settime) return false;
        var z = setInterval(function () {
            var difference = +new Date(localStorage.settime) - +new Date();
            var dakika = Math.floor((difference / 1000 / 60) % 60);
            var saniye = Math.floor((difference / 1000) % 60);
            document.getElementById('count__ss').innerText = (dakika * 60) + saniye;
            kalanhak.forumkilitle();
            if (saniye <= 0 && dakika <= 0) {
                kalanhak.SureBitir();
                clearInterval(z);
            }
        }, 1000);
    }

    static checkfortrue() {
        if (localStorage.settime) {
            this.gerisayim();
        } else {
            localStorage.kalanhak = 3;
        }
    }
}