// Site-wide GR/EN language toggle.
// Any element that needs an English version carries a data-en="..."
// attribute holding the English markup; its Greek text is just the
// element's normal HTML content. Clicking a GR|EN button in the navbar
// swaps every such element's innerHTML and remembers the choice in
// localStorage so it persists across pages.

(function () {
    const STORAGE_KEY = 'royal_lang';

    function applyLang(lang) {
        document.querySelectorAll('[data-en]').forEach((el) => {
            // First run: capture the original Greek markup before we
            // overwrite anything, so we can always switch back to it.
            if (el.dataset.gr === undefined) {
                el.dataset.gr = el.innerHTML;
            }
            el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.gr;
        });

        document.querySelectorAll('[data-lang-btn]').forEach((btn) => {
            btn.classList.toggle('lang-active', btn.dataset.langBtn === lang);
        });

        document.documentElement.lang = lang === 'en' ? 'en' : 'el';
        localStorage.setItem(STORAGE_KEY, lang);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const stored = localStorage.getItem(STORAGE_KEY) || 'gr';
        applyLang(stored);

        document.querySelectorAll('[data-lang-btn]').forEach((btn) => {
            btn.addEventListener('click', () => applyLang(btn.dataset.langBtn));
        });
    });
})();
