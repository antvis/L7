"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _base = require("../base");

var theme = {
  base: 'dark',
  // Storybook-specific color palette
  colorPrimary: '#FF4785',
  // coral
  colorSecondary: '#1EA7FD',
  // ocean
  // UI
  appBg: '#2f2f2f',
  appContentBg: '#333',
  appBorderColor: 'rgba(255,255,255,.1)',
  appBorderRadius: 4,
  // Fonts
  fontBase: _base.typography.fonts.base,
  fontCode: _base.typography.fonts.mono,
  // Text colors
  textColor: _base.color.lightest,
  textInverseColor: _base.color.darkest,
  // Toolbar default and active colors
  barTextColor: '#999999',
  barSelectedColor: _base.color.secondary,
  barBg: _base.color.darkest,
  // Form colors
  inputBg: '#3f3f3f',
  inputBorder: 'rgba(0,0,0,.3)',
  inputTextColor: _base.color.lightest,
  inputBorderRadius: 4
};
var _default = theme;
exports["default"] = _default;