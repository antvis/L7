"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.create");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.get-prototype-of");

require("core-js/modules/es.object.set-prototype-of");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.iterator");

var _global = require("global");

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react2 = require("@storybook/react");

var _addonKnobs = require("@storybook/addon-knobs");

var _theming = require("@storybook/theming");

var _desktop = require("./desktop");

var _mobile = require("./mobile");

var _Sidebar = _interopRequireDefault(require("../sidebar/Sidebar"));

var _panel = _interopRequireDefault(require("../panel/panel"));

var _preview = require("../preview/preview");

var _panel2 = require("../panel/panel.stories");

var _preview2 = require("../preview/preview.stories");

var _treeview = require("../sidebar/treeview/treeview.mockdata");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var realNavProps = {
  title: 'Title',
  url: 'https://example.com',
  stories: _treeview.mockDataset.withRoot,
  menu: []
};

var PlaceholderBlock = _theming.styled.div(function (_ref) {
  var color = _ref.color;
  return {
    background: color || 'hotpink',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  };
});

var PlaceholderClock =
/*#__PURE__*/
function (_Component) {
  _inherits(PlaceholderClock, _Component);

  function PlaceholderClock() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, PlaceholderClock);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(PlaceholderClock)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      count: 1
    };
    return _this;
  }

  _createClass(PlaceholderClock, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.interval = (0, _global.setInterval)(function () {
        var count = _this2.state.count;

        _this2.setState({
          count: count + 1
        });
      }, 1000);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var interval = this.interval;
      clearInterval(interval);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          color = _this$props.color;
      var count = this.state.count;
      return _react["default"].createElement(PlaceholderBlock, {
        color: color
      }, _react["default"].createElement("h2", {
        style: {
          position: 'absolute',
          bottom: 0,
          right: 0,
          color: 'rgba(0,0,0,0.2)',
          fontSize: '150px',
          lineHeight: '150px',
          margin: '-20px'
        }
      }, count), children);
    }
  }]);

  return PlaceholderClock;
}(_react.Component);

PlaceholderClock.displayName = "PlaceholderClock";
PlaceholderClock.propTypes = {
  children: _propTypes["default"].node.isRequired,
  color: _propTypes["default"].string.isRequired
};

var MockNav = function MockNav(props) {
  return _react["default"].createElement(PlaceholderClock, {
    color: "hotpink"
  }, _react["default"].createElement("pre", null, JSON.stringify(props, null, 2)));
};

MockNav.displayName = "MockNav";

var MockPreview = function MockPreview(props) {
  return _react["default"].createElement(PlaceholderClock, {
    color: "deepskyblue"
  }, _react["default"].createElement("pre", null, JSON.stringify(props, null, 2)));
};

MockPreview.displayName = "MockPreview";

var MockPanel = function MockPanel(props) {
  return _react["default"].createElement(PlaceholderClock, {
    color: "orangered"
  }, _react["default"].createElement("pre", null, JSON.stringify(props, null, 2)));
};

MockPanel.displayName = "MockPanel";

var MockPage = function MockPage(props) {
  return _react["default"].createElement(PlaceholderClock, {
    color: "cyan"
  }, _react["default"].createElement("pre", null, JSON.stringify(props, null, 2)));
};

MockPage.displayName = "MockPage";
var mockProps = {
  Nav: MockNav,
  Preview: MockPreview,
  Panel: MockPanel,
  Notifications: function Notifications() {
    return null;
  },
  pages: [],
  options: {
    isFullscreen: false,
    showNav: true,
    showPanel: true,
    panelPosition: 'right'
  },
  path: '/story/UI-DesktopLayout-noNav',
  viewMode: 'story',
  storyId: 'UI-DesktopLayout-noNav',
  panelCount: 2
};
var realProps = {
  Nav: function Nav() {
    return _react["default"].createElement(_Sidebar["default"], realNavProps);
  },
  Preview: function Preview() {
    return _react["default"].createElement(_preview.Preview, _preview2.previewProps);
  },
  Notifications: function Notifications() {
    return null;
  },
  Panel: function Panel() {
    return _react["default"].createElement(_panel["default"], {
      panels: _panel2.panels,
      actions: {
        onSelect: function onSelect() {},
        toggleVisibility: function toggleVisibility() {},
        togglePosition: function togglePosition() {}
      },
      selectedPanel: "test2"
    });
  },
  pages: [],
  options: {
    isFullscreen: false,
    showNav: true,
    showPanel: true,
    panelPosition: 'right'
  },
  path: '/story/UI-DesktopLayout-noNav',
  viewMode: 'story',
  storyId: 'UI-DesktopLayout-noNav',
  panelCount: 2
};

var _ref11 =
/*#__PURE__*/
_react["default"].createElement(MockPage, null);

(0, _react2.storiesOf)('UI|Layout/Desktop', module).addParameters({
  component: _desktop.Desktop
}).addDecorator(_addonKnobs.withKnobs).addDecorator(function (storyFn) {
  var mocked = (0, _addonKnobs["boolean"])('mock', true);
  var height = (0, _addonKnobs.number)('height', _global.window.innerHeight);
  var width = (0, _addonKnobs.number)('width', _global.window.innerWidth);
  var props = Object.assign({
    height: height,
    width: width
  }, mocked ? mockProps : realProps);
  return _react["default"].createElement("div", {
    style: {
      minHeight: 600,
      minWidth: 600
    }
  }, storyFn({
    props: props
  }));
}).add('default', function (_ref2) {
  var props = _ref2.props;
  return _react["default"].createElement(_desktop.Desktop, props);
}).add('no addons', function (_ref3) {
  var props = _ref3.props;
  return _react["default"].createElement(_desktop.Desktop, _extends({}, props, {
    panelCount: 0
  }));
}).add('no Nav', function (_ref4) {
  var props = _ref4.props;
  return _react["default"].createElement(_desktop.Desktop, _extends({}, props, {
    options: Object.assign({}, props.options, {
      showNav: false
    })
  }));
}).add('no Panel', function (_ref5) {
  var props = _ref5.props;
  return _react["default"].createElement(_desktop.Desktop, _extends({}, props, {
    options: Object.assign({}, props.options, {
      showPanel: false
    })
  }));
}).add('bottom Panel', function (_ref6) {
  var props = _ref6.props;
  return _react["default"].createElement(_desktop.Desktop, _extends({}, props, {
    options: Object.assign({}, props.options, {
      panelPosition: 'bottom'
    })
  }));
}).add('full', function (_ref7) {
  var props = _ref7.props;
  return _react["default"].createElement(_desktop.Desktop, _extends({}, props, {
    options: Object.assign({}, props.options, {
      isFullscreen: true
    })
  }));
}).add('no Panel, no Nav', function (_ref8) {
  var props = _ref8.props;
  return _react["default"].createElement(_desktop.Desktop, _extends({}, props, {
    options: Object.assign({}, props.options, {
      showPanel: false,
      showNav: false
    })
  }));
}).add('page', function (_ref9) {
  var props = _ref9.props;
  return _react["default"].createElement(_desktop.Desktop, _extends({}, props, {
    pages: [{
      key: 'settings',
      // eslint-disable-next-line react/prop-types
      route: function route(_ref10) {
        var children = _ref10.children;
        return _react["default"].createElement(_react.Fragment, null, children);
      },
      render: function render() {
        return _ref11;
      }
    }],
    viewMode: "settings"
  }));
});

var _ref17 =
/*#__PURE__*/
_react["default"].createElement(MockPage, null);

(0, _react2.storiesOf)('UI|Layout/Mobile', module).addParameters({
  component: _mobile.Mobile
}).addDecorator(_addonKnobs.withKnobs).addDecorator(function (storyFn) {
  var mocked = (0, _addonKnobs["boolean"])('mock', true);
  var props = Object.assign({}, mocked ? mockProps : realProps);
  return storyFn({
    props: props
  });
}).add('initial 0', function (_ref12) {
  var props = _ref12.props;
  return _react["default"].createElement(_mobile.Mobile, _extends({}, props, {
    options: {
      initialActive: 0
    }
  }));
}).add('initial 1', function (_ref13) {
  var props = _ref13.props;
  return _react["default"].createElement(_mobile.Mobile, _extends({}, props, {
    options: {
      initialActive: 1
    }
  }));
}).add('initial 2', function (_ref14) {
  var props = _ref14.props;
  return _react["default"].createElement(_mobile.Mobile, _extends({}, props, {
    options: {
      initialActive: 2
    }
  }));
}).add('page', function (_ref15) {
  var props = _ref15.props;
  return _react["default"].createElement(_mobile.Mobile, _extends({}, props, {
    options: {
      initialActive: 1
    },
    pages: [{
      key: 'settings',
      // eslint-disable-next-line react/prop-types
      route: function route(_ref16) {
        var children = _ref16.children;
        return _react["default"].createElement(_react.Fragment, null, children);
      },
      render: function render() {
        return _ref17;
      }
    }],
    viewMode: "settings"
  }));
});