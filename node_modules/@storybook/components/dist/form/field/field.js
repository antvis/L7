"use strict";

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.string.bold");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Field = void 0;

var _react = _interopRequireDefault(require("react"));

var _theming = require("@storybook/theming");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Wrapper = _theming.styled.label(function (_ref) {
  var theme = _ref.theme;
  return {
    display: 'flex',
    borderBottom: "1px solid ".concat(theme.appBorderColor),
    margin: '0 15px',
    padding: '8px 0',
    '&:last-child': {
      marginBottom: '3rem'
    }
  };
});

var Label = _theming.styled.span(function (_ref2) {
  var theme = _ref2.theme;
  return {
    minWidth: 100,
    fontWeight: theme.typography.weight.bold,
    marginRight: 15,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    lineHeight: '16px'
  };
});

var Field = function Field(_ref3) {
  var label = _ref3.label,
      children = _ref3.children;
  return _react["default"].createElement(Wrapper, null, label ? _react["default"].createElement(Label, null, _react["default"].createElement("span", null, label)) : null, children);
};

exports.Field = Field;
Field.displayName = "Field";
Field.defaultProps = {
  label: undefined
};