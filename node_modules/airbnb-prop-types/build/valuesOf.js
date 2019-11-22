"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = valuesOfValidator;

var _isPrimitive = _interopRequireDefault(require("./helpers/isPrimitive"));

var _wrapValidator = _interopRequireDefault(require("./helpers/wrapValidator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// code adapted from https://github.com/facebook/react/blob/14156e56b9cf18ac86963185c5af4abddf3ff811/src/isomorphic/classic/types/ReactPropTypes.js#L307-L340
function valuesOfValidator(propType) {
  if (typeof propType !== 'function') {
    throw new TypeError('objectOf: propType must be a function');
  }

  var validator = function valuesOf(props, propName, componentName, location, propFullName) {
    for (var _len = arguments.length, rest = new Array(_len > 5 ? _len - 5 : 0), _key = 5; _key < _len; _key++) {
      rest[_key - 5] = arguments[_key];
    }

    var propValue = props[propName];

    if (propValue == null || (0, _isPrimitive["default"])(propValue)) {
      return null;
    }

    var firstError;
    Object.keys(propValue).some(function (key) {
      firstError = propType.apply(void 0, [propValue, key, componentName, location, "".concat(propFullName, ".").concat(key)].concat(rest));
      return firstError;
    });
    return firstError || null;
  };

  validator.isRequired = function valuesOfRequired(props, propName, componentName) {
    var propValue = props[propName];

    if (propValue == null) {
      return new TypeError("".concat(componentName, ": ").concat(propName, " is required."));
    }

    for (var _len2 = arguments.length, rest = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
      rest[_key2 - 3] = arguments[_key2];
    }

    return validator.apply(void 0, [props, propName, componentName].concat(rest));
  };

  return (0, _wrapValidator["default"])(validator, 'valuesOf', propType);
}
//# sourceMappingURL=valuesOf.js.map