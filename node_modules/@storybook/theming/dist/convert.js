"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.keys");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convert = void 0;

var _polished = require("polished");

var _base = require("./base");

var _animation = require("./animation");

var _syntax = require("./modules/syntax");

var _light = _interopRequireDefault(require("./themes/light"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var lightSyntaxColors = {
  green1: '#008000',
  red1: '#A31515',
  red2: '#9a050f',
  red3: '#800000',
  red4: '#ff0000',
  gray1: '#393A34',
  cyan1: '#36acaa',
  cyan2: '#2B91AF',
  blue1: '#0000ff',
  blue2: '#00009f'
};
var darkSyntaxColors = {
  green1: '#7C7C7C',
  red1: '#92C379',
  red2: '#9a050f',
  red3: '#A8FF60',
  red4: '#96CBFE',
  gray1: '#EDEDED',
  cyan1: '#C6C5FE',
  cyan2: '#FFFFB6',
  blue1: '#B474DD',
  blue2: '#00009f'
};

var createColors = function createColors(vars) {
  return {
    // Changeable colors
    primary: vars.colorPrimary,
    secondary: vars.colorSecondary,
    tertiary: _base.color.tertiary,
    ancillary: _base.color.ancillary,
    // Complimentary
    orange: _base.color.orange,
    gold: _base.color.gold,
    green: _base.color.green,
    seafoam: _base.color.seafoam,
    purple: _base.color.purple,
    ultraviolet: _base.color.ultraviolet,
    // Monochrome
    lightest: _base.color.lightest,
    lighter: _base.color.lighter,
    light: _base.color.light,
    mediumlight: _base.color.mediumlight,
    medium: _base.color.medium,
    mediumdark: _base.color.mediumdark,
    dark: _base.color.dark,
    darker: _base.color.darker,
    darkest: _base.color.darkest,
    // For borders
    border: _base.color.border,
    // Status
    positive: _base.color.positive,
    negative: _base.color.negative,
    warning: _base.color.warning,
    critical: _base.color.critical,
    defaultText: vars.textColor || _base.color.darkest,
    inverseText: vars.textInverseColor || _base.color.lightest
  };
};

var convert = function convert() {
  var inherit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _light["default"];

  var base = inherit.base,
      colorPrimary = inherit.colorPrimary,
      colorSecondary = inherit.colorSecondary,
      appBg = inherit.appBg,
      appContentBg = inherit.appContentBg,
      appBorderColor = inherit.appBorderColor,
      appBorderRadius = inherit.appBorderRadius,
      fontBase = inherit.fontBase,
      fontCode = inherit.fontCode,
      textColor = inherit.textColor,
      textInverseColor = inherit.textInverseColor,
      barTextColor = inherit.barTextColor,
      barSelectedColor = inherit.barSelectedColor,
      barBg = inherit.barBg,
      inputBg = inherit.inputBg,
      inputBorder = inherit.inputBorder,
      inputTextColor = inherit.inputTextColor,
      inputBorderRadius = inherit.inputBorderRadius,
      brandTitle = inherit.brandTitle,
      brandUrl = inherit.brandUrl,
      brandImage = inherit.brandImage,
      gridCellSize = inherit.gridCellSize,
      rest = _objectWithoutProperties(inherit, ["base", "colorPrimary", "colorSecondary", "appBg", "appContentBg", "appBorderColor", "appBorderRadius", "fontBase", "fontCode", "textColor", "textInverseColor", "barTextColor", "barSelectedColor", "barBg", "inputBg", "inputBorder", "inputTextColor", "inputBorderRadius", "brandTitle", "brandUrl", "brandImage", "gridCellSize"]);

  return Object.assign({}, rest || {}, {
    base: base,
    color: createColors(inherit),
    background: {
      app: appBg,
      bar: barBg,
      content: appContentBg,
      gridCellSize: gridCellSize || _base.background.gridCellSize,
      hoverable: base === 'light' ? 'rgba(0,0,0,.05)' : 'rgba(250,250,252,.1)' || _base.background.hoverable,
      positive: _base.background.positive,
      negative: _base.background.negative,
      warning: _base.background.warning,
      critical: _base.background.critical
    },
    typography: {
      fonts: {
        base: fontBase,
        mono: fontCode
      },
      weight: _base.typography.weight,
      size: _base.typography.size
    },
    animation: _animation.animation,
    easing: _animation.easing,
    input: {
      border: inputBorder,
      background: inputBg,
      color: inputTextColor,
      borderRadius: inputBorderRadius
    },
    // UI
    layoutMargin: 10,
    appBorderColor: appBorderColor,
    appBorderRadius: appBorderRadius,
    // Toolbar default/active colors
    barTextColor: barTextColor,
    barSelectedColor: barSelectedColor || colorSecondary,
    barBg: barBg,
    // Brand logo/text
    brand: {
      title: brandTitle,
      url: brandUrl,
      image: brandImage || (brandTitle ? null : undefined)
    },
    code: (0, _syntax.create)({
      colors: base === 'light' ? lightSyntaxColors : darkSyntaxColors,
      mono: fontCode
    }),
    // Addon actions theme
    // API example https://github.com/xyc/react-inspector/blob/master/src/styles/themes/chromeLight.js
    addonActionsTheme: Object.assign({}, base === 'light' ? _syntax.chromeLight : _syntax.chromeDark, {
      BASE_FONT_FAMILY: fontCode,
      BASE_FONT_SIZE: _base.typography.size.s2 - 1,
      BASE_LINE_HEIGHT: '18px',
      BASE_BACKGROUND_COLOR: 'transparent',
      BASE_COLOR: textColor,
      ARROW_COLOR: (0, _polished.opacify)(0.2, appBorderColor),
      ARROW_MARGIN_RIGHT: 4,
      ARROW_FONT_SIZE: 8,
      TREENODE_FONT_FAMILY: fontCode,
      TREENODE_FONT_SIZE: _base.typography.size.s2 - 1,
      TREENODE_LINE_HEIGHT: '18px',
      TREENODE_PADDING_LEFT: 12
    })
  });
};

exports.convert = convert;