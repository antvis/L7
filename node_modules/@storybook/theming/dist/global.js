"use strict";

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.string.bold");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGlobal = exports.createReset = void 0;

var _memoizerific = _interopRequireDefault(require("memoizerific"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var createReset = (0, _memoizerific["default"])(1)(function (_ref) {
  var typography = _ref.typography;
  return {
    body: {
      fontFamily: typography.fonts.base,
      fontSize: typography.size.s3,
      margin: 0,
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
      WebkitOverflowScrolling: 'touch'
    },
    '*': {
      boxSizing: 'border-box'
    },
    'h1, h2, h3, h4, h5, h6': {
      fontWeight: typography.weight.regular,
      margin: 0,
      padding: 0
    },
    'button, input, textarea, select': {
      outline: 'none',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      boxSizing: 'border-box'
    },
    sub: {
      fontSize: '0.8em',
      bottom: '-0.2em'
    },
    sup: {
      fontSize: '0.8em',
      top: '-0.2em'
    },
    'b, em': {
      fontWeight: typography.weight.bold
    },
    hr: {
      border: 'none',
      borderTop: '1px solid silver',
      clear: 'both',
      marginBottom: '1.25rem'
    },
    code: {
      fontFamily: typography.fonts.mono,
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      display: 'inline-block',
      paddingLeft: 2,
      paddingRight: 2,
      verticalAlign: 'baseline',
      color: 'inherit'
    },
    pre: {
      fontFamily: typography.fonts.mono,
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      lineHeight: '18px',
      padding: '11px 1rem',
      whiteSpace: 'pre-wrap',
      color: 'inherit',
      borderRadius: 3,
      margin: '1rem 0'
    }
  };
});
exports.createReset = createReset;
var createGlobal = (0, _memoizerific["default"])(1)(function (_ref2) {
  var color = _ref2.color,
      background = _ref2.background,
      typography = _ref2.typography;
  var resetStyles = createReset({
    typography: typography
  });
  return Object.assign({}, resetStyles, {
    body: Object.assign({}, resetStyles.body, {
      color: color.defaultText,
      background: background.app,
      overflow: 'hidden'
    }),
    hr: Object.assign({}, resetStyles.hr, {
      borderTop: "1px solid ".concat(color.border)
    })
  });
});
exports.createGlobal = createGlobal;