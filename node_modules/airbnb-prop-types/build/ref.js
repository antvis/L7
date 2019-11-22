"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = require("react");

var _isPlainObject = _interopRequireDefault(require("./helpers/isPlainObject"));

var _wrapValidator = _interopRequireDefault(require("./helpers/wrapValidator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var isPrototypeOf = Object.prototype.isPrototypeOf;

function isNewRef(prop) {
  if (!(0, _isPlainObject["default"])(prop)) {
    return false;
  }

  var ownProperties = Object.keys(prop);
  return ownProperties.length === 1 && ownProperties[0] === 'current';
}

function isCallbackRef(prop) {
  return typeof prop === 'function' && !isPrototypeOf.call(_react.Component, prop) && (!_react.PureComponent || !isPrototypeOf.call(_react.PureComponent, prop));
}

function requiredRef(props, propName, componentName) {
  var propValue = props[propName];

  if (isCallbackRef(propValue) || isNewRef(propValue)) {
    return null;
  }

  return new TypeError("".concat(propName, " in ").concat(componentName, " must be a ref"));
}

function ref(props, propName, componentName) {
  var propValue = props[propName];

  if (propValue == null) {
    return null;
  }

  for (var _len = arguments.length, rest = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    rest[_key - 3] = arguments[_key];
  }

  return requiredRef.apply(void 0, [props, propName, componentName].concat(rest));
}

ref.isRequired = requiredRef;

var _default = function _default() {
  return (0, _wrapValidator["default"])(ref, 'ref');
};

exports["default"] = _default;
//# sourceMappingURL=ref.js.map