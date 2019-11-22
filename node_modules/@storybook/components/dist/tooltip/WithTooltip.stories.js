"use strict";

require("core-js/modules/es.array.slice");

require("core-js/modules/es.object.define-properties");

require("core-js/modules/es.object.freeze");

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _theming = require("@storybook/theming");

var _TooltipMessage = require("./TooltipMessage");

var _WithTooltip = require("./WithTooltip");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n  width: 200px;\n  height: 100px;\n  background-color: red;\n  color: white;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n  height: 100px;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  width: 500px;\n  height: 500px;\n  overflow-y: scroll;\n  background: #eee;\n  position: relative;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  height: 300px;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var ViewPort = _theming.styled.div(_templateObject());

var BackgroundBox = _theming.styled.div(_templateObject2());

var Spacer = _theming.styled.div(_templateObject3());

var Trigger = _theming.styled.div(_templateObject4());

var Tooltip = function Tooltip(_ref) {
  var onHide = _ref.onHide;
  return _react["default"].createElement(_TooltipMessage.TooltipMessage, {
    title: "Lorem ipsum dolor sit",
    desc: "Amet consectatur vestibulum concet durum politu coret weirom",
    links: [{
      title: 'Continue',
      onClick: onHide
    }]
  });
};

Tooltip.displayName = "Tooltip";
Tooltip.defaultProps = {
  onHide: null
};

var _ref2 =
/*#__PURE__*/
_react["default"].createElement(Spacer, null);

var _ref3 =
/*#__PURE__*/
_react["default"].createElement(_WithTooltip.WithToolTipState, {
  placement: "top",
  trigger: "hover",
  tooltip: _react["default"].createElement(Tooltip, null)
}, _react["default"].createElement(Trigger, null, "Hover me!"));

var _ref4 =
/*#__PURE__*/
_react["default"].createElement(_WithTooltip.WithToolTipState, {
  placement: "top",
  trigger: "hover",
  tooltip: Tooltip
}, _react["default"].createElement(Trigger, null, "Hover me!"));

var _ref5 =
/*#__PURE__*/
_react["default"].createElement(_WithTooltip.WithToolTipState, {
  placement: "top",
  trigger: "click",
  tooltip: _react["default"].createElement(Tooltip, null)
}, _react["default"].createElement(Trigger, null, "Click me!"));

var _ref6 =
/*#__PURE__*/
_react["default"].createElement(_WithTooltip.WithToolTipState, {
  placement: "top",
  trigger: "click",
  startOpen: true,
  tooltip: _react["default"].createElement(Tooltip, null)
}, _react["default"].createElement(Trigger, null, "Click me!"));

var _ref7 =
/*#__PURE__*/
_react["default"].createElement(_WithTooltip.WithToolTipState, {
  placement: "top",
  trigger: "click",
  closeOnClick: true,
  tooltip: _react["default"].createElement(Tooltip, null)
}, _react["default"].createElement(Trigger, null, "Click me!"));

var _ref8 =
/*#__PURE__*/
_react["default"].createElement(_WithTooltip.WithToolTipState, {
  placement: "top",
  trigger: "click",
  hasChrome: false,
  tooltip: _react["default"].createElement(Tooltip, null)
}, _react["default"].createElement(Trigger, null, "Click me!"));

(0, _react2.storiesOf)('basics/Tooltip/WithTooltip', module).addDecorator(function (storyFn) {
  return _react["default"].createElement(ViewPort, null, _react["default"].createElement(BackgroundBox, null, _ref2, storyFn()));
}).add('simple hover', function () {
  return _ref3;
}).add('simple hover, functional', function () {
  return _ref4;
}).add('simple click', function () {
  return _ref5;
}).add('simple click start open', function () {
  return _ref6;
}).add('simple click closeOnClick', function () {
  return _ref7;
}).add('no chrome', function () {
  return _ref8;
});