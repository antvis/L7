"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _base = require("../base");

var theme = {
  base: 'light',
  // Storybook-specific color palette
  colorPrimary: '#FF4785',
  // coral
  colorSecondary: '#1EA7FD',
  // ocean
  // UI
  appBg: _base.background.app,
  appContentBg: _base.color.lightest,
  appBorderColor: _base.color.border,
  appBorderRadius: 4,
  // Fonts
  fontBase: _base.typography.fonts.base,
  fontCode: _base.typography.fonts.mono,
  // Text colors
  textColor: _base.color.darkest,
  textInverseColor: _base.color.lightest,
  // Toolbar default and active colors
  barTextColor: _base.color.mediumdark,
  barSelectedColor: _base.color.secondary,
  barBg: _base.color.lightest,
  // Form colors
  inputBg: _base.color.lightest,
  inputBorder: _base.color.border,
  inputTextColor: _base.color.darkest,
  inputBorderRadius: 4
};
var _default = theme;
exports["default"] = _default;