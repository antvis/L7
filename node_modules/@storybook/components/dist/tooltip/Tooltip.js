"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.split");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tooltip = void 0;

var _react = _interopRequireDefault(require("react"));

var _memoizerific = _interopRequireDefault(require("memoizerific"));

var _theming = require("@storybook/theming");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var match = (0, _memoizerific["default"])(1000)(function (requestes, actual, value) {
  var fallback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  return actual.split('-')[0] === requestes ? value : fallback;
});
var ArrowSpacing = 8;

var Arrow = _theming.styled.div({
  position: 'absolute',
  borderStyle: 'solid'
}, function (_ref) {
  var theme = _ref.theme,
      color = _ref.color,
      placement = _ref.placement;
  return {
    marginBottom: "".concat(match('top', placement, '0', ArrowSpacing), "px"),
    marginTop: "".concat(match('bottom', placement, '0', ArrowSpacing), "px"),
    marginRight: "".concat(match('left', placement, '0', ArrowSpacing), "px"),
    marginLeft: "".concat(match('right', placement, '0', ArrowSpacing), "px"),
    bottom: "".concat(match('top', placement, ArrowSpacing * -1, 'auto'), "px"),
    top: "".concat(match('bottom', placement, ArrowSpacing * -1, 'auto'), "px"),
    right: "".concat(match('left', placement, ArrowSpacing * -1, 'auto'), "px"),
    left: "".concat(match('right', placement, ArrowSpacing * -1, 'auto'), "px"),
    borderBottomWidth: "".concat(match('top', placement, '0', ArrowSpacing), "px"),
    borderTopWidth: "".concat(match('bottom', placement, '0', ArrowSpacing), "px"),
    borderRightWidth: "".concat(match('left', placement, '0', ArrowSpacing), "px"),
    borderLeftWidth: "".concat(match('right', placement, '0', ArrowSpacing), "px"),
    borderTopColor: match('top', placement, theme.color[color] || color || theme.base === 'light' ? (0, _theming.lighten)(theme.background.app) : (0, _theming.darken)(theme.background.app), 'transparent'),
    borderBottomColor: match('bottom', placement, theme.color[color] || color || theme.base === 'light' ? (0, _theming.lighten)(theme.background.app) : (0, _theming.darken)(theme.background.app), 'transparent'),
    borderLeftColor: match('left', placement, theme.color[color] || color || theme.base === 'light' ? (0, _theming.lighten)(theme.background.app) : (0, _theming.darken)(theme.background.app), 'transparent'),
    borderRightColor: match('right', placement, theme.color[color] || color || theme.base === 'light' ? (0, _theming.lighten)(theme.background.app) : (0, _theming.darken)(theme.background.app), 'transparent')
  };
});

var Wrapper = _theming.styled.div(function (_ref2) {
  var hidden = _ref2.hidden;
  return {
    display: hidden ? 'none' : 'inline-block',
    zIndex: 2147483647
  };
}, function (_ref3) {
  var theme = _ref3.theme,
      color = _ref3.color,
      hasChrome = _ref3.hasChrome,
      placement = _ref3.placement;
  return hasChrome ? {
    marginBottom: "".concat(match('top', placement, ArrowSpacing + 2, 0), "px"),
    marginTop: "".concat(match('bottom', placement, ArrowSpacing + 2, 0), "px"),
    marginLeft: "".concat(match('right', placement, ArrowSpacing + 2, 0), "px"),
    marginRight: "".concat(match('left', placement, ArrowSpacing + 2, 0), "px"),
    background: theme.color[color] || color || theme.base === 'light' ? (0, _theming.lighten)(theme.background.app) : (0, _theming.darken)(theme.background.app),
    filter: "\n            drop-shadow(0px 5px 5px rgba(0,0,0,0.05))\n            drop-shadow(0 1px 3px rgba(0,0,0,0.1))\n          ",
    borderRadius: theme.appBorderRadius * 2,
    fontSize: theme.typography.size.s1
  } : {
    marginBottom: "".concat(match('top', placement, 8, 0), "px"),
    marginTop: "".concat(match('bottom', placement, 8, 0), "px"),
    marginLeft: "".concat(match('right', placement, 8, 0), "px"),
    marginRight: "".concat(match('left', placement, 8, 0), "px")
  };
});

var Tooltip = function Tooltip(_ref4) {
  var placement = _ref4.placement,
      hasChrome = _ref4.hasChrome,
      children = _ref4.children,
      arrowProps = _ref4.arrowProps,
      tooltipRef = _ref4.tooltipRef,
      arrowRef = _ref4.arrowRef,
      color = _ref4.color,
      props = _objectWithoutProperties(_ref4, ["placement", "hasChrome", "children", "arrowProps", "tooltipRef", "arrowRef", "color"]);

  return _react["default"].createElement(Wrapper, _extends({
    hasChrome: hasChrome,
    placement: placement,
    ref: tooltipRef
  }, props, {
    color: color
  }), hasChrome && _react["default"].createElement(Arrow, _extends({
    placement: placement,
    ref: arrowRef
  }, arrowProps, {
    color: color
  })), children);
};

exports.Tooltip = Tooltip;
Tooltip.displayName = "Tooltip";
Tooltip.defaultProps = {
  color: undefined,
  arrowRef: undefined,
  tooltipRef: undefined,
  hasChrome: true,
  placement: 'top',
  arrowProps: {}
};