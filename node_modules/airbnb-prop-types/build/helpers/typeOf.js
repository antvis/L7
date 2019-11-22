"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = typeOf;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function typeOf(child) {
  if (child === null) {
    return 'null';
  }

  if (Array.isArray(child)) {
    return 'array';
  }

  if (_typeof(child) !== 'object') {
    return _typeof(child);
  }

  if (_react["default"].isValidElement(child)) {
    return child.type;
  }

  return child;
}
//# sourceMappingURL=typeOf.js.map