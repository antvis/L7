"use strict";

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.string.bold");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _theming = require("@storybook/theming");

var _components = require("@storybook/components");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Footer = _theming.styled.div(function (_ref) {
  var theme = _ref.theme;
  return {
    display: 'flex',
    paddingTop: 20,
    marginTop: 20,
    borderTop: "1px solid ".concat(theme.appBorderColor),
    fontWeight: theme.typography.weight.bold,
    '& > * + *': {
      marginLeft: 20
    }
  };
});

var _ref2 =
/*#__PURE__*/
_react["default"].createElement(_components.Link, {
  secondary: true,
  href: "https://storybook.js.org",
  cancel: false,
  target: "_blank"
}, "Docs");

var _ref3 =
/*#__PURE__*/
_react["default"].createElement(_components.Link, {
  secondary: true,
  href: "https://github.com/storybookjs/storybook",
  cancel: false,
  target: "_blank"
}, "GitHub");

var _ref4 =
/*#__PURE__*/
_react["default"].createElement(_components.Link, {
  secondary: true,
  href: "https://storybook.js.org/support",
  cancel: false,
  target: "_blank"
}, "Support");

var SettingsFooter = function SettingsFooter(props) {
  return _react["default"].createElement(Footer, props, _ref2, _ref3, _ref4);
};

SettingsFooter.displayName = "SettingsFooter";
var _default = SettingsFooter;
exports["default"] = _default;