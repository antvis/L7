"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.map");

require("core-js/modules/es.object.create");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.get-prototype-of");

require("core-js/modules/es.object.set-prototype-of");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mobile = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _theming = require("@storybook/theming");

var _components = require("@storybook/components");

var _container = require("./container");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Pane = _theming.styled.div({
  transition: 'transform .2s ease',
  position: 'absolute',
  top: 0,
  height: '100%',
  overflow: 'auto'
}, function (_ref) {
  var theme = _ref.theme;
  return {
    background: theme.background.content,
    '&:nth-of-type(1)': {
      borderRight: "1px solid ".concat(theme.appBorderColor)
    },
    '&:nth-of-type(3)': {
      borderLeft: "1px solid ".concat(theme.appBorderColor)
    }
  };
}, function (_ref2) {
  var index = _ref2.index;

  switch (index) {
    case 0:
      {
        return {
          width: '80vw',
          transform: 'translateX(-80vw)',
          left: 0
        };
      }

    case 1:
      {
        return {
          width: '100%',
          transform: 'translateX(0) scale(1)',
          left: 0
        };
      }

    case 2:
      {
        return {
          width: '80vw',
          transform: 'translateX(80vw)',
          right: 0
        };
      }

    default:
      {
        return {};
      }
  }
}, function (_ref3) {
  var active = _ref3.active,
      index = _ref3.index;

  switch (true) {
    case index === 0 && active === 0:
      {
        return {
          transform: 'translateX(-0px)'
        };
      }

    case index === 1 && active === 0:
      {
        return {
          transform: 'translateX(40vw) translateY(-42.5vh) translateY(40px) scale(0.2)'
        };
      }

    case index === 1 && active === 2:
      {
        return {
          transform: 'translateX(-40vw) translateY(-42.5vh) translateY(40px) scale(0.2)'
        };
      }

    case index === 2 && active === 2:
      {
        return {
          transform: 'translateX(0px)'
        };
      }

    default:
      {
        return {};
      }
  }
});

var Panels = _react["default"].memo(function (_ref4) {
  var children = _ref4.children,
      active = _ref4.active;
  return _react["default"].createElement(Panels.Container, null, _react.Children.toArray(children).map(function (item, index) {
    return (// eslint-disable-next-line react/no-array-index-key
      _react["default"].createElement(Pane, {
        key: index,
        index: index,
        active: active
      }, item)
    );
  }));
});

Panels.displayName = 'Panels';
Panels.propTypes = {
  children: _propTypes["default"].node.isRequired,
  active: _propTypes["default"].number.isRequired
};
Panels.Container = _theming.styled.div({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: 'calc(100% - 40px)'
});

var Bar = _theming.styled.nav({
  position: 'fixed',
  bottom: 0,
  left: 0,
  width: '100vw',
  height: 40,
  display: 'flex',
  boxShadow: '0 1px 5px 0 rgba(0, 0, 0, 0.1)',
  '& > *': {
    flex: 1
  }
}, function (_ref5) {
  var theme = _ref5.theme;
  return {
    background: theme.barBg
  };
});

var Mobile =
/*#__PURE__*/
function (_Component) {
  _inherits(Mobile, _Component);

  function Mobile(props) {
    var _this;

    _classCallCheck(this, Mobile);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Mobile).call(this));
    var options = props.options;
    _this.state = {
      active: options.initialActive
    };
    return _this;
  }

  _createClass(Mobile, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          Nav = _this$props.Nav,
          Preview = _this$props.Preview,
          Panel = _this$props.Panel,
          Notifications = _this$props.Notifications,
          pages = _this$props.pages,
          viewMode = _this$props.viewMode,
          options = _this$props.options;
      var active = this.state.active;
      return _react["default"].createElement(_container.Root, null, _react["default"].createElement(Notifications, {
        placement: {
          position: 'fixed',
          bottom: 60,
          left: 20,
          right: 20
        }
      }), _react["default"].createElement(Panels, {
        active: active
      }, _react["default"].createElement(Nav, null), _react["default"].createElement("div", null, _react["default"].createElement("div", {
        hidden: !viewMode
      }, _react["default"].createElement(Preview, {
        isToolshown: options.isToolshown,
        id: "main",
        viewMode: viewMode,
        debug: options
      })), pages.map(function (_ref6) {
        var key = _ref6.key,
            Route = _ref6.route,
            content = _ref6.render;
        return _react["default"].createElement(Route, {
          key: key
        }, content());
      })), _react["default"].createElement(Panel, {
        hidden: !viewMode
      })), _react["default"].createElement(Bar, {
        active: active
      }, _react["default"].createElement(_components.TabButton, {
        onClick: function onClick() {
          return _this2.setState({
            active: 0
          });
        },
        active: active === 0
      }, "Sidebar"), _react["default"].createElement(_components.TabButton, {
        onClick: function onClick() {
          return _this2.setState({
            active: 1
          });
        },
        active: active === 1 || active === false
      }, viewMode ? 'Canvas' : null, pages.map(function (_ref7) {
        var key = _ref7.key,
            Route = _ref7.route;
        return _react["default"].createElement(Route, {
          key: key
        }, key);
      })), viewMode ? _react["default"].createElement(_components.TabButton, {
        onClick: function onClick() {
          return _this2.setState({
            active: 2
          });
        },
        active: active === 2
      }, "Addons") : null));
    }
  }]);

  return Mobile;
}(_react.Component);

exports.Mobile = Mobile;
Mobile.displayName = "Mobile";
Mobile.displayName = 'MobileLayout';
Mobile.propTypes = {
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
  viewMode: _propTypes["default"].oneOf(['story', 'info', 'docs', 'settings']),
  options: _propTypes["default"].shape({
    initialActive: _propTypes["default"].number,
    isToolshown: _propTypes["default"].bool
  }).isRequired
};
Mobile.defaultProps = {
  viewMode: undefined
};