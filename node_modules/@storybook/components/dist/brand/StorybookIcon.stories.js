"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _StorybookIcon = require("./StorybookIcon");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _ref =
/*#__PURE__*/
_react["default"].createElement(_StorybookIcon.StorybookIcon, null);

(0, _react2.storiesOf)('Basics|Brand/StorybookIcon', module).add('default', function () {
  return _ref;
});