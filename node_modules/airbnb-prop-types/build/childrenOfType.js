"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _arrayPrototype = _interopRequireDefault(require("array.prototype.find"));

var _getComponentName = _interopRequireDefault(require("./helpers/getComponentName"));

var _renderableChildren = _interopRequireDefault(require("./helpers/renderableChildren"));

var _wrapValidator = _interopRequireDefault(require("./helpers/wrapValidator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function onlyTypes(types, children, componentName) {
  if (!children.every(function (child) {
    return child && (0, _arrayPrototype["default"])(types, function (Type) {
      return Type === '*' || child.type === Type;
    });
  })) {
    var typeNames = types.map(_getComponentName["default"]).join(', or ');
    return new TypeError("`".concat(componentName, "` only accepts children of type ").concat(typeNames));
  }

  return null;
}

function isRequired(types, children, componentName) {
  if (children.length === 0) {
    var typeNames = types.map(_getComponentName["default"]).join(', or ');
    return new TypeError("`".concat(componentName, "` requires at least one node of type ").concat(typeNames));
  }

  return null;
}

function childrenOfType() {
  for (var _len = arguments.length, types = new Array(_len), _key = 0; _key < _len; _key++) {
    types[_key] = arguments[_key];
  }

  if (types.length < 1) {
    throw new TypeError('childrenOfType: at least 1 type is required');
  }

  function validator(props, propName, componentName) {
    return onlyTypes(types, (0, _renderableChildren["default"])(props[propName]), componentName);
  }

  validator.isRequired = function (props, propName, componentName) {
    var children = (0, _renderableChildren["default"])(props[propName]);
    return isRequired(types, children, componentName) || onlyTypes(types, children, componentName);
  };

  return (0, _wrapValidator["default"])(validator, 'childrenOfType', types);
}

var _default = childrenOfType;
exports["default"] = _default;
//# sourceMappingURL=childrenOfType.js.map