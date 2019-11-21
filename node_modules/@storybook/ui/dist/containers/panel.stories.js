"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _ref =
/*#__PURE__*/
_react["default"].createElement("div", null, "By default all addon panels are rendered");

var _ref2 =
/*#__PURE__*/
_react["default"].createElement("div", null, "This story disables Actions and Accessibility panels", _react["default"].createElement("pre", null, "storiesOf('UI|Addon Panel', module)\n  .add(\n    'my story',\n    <MyComponent />,\n    { a11y: { disable: true }, actions: { disable: true } }\n  );"));

(0, _react2.storiesOf)('UI|Addon Panel', module).add('default', function () {
  return _ref;
}).add('disable panel', function () {
  return _ref2;
}, {
  a11y: {
    disabled: true
  },
  actions: {
    disabled: true
  }
});