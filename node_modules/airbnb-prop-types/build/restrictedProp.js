"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _wrapValidator = _interopRequireDefault(require("./helpers/wrapValidator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function customMessageWrapper(messsageFunction) {
  function restrictedProp(props, propName, componentName, location) {
    if (props[propName] == null) {
      return null;
    }

    if (messsageFunction && typeof messsageFunction === 'function') {
      for (var _len = arguments.length, rest = new Array(_len > 4 ? _len - 4 : 0), _key = 4; _key < _len; _key++) {
        rest[_key - 4] = arguments[_key];
      }

      return new TypeError(messsageFunction.apply(void 0, [props, propName, componentName, location].concat(rest)));
    }

    return new TypeError("The ".concat(propName, " ").concat(location, " on ").concat(componentName, " is not allowed."));
  }

  restrictedProp.isRequired = restrictedProp;
  return restrictedProp;
}

var _default = function _default() {
  var messsageFunction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  return (0, _wrapValidator["default"])(customMessageWrapper(messsageFunction), 'restrictedProp');
};

exports["default"] = _default;
//# sourceMappingURL=restrictedProp.js.map