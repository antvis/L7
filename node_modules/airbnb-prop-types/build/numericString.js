"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _propTypes = require("prop-types");

var _wrapValidator = _interopRequireDefault(require("./helpers/wrapValidator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var validNumericChars = /^[-+]?(?:[1-9][0-9]*(?:\.[0-9]+)?|0|0\.[0-9]+)$/;

var validator = function numericString(props, propName, componentName) {
  if (props[propName] == null) {
    return null;
  }

  for (var _len = arguments.length, rest = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    rest[_key - 3] = arguments[_key];
  }

  var stringError = _propTypes.string.apply(void 0, [props, propName, componentName].concat(rest));

  if (stringError) {
    return stringError;
  }

  var value = props[propName];
  var passesRegex = validNumericChars.test(value);

  if (passesRegex) {
    return null;
  }

  return new TypeError("".concat(componentName, ": prop \"").concat(propName, "\" (value \"").concat(value, "\") must be a numeric string:\n    - starting with an optional + or -\n    - that does not have a leading zero\n    - with an optional decimal part (that contains only one decimal point, if present)\n    - that otherwise only contains digits (0-9)\n    - not +-NaN, or +-Infinity\n  "));
};

validator.isRequired = function numericStringRequired(props, propName, componentName) {
  if (props[propName] == null) {
    return new TypeError("".concat(componentName, ": ").concat(propName, " is required"));
  }

  for (var _len2 = arguments.length, rest = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
    rest[_key2 - 3] = arguments[_key2];
  }

  return validator.apply(void 0, [props, propName, componentName].concat(rest));
};

var _default = function _default() {
  return (0, _wrapValidator["default"])(validator, 'numericString');
};

exports["default"] = _default;
//# sourceMappingURL=numericString.js.map