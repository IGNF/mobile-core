/** i18n : InternationlizatioN tools
 * @constructor
 * @param {string} lang default language
 */
const I18N = function(lang) {
  this.setLanguage(lang||'en');
}

/** Set default language
 * @param {string} lang default language
 */
I18N.prototype.setLanguage = function(lang) {
  if (lang) {
    this.language = lang;
    if (!this[lang]) this[lang] = {};
  }
};

/** Set internationalization
 * @param {string} lang language
 * @param {*} options a list of key/value
 */
I18N.prototype.set = function(lang, options) {
  for (let i in options) {
    this[lang][i] = options[i]
  }
};

I18N.prototype.template = function (data) {
  for (let i=0, p; p=data[i]; i++) {
    if (p.getAttribute) {
      if (p.getAttribute('data-i18n')) {
        p.innerHTML = _T(p.getAttribute('data-i18n'));
      } else {
        const tr = p.querySelectorAll('[data-i18n]');
        for (let t, k=0; t=tr[k]; k++) {
          t.innerHTML = _T(t.getAttribute('data-i18n'));
        }
      }
    }
  }
}

const i18n = new I18N('fr');

// Deffault values
i18n.set('fr', {
  Cancel: "Annuler",
  OK: "OK",
  qDeleteMap: "Voulez-vous supprimer la carte ?",
  deletion: "Suppression",
  offline: "Mode hors-ligne",
  noOffline: "Votre compte ne vous autorise pas a charger de nouvelles cartes..."
});

/** i18n : InternationlizatioN tools
 * @param {string} s string to translated
 * @return {string} the translated string or the string itself
 */
function _T(s) {
  return i18n[i18n.language][s] || s;
}

export { I18N }
export { i18n }
export default _T
