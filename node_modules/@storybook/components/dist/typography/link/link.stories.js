"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _addonActions = require("@storybook/addon-actions");

var _link = require("./link");

var _icon = require("../../icon/icon");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var onClick = (0, _addonActions.action)('onClick');

var _ref =
/*#__PURE__*/
_react["default"].createElement(_link.Link, {
  cancel: true,
  href: "/",
  onClick: onClick
}, "Try clicking with different mouse buttons and modifier keys (shift/ctrl/alt/cmd)");

var _ref2 =
/*#__PURE__*/
_react["default"].createElement(_link.Link, {
  cancel: true,
  href: "http://example.com"
}, "Link");

var _ref3 =
/*#__PURE__*/
_react["default"].createElement(_link.Link, {
  href: "/",
  onClick: onClick
}, "any click will go through");

var _ref4 =
/*#__PURE__*/
_react["default"].createElement(_link.Link, {
  cancel: true,
  href: "http://example.com"
}, "Link");

var _ref5 =
/*#__PURE__*/
_react["default"].createElement(_link.Link, {
  href: "http://google.com"
}, "Default");

var _ref6 =
/*#__PURE__*/
_react["default"].createElement("br", null);

var _ref7 =
/*#__PURE__*/
_react["default"].createElement(_link.Link, {
  secondary: true,
  href: "http://google.com"
}, "Secondary");

var _ref8 =
/*#__PURE__*/
_react["default"].createElement("br", null);

var _ref9 =
/*#__PURE__*/
_react["default"].createElement(_link.Link, {
  tertiary: true,
  href: "http://google.com"
}, "tertiary");

var _ref10 =
/*#__PURE__*/
_react["default"].createElement("br", null);

var _ref11 =
/*#__PURE__*/
_react["default"].createElement(_link.Link, {
  nochrome: true,
  href: "http://google.com"
}, "nochrome");

var _ref12 =
/*#__PURE__*/
_react["default"].createElement("br", null);

var _ref13 =
/*#__PURE__*/
_react["default"].createElement(_link.Link, {
  href: "http://google.com"
}, _react["default"].createElement(_icon.Icons, {
  icon: "discord"
}), "With icon in front");

var _ref14 =
/*#__PURE__*/
_react["default"].createElement("br", null);

var _ref15 =
/*#__PURE__*/
_react["default"].createElement(_icon.Icons, {
  icon: "sidebar"
});

var _ref16 =
/*#__PURE__*/
_react["default"].createElement("br", null);

var _ref17 =
/*#__PURE__*/
_react["default"].createElement(_link.Link, {
  containsIcon: true,
  withArrow: true,
  href: "http://google.com"
}, "With arrow behind");

var _ref18 =
/*#__PURE__*/
_react["default"].createElement("br", null);

var _ref19 =
/*#__PURE__*/
_react["default"].createElement(_link.Link, {
  inverse: true,
  href: "http://google.com"
}, "Inverted colors");

var _ref20 =
/*#__PURE__*/
_react["default"].createElement("br", null);

(0, _react2.storiesOf)('Basics|Link', module).add('cancel w/ onClick', function () {
  return _ref;
}).add('cancel w/ href', function () {
  return _ref2;
}).add('no-cancel w/ onClick', function () {
  return _ref3;
}).add('no-cancel w/ href', function () {
  return _ref4;
}).add('styled links', function () {
  return _react["default"].createElement("div", null, _ref5, _ref6, _ref7, _ref8, _ref9, _ref10, _ref11, _ref12, _ref13, _ref14, _react["default"].createElement(_link.Link, {
    containsIcon: true,
    href: "http://google.com"
  }, _ref15), _ref16, _ref17, _ref18, _react["default"].createElement("span", {
    style: {
      background: '#333'
    }
  }, _ref19), _ref20);
});