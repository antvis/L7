"use strict";

function _interopDefault(ex) {
  return ex && "object" == typeof ex && "default" in ex ? ex.default : ex;
}

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var _defineProperty = _interopDefault(require("@babel/runtime/helpers/defineProperty")), React = require("react"), React__default = _interopDefault(React), core = require("@emotion/core"), weakMemoize = _interopDefault(require("@emotion/weak-memoize")), _extends = _interopDefault(require("@babel/runtime/helpers/extends")), hoistNonReactStatics = _interopDefault(require("hoist-non-react-statics"));

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(source, !0).forEach(function(key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(source).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}

var getTheme = function(outerTheme, theme) {
  return "function" == typeof theme ? theme(outerTheme) : _objectSpread({}, outerTheme, {}, theme);
}, createCacheWithTheme = weakMemoize(function(outerTheme) {
  return weakMemoize(function(theme) {
    return getTheme(outerTheme, theme);
  });
}), ThemeProvider = function(props) {
  return React.createElement(core.ThemeContext.Consumer, null, function(theme) {
    return props.theme !== theme && (theme = createCacheWithTheme(theme)(props.theme)), 
    React.createElement(core.ThemeContext.Provider, {
      value: theme
    }, props.children);
  });
};

function withTheme(Component) {
  var componentName = Component.displayName || Component.name || "Component", WithTheme = React.forwardRef(function(props, ref) {
    return React.createElement(core.ThemeContext.Consumer, null, function(theme) {
      return React.createElement(Component, _extends({
        theme: theme,
        ref: ref
      }, props));
    });
  });
  return WithTheme.displayName = "WithTheme(" + componentName + ")", hoistNonReactStatics(WithTheme, Component);
}

function useTheme() {
  return React__default.useContext(core.ThemeContext);
}

exports.ThemeProvider = ThemeProvider, exports.useTheme = useTheme, exports.withTheme = withTheme;
