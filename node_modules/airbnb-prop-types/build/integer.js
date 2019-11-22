"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _isInteger = _interopRequireDefault(require("./helpers/isInteger"));

var _wrapValidator = _interopRequireDefault(require("./helpers/wrapValidator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function requiredInteger(props, propName, componentName) {
  var propValue = props[propName];

  if (propValue == null || !(0, _isInteger["default"])(propValue)) {
    return new RangeError("".concat(propName, " in ").concat(componentName, " must be an integer"));
  }

  return null;
}

var validator = function integer(props, propName) {
  var propValue = props[propName];

  if (propValue == null) {
    return null;
  }

  for (var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    rest[_key - 2] = arguments[_key];
  }

  return requiredInteger.apply(void 0, [props, propName].concat(rest));
};

validator.isRequired = requiredInteger;

var _default = function _default() {
  return (0, _wrapValidator["default"])(validator, 'integer');
};

exports["default"] = _default;
//# sourceMappingURL=integer.js.map