"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = stringEndsWithValidator;

var _propTypes = require("prop-types");

var _wrapValidator = _interopRequireDefault(require("./helpers/wrapValidator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function stringEndsWithValidator(end) {
  if (typeof end !== 'string' || end.length === 0) {
    throw new TypeError('a non-empty string is required');
  }

  var validator = function stringEndsWith(props, propName, componentName) {
    var propValue = props[propName];

    if (propValue == null) {
      return null;
    }

    for (var _len = arguments.length, rest = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      rest[_key - 3] = arguments[_key];
    }

    var stringError = _propTypes.string.apply(void 0, [props, propName, componentName].concat(rest));

    if (stringError) {
      return stringError;
    }

    if (!propValue.endsWith(end) || propValue.length <= end.length) {
      return new TypeError("".concat(componentName, ": ").concat(propName, " does not end with \"").concat(end, "\""));
    }

    return null;
  };

  validator.isRequired = function requiredStringEndsWith() {
    var stringError = _propTypes.string.isRequired.apply(_propTypes.string, arguments);

    if (stringError) {
      return stringError;
    }

    return validator.apply(void 0, arguments);
  };

  return (0, _wrapValidator["default"])(validator, "stringEndsWith: ".concat(end));
}
//# sourceMappingURL=stringEndsWith.js.map