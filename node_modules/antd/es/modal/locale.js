function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import defaultLocale from '../locale/default';

var runtimeLocale = _extends({}, defaultLocale.Modal);

export function changeConfirmLocale(newLocale) {
  if (newLocale) {
    runtimeLocale = _extends(_extends({}, runtimeLocale), newLocale);
  } else {
    runtimeLocale = _extends({}, defaultLocale.Modal);
  }
}
export function getConfirmLocale() {
  return runtimeLocale;
}
//# sourceMappingURL=locale.js.map
