"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = elementTypeValidator;

var _propTypes = require("prop-types");

var _reactIs = require("react-is");

var _and = _interopRequireDefault(require("./and"));

var _getComponentName = _interopRequireDefault(require("./helpers/getComponentName"));

var _wrapValidator = _interopRequireDefault(require("./helpers/wrapValidator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function getTypeName(Type) {
  if (typeof Type === 'string') {
    return Type;
  }

  var type = (0, _getComponentName["default"])(Type);
  /* istanbul ignore next */
  // in environments where functions do not have names

  return type || 'Anonymous Component';
}

function validateElementType(Type, props, propName, componentName) {
  var type = props[propName].type;

  if (type === Type) {
    return null;
  }

  return new TypeError("".concat(componentName, ".").concat(propName, " must be a React element of type ").concat(getTypeName(Type)));
}

function elementTypeValidator(Type) {
  if (Type === '*') {
    return (0, _wrapValidator["default"])(_propTypes.element, 'elementType(*)', Type);
  }

  if (!(0, _reactIs.isValidElementType)(Type)) {
    throw new TypeError("Type must be a React Component, an HTML element tag name, or \"*\". Got an ".concat(_typeof(Type)));
  }

  function elementType(props, propName, componentName) {
    if (props[propName] == null) {
      return null;
    }

    for (var _len = arguments.length, rest = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      rest[_key - 3] = arguments[_key];
    }

    return validateElementType.apply(void 0, [Type, props, propName, componentName].concat(rest));
  }

  elementType.isRequired = elementType; // covered by and + element

  var typeName = getTypeName(Type);
  var validatorName = "elementType(".concat(typeName, ")");
  return (0, _wrapValidator["default"])((0, _and["default"])([_propTypes.element, elementType], validatorName), validatorName, Type);
}
//# sourceMappingURL=elementType.js.map