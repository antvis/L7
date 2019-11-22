"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.slice");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-properties");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.freeze");

require("core-js/modules/es.object.keys");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Link = void 0;

var _react = _interopRequireDefault(require("react"));

var _theming = require("@storybook/theming");

var _polished = require("polished");

var _icon = require("../../icon/icon");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _templateObject10() {
  var data = _taggedTemplateLiteral(["\n  ", ";\n"]);

  _templateObject10 = function _templateObject10() {
    return data;
  };

  return data;
}

function _templateObject9() {
  var data = _taggedTemplateLiteral(["\n      svg {\n        height: 1em;\n        width: 1em;\n        vertical-align: middle;\n        position: relative;\n        bottom: 0;\n        margin-right: 0;\n      }\n    "]);

  _templateObject9 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8() {
  var data = _taggedTemplateLiteral(["\n      > svg:last-of-type {\n        height: 0.7em;\n        width: 0.7em;\n        margin-right: 0;\n        margin-left: 0.25em;\n        bottom: auto;\n        vertical-align: inherit;\n      }\n    "]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = _taggedTemplateLiteral(["\n  ", ";\n\n  ", ";\n"]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral(["\n      border: 0;\n      border-radius: 0;\n      background: none;\n      padding: 0;\n      font-size: inherit;\n    "]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral(["\n      color: ", ";\n      svg path {\n        fill: ", ";\n      }\n\n      &:hover {\n        color: ", ";\n        svg path {\n          fill: ", ";\n        }\n      }\n\n      &:active {\n        color: ", ";\n        svg path {\n          fill: ", ";\n        }\n      }\n    "]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n      color: inherit;\n\n      &:hover,\n      &:active {\n        color: inherit;\n        text-decoration: underline;\n      }\n    "]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n      color: ", ";\n      svg path {\n        fill: ", ";\n      }\n\n      &:hover {\n        color: ", ";\n        svg path {\n          fill: ", ";\n        }\n      }\n\n      &:active {\n        color: ", ";\n        svg path {\n          fill: ", ";\n        }\n      }\n    "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n      color: ", ";\n      svg path {\n        fill: ", ";\n      }\n\n      &:hover {\n        color: ", ";\n        svg path {\n          fill: ", ";\n        }\n      }\n\n      &:active {\n        color: ", ";\n        svg path {\n          fill: ", ";\n        }\n      }\n    "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  display: inline-block;\n  transition: all 150ms ease-out;\n  text-decoration: none;\n\n  color: ", ";\n  svg path {\n    fill: ", ";\n  }\n\n  &:hover,\n  &:focus {\n    cursor: pointer;\n    color: ", ";\n    svg path {\n      fill: ", ";\n    }\n  }\n  &:active {\n    color: ", ";\n    svg path {\n      fill: ", ";\n    }\n  }\n\n  svg {\n    display: inline-block;\n    height: 1em;\n    width: 1em;\n    vertical-align: text-top;\n    position: relative;\n    bottom: -0.125em;\n    margin-right: 0.4em;\n  }\n\n  ", ";\n\n  ", ";\n\n  ", ";\n\n  ", ";\n\n  ", ";\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

// Cmd/Ctrl/Shift/Alt + Click should trigger default browser behaviour. Same applies to non-left clicks
var LEFT_BUTTON = 0;

var isPlainLeftClick = function isPlainLeftClick(e) {
  return e.button === LEFT_BUTTON && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey;
};

var cancelled = function cancelled(e, cb) {
  if (isPlainLeftClick(e)) {
    e.preventDefault();
    cb(e);
  }
};

var linkStyles = function linkStyles(props) {
  return (0, _theming.css)(_templateObject(), props.theme.color.secondary, props.theme.color.secondary, (0, _polished.darken)(0.07, props.theme.color.secondary), (0, _polished.darken)(0.07, props.theme.color.secondary), (0, _polished.darken)(0.1, props.theme.color.secondary), (0, _polished.darken)(0.1, props.theme.color.secondary), props.secondary && (0, _theming.css)(_templateObject2(), props.theme.color.mediumdark, props.theme.color.mediumdark, props.theme.color.dark, props.theme.color.dark, props.theme.color.darker, props.theme.color.darker), props.tertiary && (0, _theming.css)(_templateObject3(), props.theme.color.dark, props.theme.color.dark, props.theme.color.darkest, props.theme.color.darkest, props.theme.color.mediumdark, props.theme.color.mediumdark), props.nochrome && (0, _theming.css)(_templateObject4()), props.inverse && (0, _theming.css)(_templateObject5(), props.theme.color.lightest, props.theme.color.lightest, props.theme.color.lighter, props.theme.color.lighter, props.theme.color.light, props.theme.color.light), props.isButton && (0, _theming.css)(_templateObject6()));
};

var LinkInner = _theming.styled.span(_templateObject7(), function (props) {
  return props.withArrow && (0, _theming.css)(_templateObject8());
}, function (props) {
  return props.containsIcon && (0, _theming.css)(_templateObject9());
});

var A = _theming.styled.a(_templateObject10(), linkStyles);

var _ref2 =
/*#__PURE__*/
_react["default"].createElement(_icon.Icons, {
  icon: "arrowright"
});

var Link = function Link(_ref) {
  var cancel = _ref.cancel,
      children = _ref.children,
      onClick = _ref.onClick,
      withArrow = _ref.withArrow,
      containsIcon = _ref.containsIcon,
      className = _ref.className,
      rest = _objectWithoutProperties(_ref, ["cancel", "children", "onClick", "withArrow", "containsIcon", "className"]);

  return _react["default"].createElement(A, _extends({}, rest, {
    onClick: cancel ? function (e) {
      return cancelled(e, onClick);
    } : onClick,
    className: className
  }), _react["default"].createElement(LinkInner, {
    withArrow: withArrow,
    containsIcon: containsIcon
  }, children, withArrow && _ref2));
};

exports.Link = Link;
Link.displayName = "Link";
Link.defaultProps = {
  cancel: true,
  className: undefined,
  style: undefined,
  onClick: function onClick() {},
  withArrow: false,
  containsIcon: false
};