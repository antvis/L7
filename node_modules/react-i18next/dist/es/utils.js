export function warn() {
  if (console && console.warn) {
    var _console;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (typeof args[0] === 'string') args[0] = "react-i18next:: ".concat(args[0]);

    (_console = console).warn.apply(_console, args);
  }
}
var alreadyWarned = {};
export function warnOnce() {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  if (typeof args[0] === 'string' && alreadyWarned[args[0]]) return;
  if (typeof args[0] === 'string') alreadyWarned[args[0]] = new Date();
  warn.apply(void 0, args);
} // not needed right now
//
// export function deprecated(...args) {
//   if (process && process.env && (!process.env.NODE_ENV || process.env.NODE_ENV === 'development')) {
//     if (typeof args[0] === 'string') args[0] = `deprecation warning -> ${args[0]}`;
//     warnOnce(...args);
//   }
// }

export function loadNamespaces(i18n, ns, cb) {
  i18n.loadNamespaces(ns, function () {
    // delay ready if not yet initialized i18n instance
    if (i18n.isInitialized) {
      cb();
    } else {
      var initialized = function initialized() {
        // due to emitter removing issue in i18next we need to delay remove
        setTimeout(function () {
          i18n.off('initialized', initialized);
        }, 0);
        cb();
      };

      i18n.on('initialized', initialized);
    }
  });
}
export function hasLoadedNamespace(ns, i18n) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (!i18n.languages || !i18n.languages.length) {
    warnOnce('i18n.languages were undefined or empty', i18n.languages);
    return true;
  }

  var lng = i18n.languages[0];
  var fallbackLng = i18n.options ? i18n.options.fallbackLng : false;
  var lastLng = i18n.languages[i18n.languages.length - 1]; // we're in cimode so this shall pass

  if (lng.toLowerCase() === 'cimode') return true;

  var loadNotPending = function loadNotPending(l, n) {
    var loadState = i18n.services.backendConnector.state["".concat(l, "|").concat(n)];
    return loadState === -1 || loadState === 2;
  }; // bound to trigger on event languageChanging
  // so set ready to false while we are changing the language
  // and namespace pending (depends on having a backend)


  if (options.bindI18n && options.bindI18n.indexOf('languageChanging') > -1 && i18n.services.backendConnector.backend && i18n.isLanguageChangingTo && !loadNotPending(i18n.isLanguageChangingTo, ns)) return false; // loaded -> SUCCESS

  if (i18n.hasResourceBundle(lng, ns)) return true; // were not loading at all -> SEMI SUCCESS

  if (!i18n.services.backendConnector.backend) return true; // failed loading ns - but at least fallback is not pending -> SEMI SUCCESS

  if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns))) return true;
  return false;
}
export function getDisplayName(Component) {
  return Component.displayName || Component.name || (typeof Component === 'string' && Component.length > 0 ? Component : 'Unknown');
}