"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.is-array");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.map");

require("core-js/modules/es.object.create");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.entries");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.get-prototype-of");

require("core-js/modules/es.object.set-prototype-of");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _theming = require("@storybook/theming");

var _components = require("@storybook/components");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DesktopOnlyIconButton = (0, _theming.styled)(_components.IconButton)({
  // Hides full screen icon at mobile breakpoint defined in app.js
  '@media (max-width: 599px)': {
    display: 'none'
  }
});

var _ref =
/*#__PURE__*/
_react["default"].createElement("h1", null, "Something went wrong.");

var SafeTab =
/*#__PURE__*/
function (_Component) {
  _inherits(SafeTab, _Component);

  function SafeTab(props) {
    var _this;

    _classCallCheck(this, SafeTab);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SafeTab).call(this, props));
    _this.state = {
      hasError: false
    };
    return _this;
  }

  _createClass(SafeTab, [{
    key: "componentDidCatch",
    value: function componentDidCatch(error, info) {
      this.setState({
        hasError: true
      }); // eslint-disable-next-line no-console

      console.error(error, info);
    }
  }, {
    key: "render",
    value: function render() {
      var hasError = this.state.hasError;
      var _this$props = this.props,
          children = _this$props.children,
          title = _this$props.title,
          id = _this$props.id;

      if (hasError) {
        return _ref;
      }

      return _react["default"].createElement("div", {
        id: id,
        title: title
      }, children);
    }
  }]);

  return SafeTab;
}(_react.Component);

SafeTab.displayName = "SafeTab";
SafeTab.propTypes = {
  children: _propTypes["default"].oneOfType([_propTypes["default"].node, _propTypes["default"].func]),
  title: _propTypes["default"].string.isRequired,
  id: _propTypes["default"].string.isRequired
};
SafeTab.defaultProps = {
  children: null
};

var _ref3 =
/*#__PURE__*/
_react["default"].createElement(_components.Icons, {
  icon: "close"
});

var AddonPanel = _react["default"].memo(function (_ref2) {
  var panels = _ref2.panels,
      actions = _ref2.actions,
      selectedPanel = _ref2.selectedPanel,
      panelPosition = _ref2.panelPosition,
      _ref2$absolute = _ref2.absolute,
      absolute = _ref2$absolute === void 0 ? true : _ref2$absolute;
  return _react["default"].createElement(_components.Tabs, {
    absolute: absolute,
    selected: selectedPanel,
    actions: actions,
    flex: true,
    tools: _react["default"].createElement(_react.Fragment, null, _react["default"].createElement(DesktopOnlyIconButton, {
      key: "position",
      onClick: actions.togglePosition,
      title: "Change orientation"
    }, _react["default"].createElement(_components.Icons, {
      icon: panelPosition === 'bottom' ? 'bottombar' : 'sidebaralt'
    })), _react["default"].createElement(DesktopOnlyIconButton, {
      key: "visibility",
      onClick: actions.toggleVisibility,
      title: "Hide addons"
    }, _ref3)),
    id: "storybook-panel-root"
  }, Object.entries(panels).map(function (_ref4) {
    var _ref5 = _slicedToArray(_ref4, 2),
        k = _ref5[0],
        v = _ref5[1];

    return _react["default"].createElement(SafeTab, {
      key: k,
      id: k,
      title: v.title
    }, v.render);
  }));
});

AddonPanel.displayName = 'AddonPanel';
AddonPanel.propTypes = {
  selectedPanel: _propTypes["default"].string,
  actions: _propTypes["default"].shape({
    togglePosition: _propTypes["default"].func,
    toggleVisibility: _propTypes["default"].func
  }).isRequired,
  panels: _propTypes["default"].shape({}).isRequired,
  panelPosition: _propTypes["default"].oneOf(['bottom', 'right']),
  absolute: _propTypes["default"].bool
};
AddonPanel.defaultProps = {
  selectedPanel: null,
  panelPosition: 'right',
  absolute: true
};
var _default = AddonPanel;
exports["default"] = _default;