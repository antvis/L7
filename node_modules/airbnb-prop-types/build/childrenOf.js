"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = childrenOf;

var _renderableChildren = _interopRequireDefault(require("./helpers/renderableChildren"));

var _wrapValidator = _interopRequireDefault(require("./helpers/wrapValidator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function validateChildren(propType, children, props) {
  for (var _len = arguments.length, rest = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    rest[_key - 3] = arguments[_key];
  }

  var error;
  children.some(function (child) {
    error = propType.apply(void 0, [_objectSpread({}, props, {
      children: child
    }), 'children'].concat(rest));
    return error;
  });
  return error || null;
}

function childrenOf(propType) {
  function childrenOfPropType(props, propName, componentName) {
    if (propName !== 'children') {
      return new TypeError("".concat(componentName, " is using the childrenOf validator on non-children prop \"").concat(propName, "\""));
    }

    var propValue = props[propName];

    if (propValue == null) {
      return null;
    }

    var children = (0, _renderableChildren["default"])(propValue);

    if (children.length === 0) {
      return null;
    }

    for (var _len2 = arguments.length, rest = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
      rest[_key2 - 3] = arguments[_key2];
    }

    return validateChildren.apply(void 0, [propType, children, props, componentName].concat(rest));
  }

  childrenOfPropType.isRequired = function (props, propName, componentName) {
    if (propName !== 'children') {
      return new TypeError("".concat(componentName, " is using the childrenOf validator on non-children prop \"").concat(propName, "\""));
    }

    var children = (0, _renderableChildren["default"])(props[propName]);

    if (children.length === 0) {
      return new TypeError("`".concat(componentName, "` requires at least one node of type ").concat(propType.typeName || propType.name));
    }

    for (var _len3 = arguments.length, rest = new Array(_len3 > 3 ? _len3 - 3 : 0), _key3 = 3; _key3 < _len3; _key3++) {
      rest[_key3 - 3] = arguments[_key3];
    }

    return validateChildren.apply(void 0, [propType, children, props, componentName].concat(rest));
  };

  return (0, _wrapValidator["default"])(childrenOfPropType, 'childrenOf', propType);
}
//# sourceMappingURL=childrenOf.js.map