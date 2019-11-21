"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _theming = require("@storybook/theming");

var _Spaced = require("./Spaced");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var PlaceholderBlock = _theming.styled.div(function (_ref) {
  var color = _ref.color;
  return {
    background: color || 'hotpink',
    padding: 20
  };
});

var PlaceholderInline = _theming.styled.span(function (_ref2) {
  var color = _ref2.color;
  return {
    background: color || 'hotpink',
    display: 'inline-block',
    padding: 20
  };
});

var _ref3 =
/*#__PURE__*/
_react["default"].createElement("div", null, _react["default"].createElement(PlaceholderBlock, {
  color: "silver"
}), _react["default"].createElement(_Spaced.Spaced, {
  row: 1
}, _react["default"].createElement(PlaceholderBlock, null), _react["default"].createElement(PlaceholderBlock, null), _react["default"].createElement(PlaceholderBlock, null)), _react["default"].createElement(PlaceholderBlock, {
  color: "silver"
}));

var _ref4 =
/*#__PURE__*/
_react["default"].createElement("div", null, _react["default"].createElement(PlaceholderBlock, {
  color: "silver"
}), _react["default"].createElement(_Spaced.Spaced, {
  row: 1,
  outer: true
}, _react["default"].createElement(PlaceholderBlock, null), _react["default"].createElement(PlaceholderBlock, null), _react["default"].createElement(PlaceholderBlock, null)), _react["default"].createElement(PlaceholderBlock, {
  color: "silver"
}));

var _ref5 =
/*#__PURE__*/
_react["default"].createElement("div", null, _react["default"].createElement(PlaceholderBlock, {
  color: "silver"
}), _react["default"].createElement(_Spaced.Spaced, {
  row: 3,
  outer: 0.5
}, _react["default"].createElement(PlaceholderBlock, null), _react["default"].createElement(PlaceholderBlock, null), _react["default"].createElement(PlaceholderBlock, null)), _react["default"].createElement(PlaceholderBlock, {
  color: "silver"
}));

var _ref6 =
/*#__PURE__*/
_react["default"].createElement("div", null, _react["default"].createElement(PlaceholderInline, {
  color: "silver"
}), _react["default"].createElement(_Spaced.Spaced, {
  col: 1
}, _react["default"].createElement(PlaceholderInline, null), _react["default"].createElement(PlaceholderInline, null), _react["default"].createElement(PlaceholderInline, null)), _react["default"].createElement(PlaceholderInline, {
  color: "silver"
}));

var _ref7 =
/*#__PURE__*/
_react["default"].createElement("div", null, _react["default"].createElement(PlaceholderInline, {
  color: "silver"
}), _react["default"].createElement(_Spaced.Spaced, {
  col: 1,
  outer: true
}, _react["default"].createElement(PlaceholderInline, null), _react["default"].createElement(PlaceholderInline, null), _react["default"].createElement(PlaceholderInline, null)), _react["default"].createElement(PlaceholderInline, {
  color: "silver"
}));

(0, _react2.storiesOf)('Basics|Spaced', module).add('row', function () {
  return _ref3;
}).add('row outer', function () {
  return _ref4;
}).add('row multiply', function () {
  return _ref5;
}).add('col', function () {
  return _ref6;
}).add('col outer', function () {
  return _ref7;
});