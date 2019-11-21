"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _objectIs = _interopRequireDefault(require("object-is"));

var _wrapValidator = _interopRequireDefault(require("./helpers/wrapValidator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function isNonNegative(x) {
  return typeof x === 'number' && isFinite(x) && x >= 0 && !(0, _objectIs["default"])(x, -0);
}

function nonNegativeNumber(props, propName, componentName) {
  var value = props[propName];

  if (value == null || isNonNegative(value)) {
    return null;
  }

  return new RangeError("".concat(propName, " in ").concat(componentName, " must be a non-negative number"));
}

function requiredNonNegativeNumber(props, propName, componentName) {
  var value = props[propName];

  if (isNonNegative(value)) {
    return null;
  }

  return new RangeError("".concat(propName, " in ").concat(componentName, " must be a non-negative number"));
}

nonNegativeNumber.isRequired = requiredNonNegativeNumber;

var _default = function _default() {
  return (0, _wrapValidator["default"])(nonNegativeNumber, 'nonNegativeNumber');
};

exports["default"] = _default;
//# sourceMappingURL=nonNegativeNumber.js.map