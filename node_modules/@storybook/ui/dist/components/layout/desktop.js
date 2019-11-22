"use strict";

require("core-js/modules/es.array.map");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-own-property-descriptor");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Desktop = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var S = _interopRequireWildcard(require("./container"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Desktop = _react["default"].memo(function (_ref) {
  var Panel = _ref.Panel,
      Nav = _ref.Nav,
      Preview = _ref.Preview,
      Notifications = _ref.Notifications,
      pages = _ref.pages,
      options = _ref.options,
      viewMode = _ref.viewMode,
      width = _ref.width,
      height = _ref.height,
      panelCount = _ref.panelCount;
  return _react["default"].createElement(_react.Fragment, null, _react["default"].createElement(Notifications, {
    placement: {
      position: 'fixed',
      bottom: 20,
      left: 20
    }
  }), width && height ? _react["default"].createElement(S.Layout, {
    options: options,
    bounds: {
      width: width,
      height: height
    },
    viewMode: viewMode,
    panelCount: panelCount
  }, function (_ref2) {
    var navProps = _ref2.navProps,
        mainProps = _ref2.mainProps,
        panelProps = _ref2.panelProps,
        previewProps = _ref2.previewProps;
    return _react["default"].createElement(_react.Fragment, null, _react["default"].createElement(S.Nav, navProps, _react["default"].createElement(Nav, {
      debug: navProps
    })), _react["default"].createElement(S.Main, mainProps, _react["default"].createElement(S.Preview, _extends({}, previewProps, {
      hidden: viewMode === 'settings'
    }), _react["default"].createElement(Preview, {
      id: "main",
      debug: previewProps
    })), _react["default"].createElement(S.Panel, _extends({}, panelProps, {
      hidden: viewMode !== 'story'
    }), _react["default"].createElement(Panel, {
      debug: panelProps
    })), pages.map(function (_ref3) {
      var key = _ref3.key,
          Route = _ref3.route,
          content = _ref3.render;
      return _react["default"].createElement(Route, {
        key: key
      }, content());
    })));
  }) : _react["default"].createElement("div", {
    title: JSON.stringify({
      width: width,
      height: height
    })
  }));
});

exports.Desktop = Desktop;
Desktop.displayName = 'DesktopLayout';
Desktop.propTypes = {
  width: _propTypes["default"].number,
  panelCount: _propTypes["default"].number.isRequired,
  height: _propTypes["default"].number,
  Nav: _propTypes["default"].any.isRequired,
  // eslint-disable-line react/forbid-prop-types
  Preview: _propTypes["default"].any.isRequired,
  // eslint-disable-line react/forbid-prop-types
  Panel: _propTypes["default"].any.isRequired,
  // eslint-disable-line react/forbid-prop-types
  Notifications: _propTypes["default"].any.isRequired,
  // eslint-disable-line react/forbid-prop-types
  pages: _propTypes["default"].arrayOf(_propTypes["default"].shape({
    key: _propTypes["default"].string.isRequired,
    route: _propTypes["default"].func.isRequired,
    render: _propTypes["default"].func.isRequired
  })).isRequired,
  options: _propTypes["default"].shape({
    isFullscreen: _propTypes["default"].bool.isRequired,
    showNav: _propTypes["default"].bool.isRequired,
    showPanel: _propTypes["default"].bool.isRequired,
    panelPosition: _propTypes["default"].string.isRequired,
    isToolshown: _propTypes["default"].bool.isRequired
  }).isRequired,
  viewMode: _propTypes["default"].oneOf(['story', 'info', 'docs', 'settings'])
};
Desktop.defaultProps = {
  viewMode: undefined,
  height: 0,
  width: 0
};