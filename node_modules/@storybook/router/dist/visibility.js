"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ToggleVisibility = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ToggleVisibility = function ToggleVisibility(_ref) {
  var hidden = _ref.hidden,
      children = _ref.children;
  return _react["default"].createElement("div", {
    hidden: hidden
  }, children);
};

exports.ToggleVisibility = ToggleVisibility;
ToggleVisibility.displayName = "ToggleVisibility";