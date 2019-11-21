"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.slice");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-properties");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.freeze");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.string.bold");

require("core-js/modules/es.string.small");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Button = void 0;

var _react = _interopRequireWildcard(require("react"));

var _theming = require("@storybook/theming");

var _polished = require("polished");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _templateObject11() {
  var data = _taggedTemplateLiteral(["\n          box-shadow: ", " 0 0 0 1px inset;\n          color: ", ";\n\n          &:hover {\n            box-shadow: ", " 0 0 0 1px inset;\n            background: transparent;\n          }\n\n          &:active {\n            background: ", ";\n            box-shadow: ", " 0 0 0 1px inset;\n            color: ", ";\n          }\n          &:focus {\n            box-shadow: ", " 0 0 0 1px inset,\n              ", " 0 1px 9px 2px;\n          }\n          &:focus:hover {\n            box-shadow: ", " 0 0 0 1px inset,\n              ", " 0 8px 18px 0px;\n          }\n        "]);

  _templateObject11 = function _templateObject11() {
    return data;
  };

  return data;
}

function _templateObject10() {
  var data = _taggedTemplateLiteral(["\n          box-shadow: ", " 0 0 0 1px inset;\n          color: ", ";\n\n          svg path {\n            fill: ", ";\n          }\n\n          &:hover {\n            box-shadow: ", " 0 0 0 1px inset;\n            background: transparent;\n          }\n\n          &:active {\n            background: ", ";\n            box-shadow: ", " 0 0 0 1px inset;\n            color: ", ";\n          }\n          &:focus {\n            box-shadow: ", " 0 0 0 1px inset,\n              ", " 0 1px 9px 2px;\n          }\n          &:focus:hover {\n            box-shadow: ", " 0 0 0 1px inset,\n              ", " 0 8px 18px 0px;\n          }\n        "]);

  _templateObject10 = function _templateObject10() {
    return data;
  };

  return data;
}

function _templateObject9() {
  var data = _taggedTemplateLiteral(["\n      box-shadow: ", " 0 0 0 1px inset;\n      color: ", ";\n      background: transparent;\n\n      &:hover {\n        box-shadow: ", " 0 0 0 1px inset;\n      }\n\n      &:active {\n        box-shadow: ", " 0 0 0 2px inset;\n        color: ", ";\n      }\n\n      ", ";\n\n      ", ";\n    "]);

  _templateObject9 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8() {
  var data = _taggedTemplateLiteral(["\n      background: ", ";\n      color: ", ";\n      box-shadow: ", " 0 0 0 1px inset;\n      border-radius: ", "px;\n\n      &:hover {\n        background: ", ";\n        ", "\n      }\n      &:active {\n        background: ", ";\n      }\n      &:focus {\n        box-shadow: ", " 0 0 0 1px inset;\n      }\n    "]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = _taggedTemplateLiteral(["\n      background: ", ";\n      color: ", ";\n\n      &:hover {\n        background: ", ";\n      }\n      &:active {\n        box-shadow: rgba(0, 0, 0, 0.1) 0 0 0 3em inset;\n      }\n      &:focus {\n        box-shadow: ", " 0 1px 9px 2px;\n      }\n      &:focus:hover {\n        box-shadow: ", " 0 8px 18px 0px;\n      }\n    "]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral(["\n      background: ", ";\n      color: ", ";\n\n      &:hover {\n        background: ", ";\n      }\n      &:active {\n        box-shadow: rgba(0, 0, 0, 0.1) 0 0 0 3em inset;\n      }\n      &:focus {\n        box-shadow: ", " 0 1px 9px 2px;\n      }\n      &:focus:hover {\n        box-shadow: ", " 0 8px 18px 0px;\n      }\n    "]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral(["\n          padding: 12px;\n        "]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n          padding: 9px;\n        "]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n      svg {\n        display: block;\n        margin: 0;\n      }\n\n      ", "\n\n      ", "\n    "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n      cursor: not-allowed !important;\n      opacity: 0.5;\n      &:hover {\n        transform: none;\n      }\n    "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  border: 0;\n  border-radius: 3em;\n  cursor: pointer;\n  display: inline-block;\n  overflow: hidden;\n  padding: ", ";\n  position: relative;\n  text-align: center;\n  text-decoration: none;\n  transition: all 150ms ease-out;\n  transform: translate3d(0,0,0);\n  vertical-align: top;\n  white-space: nowrap;\n  user-select: none;\n  opacity: 1;\n  margin: 0;\n  background: transparent;\n\n\n  font-size: ", "px;\n  font-weight: ", ";\n  line-height: 1;\n\n\n  svg {\n    display: inline-block;\n    height: ", "px;\n    width: ", "px;\n    vertical-align: top;\n    margin-right: ", "px;\n    margin-top: ", "px;\n    margin-bottom: ", "px;\n\n    /* Necessary for js mouse events to not glitch out when hovering on svgs */\n    pointer-events: none;\n\n    path { fill: currentColor; }\n  }\n\n  ", "\n\n  ", "\n\n  /* Colored button for primary CTAs */\n  ", "\n\n\n  /* Colored button for secondary CTAs */\n  ", "\n\n  /* Button for tertiary CTAs and forms that responds to theme */\n  ", "\n\n  /* Button that's outlined */\n  ", "\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var ButtonWrapper = _theming.styled.button(_templateObject(), function (props) {
  return props.small ? '10px 16px' : '13px 20px';
}, function (props) {
  return props.small ? props.theme.typography.size.s1 : props.theme.typography.size.s2 - 1;
}, function (props) {
  return props.theme.typography.weight.bold;
}, function (props) {
  return props.small ? '14' : '16';
}, function (props) {
  return props.small ? '14' : '16';
}, function (props) {
  return props.small ? '4' : '6';
}, function (props) {
  return props.small ? '-1' : '-2';
}, function (props) {
  return props.small ? '-1' : '-2';
}, function (props) {
  return props.disabled && (0, _theming.css)(_templateObject2());
}, function (props) {
  return props.containsIcon && (0, _theming.css)(_templateObject3(), props.small && (0, _theming.css)(_templateObject4()), !props.small && (0, _theming.css)(_templateObject5()));
}, function (props) {
  return props.primary && (0, _theming.css)(_templateObject6(), props.theme.color.primary, props.theme.color.lightest, (0, _polished.darken)(0.05, props.theme.color.primary), (0, _polished.rgba)(props.theme.color.primary, 0.4), (0, _polished.rgba)(props.theme.color.primary, 0.2));
}, function (props) {
  return props.secondary && (0, _theming.css)(_templateObject7(), props.theme.color.secondary, props.theme.color.lightest, (0, _polished.darken)(0.05, props.theme.color.secondary), (0, _polished.rgba)(props.theme.color.secondary, 0.4), (0, _polished.rgba)(props.theme.color.secondary, 0.2));
}, function (props) {
  return props.tertiary && (0, _theming.css)(_templateObject8(), props.theme.base === 'light' ? (0, _polished.darken)(0.02, props.theme.input.background) : (0, _polished.lighten)(0.02, props.theme.input.background), props.theme.input.color, props.theme.input.border, props.theme.input.borderRadius, props.theme.base === 'light' ? (0, _polished.darken)(0.05, props.theme.input.background) : (0, _polished.lighten)(0.05, props.theme.input.background), props.inForm ? '' : 'box-shadow: rgba(0,0,0,.2) 0 2px 6px 0, rgba(0,0,0,.1) 0 0 0 1px inset', props.theme.base === 'light' ? props.theme.input.background : props.theme.input.background, (0, _polished.rgba)(props.theme.color.secondary, 0.4));
}, function (props) {
  return props.outline && (0, _theming.css)(_templateObject9(), (0, _polished.transparentize)(0.8, props.theme.color.defaultText), (0, _polished.transparentize)(0.3, props.theme.color.defaultText), (0, _polished.transparentize)(0.5, props.theme.color.defaultText), (0, _polished.transparentize)(0.5, props.theme.color.defaultText), (0, _polished.transparentize)(0, props.theme.color.defaultText), props.primary && (0, _theming.css)(_templateObject10(), props.theme.color.primary, props.theme.color.primary, props.theme.color.primary, props.theme.color.primary, props.theme.color.primary, props.theme.color.primary, props.theme.color.lightest, props.theme.color.primary, (0, _polished.rgba)(props.theme.color.primary, 0.4), props.theme.color.primary, (0, _polished.rgba)(props.theme.color.primary, 0.2)), props.secondary && (0, _theming.css)(_templateObject11(), props.theme.color.secondary, props.theme.color.secondary, props.theme.color.secondary, props.theme.color.secondary, props.theme.color.secondary, props.theme.color.lightest, props.theme.color.secondary, (0, _polished.rgba)(props.theme.color.secondary, 0.4), props.theme.color.secondary, (0, _polished.rgba)(props.theme.color.secondary, 0.2)));
});

var ButtonLink = ButtonWrapper.withComponent('a', {
  target: "ex9hp6v0",
  label: "ButtonLink"
});
var Button = Object.assign((0, _react.forwardRef)(function (_ref, ref) {
  var isLink = _ref.isLink,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, ["isLink", "children"]);

  if (isLink) {
    return _react["default"].createElement(ButtonLink, _extends({}, props, {
      ref: ref
    }), children);
  }

  return _react["default"].createElement(ButtonWrapper, _extends({}, props, {
    ref: ref
  }), children);
}), {
  defaultProps: {
    isLink: false
  }
});
exports.Button = Button;