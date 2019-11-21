"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = disallowedIf;

var _wrapValidator = _interopRequireDefault(require("./helpers/wrapValidator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function disallowedIf(propType, otherPropName, otherPropType) {
  if (typeof propType !== 'function' || typeof propType.isRequired !== 'function') {
    throw new TypeError('a propType validator is required; propType validators must also provide `.isRequired`');
  }

  if (typeof otherPropName !== 'string') {
    throw new TypeError('other prop name must be a string');
  }

  if (typeof otherPropType !== 'function') {
    throw new TypeError('other prop type validator is required');
  }

  function disallowedIfRequired(props, propName, componentName) {
    for (var _len = arguments.length, rest = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      rest[_key - 3] = arguments[_key];
    }

    var error = propType.isRequired.apply(propType, [props, propName, componentName].concat(rest));

    if (error) {
      return error;
    }

    if (props[otherPropName] == null) {
      return null;
    }

    var otherError = otherPropType.apply(void 0, [props, otherPropName, componentName].concat(rest));

    if (otherError) {
      return null;
    }

    return new Error("prop \u201C".concat(propName, "\u201D is disallowed when \u201C").concat(otherPropName, "\u201D matches the provided validator"));
  }

  var validator = function disallowedIfPropType(props, propName) {
    if (props[propName] == null) {
      return null;
    }

    for (var _len2 = arguments.length, rest = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      rest[_key2 - 2] = arguments[_key2];
    }

    return disallowedIfRequired.apply(void 0, [props, propName].concat(rest));
  };

  validator.isRequired = disallowedIfRequired;
  return (0, _wrapValidator["default"])(validator, 'disallowedIf', {
    propType: propType,
    otherPropName: otherPropName,
    otherPropType: otherPropType
  });
}
//# sourceMappingURL=disallowedIf.js.map