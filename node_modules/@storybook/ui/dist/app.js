"use strict";

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _theming = require("@storybook/theming");

var _memoizerific = _interopRequireDefault(require("memoizerific"));

var _reactSizeme = _interopRequireDefault(require("react-sizeme"));

var _router = require("@storybook/router");

var _mobile = require("./components/layout/mobile");

var _desktop = require("./components/layout/desktop");

var _nav = _interopRequireDefault(require("./containers/nav"));

var _preview = _interopRequireDefault(require("./containers/preview"));

var _panel = _interopRequireDefault(require("./containers/panel"));

var _notifications = _interopRequireDefault(require("./containers/notifications"));

var _settings = _interopRequireDefault(require("./settings"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var _ref =
/*#__PURE__*/
_react["default"].createElement(_settings["default"], null);

var createProps = (0, _memoizerific["default"])(1)(function () {
  return {
    Nav: _nav["default"],
    Preview: _preview["default"],
    Panel: _panel["default"],
    Notifications: _notifications["default"],
    pages: [{
      key: 'settings',
      render: function render() {
        return _ref;
      },
      // eslint-disable-next-line react/prop-types
      route: function route(_ref2) {
        var children = _ref2.children;
        return _react["default"].createElement(_router.Route, {
          path: "/settings",
          startsWith: true
        }, children);
      }
    }]
  };
});

var View = _theming.styled.div({
  position: 'fixed',
  overflow: 'hidden',
  height: '100vh',
  width: '100vw'
});

var _ref4 =
/*#__PURE__*/
_react["default"].createElement(_theming.Global, {
  styles: _theming.createGlobal
});

var App = _react["default"].memo(function (_ref3) {
  var viewMode = _ref3.viewMode,
      layout = _ref3.layout,
      panelCount = _ref3.panelCount,
      _ref3$size = _ref3.size,
      width = _ref3$size.width,
      height = _ref3$size.height;
  var props = createProps();
  var content;

  if (!width || !height) {
    content = _react["default"].createElement("div", null, width, " x ", height);
  } else if (width < 600) {
    content = _react["default"].createElement(_mobile.Mobile, _extends({}, props, {
      viewMode: viewMode,
      options: layout,
      panelCount: panelCount
    }));
  } else {
    content = _react["default"].createElement(_desktop.Desktop, _extends({}, props, {
      viewMode: viewMode,
      options: layout
    }, {
      width: width,
      height: height
    }, {
      panelCount: panelCount
    }));
  }

  return _react["default"].createElement(View, null, _ref4, content);
});

App.propTypes = {
  viewMode: _propTypes["default"].oneOf(['story', 'info', 'docs', 'settings']),
  panelCount: _propTypes["default"].number.isRequired,
  layout: _propTypes["default"].shape({}).isRequired,
  size: _propTypes["default"].shape({
    width: _propTypes["default"].number,
    height: _propTypes["default"].number
  }).isRequired
};
App.defaultProps = {
  viewMode: undefined
};
var SizedApp = (0, _reactSizeme["default"])({
  monitorHeight: true
})(App);
App.displayName = 'App';
var _default = SizedApp;
exports["default"] = _default;