"use strict";

require("core-js/modules/es.object.assign");

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _theming = require("@storybook/theming");

var _Tooltip = require("./Tooltip");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// Popper would position the tooltip absolutely. We just need to make sure we are pos:rel
var mockPopperProps = {
  style: {
    position: 'relative',
    top: '20px',
    left: '20px'
  }
};

var Content = _theming.styled.div({
  width: '100px',
  height: '100px',
  fontSize: '16px',
  textAlign: 'center',
  lineHeight: '100px'
});

var _ref =
/*#__PURE__*/
_react["default"].createElement(Content, null, "Text");

var _ref2 =
/*#__PURE__*/
_react["default"].createElement(Content, null, "Text");

var _ref3 =
/*#__PURE__*/
_react["default"].createElement(Content, null, "Text");

var _ref4 =
/*#__PURE__*/
_react["default"].createElement(Content, null, "Text");

var _ref5 =
/*#__PURE__*/
_react["default"].createElement(Content, null, "Text");

(0, _react2.storiesOf)('basics/Tooltip/Tooltip', module).add('basic, default', function () {
  return _react["default"].createElement(_Tooltip.Tooltip, _extends({}, mockPopperProps, {
    color: "medium"
  }), _ref);
}).add('basic, default, bottom', function () {
  return _react["default"].createElement(_Tooltip.Tooltip, _extends({
    placement: "bottom"
  }, mockPopperProps), _ref2);
}).add('basic, default, left', function () {
  return _react["default"].createElement(_Tooltip.Tooltip, _extends({
    placement: "left"
  }, mockPopperProps), _ref3);
}).add('basic, default, right', function () {
  return _react["default"].createElement(_Tooltip.Tooltip, _extends({
    placement: "right"
  }, mockPopperProps), _ref4);
}).add('no chrome', function () {
  return _react["default"].createElement(_Tooltip.Tooltip, _extends({
    hasChrome: false
  }, mockPopperProps), _ref5);
});