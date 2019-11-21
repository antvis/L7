"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _WithTooltip = require("./WithTooltip");

var _TooltipMessage = require("./TooltipMessage");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _ref =
/*#__PURE__*/
_react["default"].createElement("div", null, "Tooltip");

var _ref2 =
/*#__PURE__*/
_react["default"].createElement(_TooltipMessage.TooltipMessage, {
  title: "Lorem ipsum dolor sit",
  desc: "Amet consectatur vestibulum concet durum politu coret weirom"
});

var _ref3 =
/*#__PURE__*/
_react["default"].createElement(_TooltipMessage.TooltipMessage, {
  desc: "Amet consectatur vestibulum concet durum politu coret weirom"
});

(0, _react2.storiesOf)('basics/Tooltip/TooltipMessage', module).addDecorator(function (storyFn) {
  return _react["default"].createElement("div", {
    style: {
      height: '300px'
    }
  }, _react["default"].createElement(_WithTooltip.WithTooltip, {
    placement: "top",
    trigger: "click",
    startOpen: true,
    tooltip: storyFn()
  }, _ref));
}).add('default', function () {
  return _ref2;
}).add('with link', function () {
  return _react["default"].createElement(_TooltipMessage.TooltipMessage, {
    title: "Lorem ipsum dolor sit",
    desc: "Amet consectatur vestibulum concet durum politu coret weirom",
    links: [{
      title: 'Continue',
      href: 'test'
    }]
  });
}).add('with links', function () {
  return _react["default"].createElement(_TooltipMessage.TooltipMessage, {
    title: "Lorem ipsum dolor sit",
    desc: "Amet consectatur vestibulum concet durum politu coret weirom",
    links: [{
      title: 'Get more tips',
      href: 'test'
    }, {
      title: 'Done',
      href: 'test'
    }]
  });
}).add('minimal message', function () {
  return _ref3;
});