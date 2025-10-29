let currentLang = "en";


(function () {
    const SUPPORTED = ["en", "de", "es", "fr", "ja", "pt"];
    const DEFAULT_LANG = "en";
    const I18N_PATH = (lang) => `i18n/${lang}.json`;

    function detectLang() {
        const urlLang = new URLSearchParams(location.search).get("lang");
        const norm = (x) => (x || "").toLowerCase().slice(0, 2);
       const qLang = norm(urlLang);

        if (SUPPORTED.includes(qLang)) return qLang;

        const sysLang = norm(
            navigator.language || (navigator.languages && navigator.languages[0]),
        );
        if (SUPPORTED.includes(sysLang)) return sysLang;

        return DEFAULT_LANG;
    }

    currentLang = detectLang();

    const footerElement = document.querySelector('footer');
    const newFontSize = (currentLang === "en") ? '.815rem' : '.5rem';
    console.log(currentLang)
    if (footerElement) {
        footerElement.style.fontSize = newFontSize;
    }

    // для скринридеров
    document.documentElement.setAttribute("lang", currentLang);

    async function loadDict(language) {
        const res = await fetch(I18N_PATH(language)).catch(() => null);
        if (!res || !res.ok) {
            return language !== DEFAULT_LANG ? loadDict(DEFAULT_LANG) : {};
        }
        return res.json();
    }

    function interpolate(str, params = {}) {
        return String(str).replace(/{{\s*([\w.-]+)\s*}}/g, (_, key) => {
            const val = key
                .split(".")
                .reduce(
                    (acc, k) => (acc && acc[k] != null ? acc[k] : undefined),
                    params,
                );
            return val != null ? String(val) : "";
        });
    }

    function applyI18n(dict) {
        const nodes = document.querySelectorAll("[data-i18n]");
        nodes.forEach((el) => {
            const key = el.getAttribute("data-i18n");
            if (!key) return;

            let params = {};
            const rawParams = el.getAttribute("data-i18n-params");
            if (rawParams) {
                try {
                    params = JSON.parse(rawParams);
                } catch (_) {}
            }

            const tmpl = dict[key] ? dict[key] : key;
            const html = interpolate(tmpl, params);

            el.innerHTML = html;
        });
    }

    loadDict(currentLang).then(applyI18n).catch(console.error);

})();

const yearlyBtn = document.getElementById("box-fers")
const bestPlug = document.getElementById("aboveBest")
const weeklyBtn = document.getElementById("box-weekly")

function changeStyle () {
    document?.addEventListener("click",(event) =>{

        const clickYearly = event.target.closest("#box-fers")
        const clickWeekly = event.target.closest("#box-weekly")

        if (clickYearly){
            yearlyBtn.classList.add("chosen")
            bestPlug.classList.add("chosen-best")
            weeklyBtn?.classList.remove("chosen")
        } else if(clickWeekly){
            yearlyBtn?.classList.remove("chosen")
            bestPlug?.classList.remove("chosen-best")
            weeklyBtn.classList.add("chosen")
        }
    })
}

function chosenLink (){

    const targetYear = "https://google.com/";
    const targetWeek = "https://apple.com/";

    document.addEventListener("click", function (event){
        const clickContinue = event.target.closest("#box-continue")
        if(clickContinue){
            if (yearlyBtn && yearlyBtn.classList.contains("chosen") ||  bestPlug && bestPlug.classList.contains("chosen-best")){
                window.location.href = targetYear;
            } else if(weeklyBtn && weeklyBtn.classList.contains("chosen")){
                window.location.href = targetWeek;
            }
        }
    })
}
changeStyle();
chosenLink ()