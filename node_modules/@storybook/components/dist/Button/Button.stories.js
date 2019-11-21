"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _Button = require("./Button");

var _icon = require("../icon/icon");

var _index = require("../form/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var FormButton = _index.Form.Button;

var _ref =
/*#__PURE__*/
_react["default"].createElement("div", null, _react["default"].createElement("p", null, "Button that is used for forms"), _react["default"].createElement(FormButton, null, "Form.Button"), _react["default"].createElement("br", null), _react["default"].createElement("p", null, "Buttons that are used for everything else"), _react["default"].createElement(_Button.Button, {
  primary: true
}, "Primary"), _react["default"].createElement(_Button.Button, {
  secondary: true
}, "Secondary"), _react["default"].createElement(_Button.Button, {
  outline: true,
  containsIcon: true
}, _react["default"].createElement(_icon.Icons, {
  icon: "link"
})), _react["default"].createElement("br", null), _react["default"].createElement(_Button.Button, {
  outline: true
}, "Outline"), _react["default"].createElement(_Button.Button, {
  outline: true,
  primary: true
}, "Outline primary"), _react["default"].createElement(_Button.Button, {
  outline: true,
  secondary: true
}, "Outline secondary"), _react["default"].createElement(_Button.Button, {
  primary: true,
  disabled: true
}, "Disabled"), _react["default"].createElement("br", null), _react["default"].createElement(_Button.Button, {
  primary: true,
  small: true
}, "Primary"), _react["default"].createElement(_Button.Button, {
  secondary: true,
  small: true
}, "Secondary"), _react["default"].createElement(_Button.Button, {
  outline: true,
  small: true
}, "Outline"), _react["default"].createElement(_Button.Button, {
  primary: true,
  disabled: true,
  small: true
}, "Disabled"), _react["default"].createElement(_Button.Button, {
  outline: true,
  small: true,
  containsIcon: true
}, _react["default"].createElement(_icon.Icons, {
  icon: "link"
})), _react["default"].createElement(_Button.Button, {
  outline: true,
  small: true
}, _react["default"].createElement(_icon.Icons, {
  icon: "link"
}), "Link"));

(0, _react2.storiesOf)('Basics|Button', module).add('all buttons', function () {
  return _ref;
});