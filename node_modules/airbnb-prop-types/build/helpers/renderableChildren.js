"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = renderableChildren;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function renderableChildren(childrenProp) {
  return _react["default"].Children.toArray(childrenProp).filter(function (child) {
    return child === 0 || child;
  });
}
//# sourceMappingURL=renderableChildren.js.map