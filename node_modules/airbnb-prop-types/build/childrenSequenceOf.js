"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = childrenSequenceOfValidator;

var _sequenceOf = _interopRequireDefault(require("./sequenceOf"));

var _renderableChildren = _interopRequireDefault(require("./helpers/renderableChildren"));

var _wrapValidator = _interopRequireDefault(require("./helpers/wrapValidator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function childrenSequenceOfValidator() {
  for (var _len = arguments.length, specifiers = new Array(_len), _key = 0; _key < _len; _key++) {
    specifiers[_key] = arguments[_key];
  }

  var seq = _sequenceOf["default"].apply(void 0, specifiers);

  var validator = function childrenSequenceOf(props, propName, componentName) {
    if (propName !== 'children') {
      return new TypeError("".concat(componentName, " is using the childrenSequenceOf validator on non-children prop \"").concat(propName, "\""));
    }

    var propValue = props[propName];
    var children = (0, _renderableChildren["default"])(propValue);

    if (children.length === 0) {
      return null;
    }

    for (var _len2 = arguments.length, rest = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
      rest[_key2 - 3] = arguments[_key2];
    }

    return seq.apply(void 0, [_objectSpread({}, props, {
      children: children
    }), propName, componentName].concat(rest));
  };

  validator.isRequired = function childrenSequenceOfRequired(props, propName, componentName) {
    if (propName !== 'children') {
      return new TypeError("".concat(componentName, " is using the childrenSequenceOf validator on non-children prop \"").concat(propName, "\""));
    }

    var propValue = props[propName];
    var children = (0, _renderableChildren["default"])(propValue);

    if (children.length === 0) {
      return new TypeError("".concat(componentName, ": renderable children are required."));
    }

    for (var _len3 = arguments.length, rest = new Array(_len3 > 3 ? _len3 - 3 : 0), _key3 = 3; _key3 < _len3; _key3++) {
      rest[_key3 - 3] = arguments[_key3];
    }

    return seq.isRequired.apply(seq, [_objectSpread({}, props, {
      children: children
    }), propName, componentName].concat(rest));
  };

  return (0, _wrapValidator["default"])(validator, 'childrenSequenceOf', specifiers);
}
//# sourceMappingURL=childrenSequenceOf.js.map