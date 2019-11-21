"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _WithTooltip = require("./WithTooltip");

var _TooltipNote = require("./TooltipNote");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _ref =
/*#__PURE__*/
_react["default"].createElement("div", null, "Tooltip");

var _ref2 =
/*#__PURE__*/
_react["default"].createElement(_TooltipNote.TooltipNote, {
  note: "Lorem ipsum dolor"
});

(0, _react2.storiesOf)('basics/Tooltip/TooltipNote', module).addDecorator(function (storyFn) {
  return _react["default"].createElement("div", {
    style: {
      height: '300px'
    }
  }, _react["default"].createElement(_WithTooltip.WithTooltip, {
    hasChrome: false,
    placement: "top",
    trigger: "click",
    startOpen: true,
    tooltip: storyFn()
  }, _ref));
}).add('default', function () {
  return _ref2;
});