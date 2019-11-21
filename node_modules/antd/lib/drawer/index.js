"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(require("react"));

var _rcDrawer = _interopRequireDefault(require("rc-drawer"));

var _createReactContext = _interopRequireDefault(require("@ant-design/create-react-context"));

var _classnames = _interopRequireDefault(require("classnames"));

var _omit = _interopRequireDefault(require("omit.js"));

var _warning = _interopRequireDefault(require("../_util/warning"));

var _icon = _interopRequireDefault(require("../icon"));

var _context = require("../config-provider/context");

var _type = require("../_util/type");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

var DrawerContext = (0, _createReactContext["default"])(null);
var PlacementTypes = (0, _type.tuple)('top', 'right', 'bottom', 'left');

var Drawer =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Drawer, _React$Component);

  function Drawer() {
    var _this;

    _classCallCheck(this, Drawer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Drawer).apply(this, arguments));
    _this.state = {
      push: false
    };

    _this.push = function () {
      _this.setState({
        push: true
      });
    };

    _this.pull = function () {
      _this.setState({
        push: false
      });
    };

    _this.onDestroyTransitionEnd = function () {
      var isDestroyOnClose = _this.getDestroyOnClose();

      if (!isDestroyOnClose) {
        return;
      }

      if (!_this.props.visible) {
        _this.destroyClose = true;

        _this.forceUpdate();
      }
    };

    _this.getDestroyOnClose = function () {
      return _this.props.destroyOnClose && !_this.props.visible;
    }; // get drawer push width or height


    _this.getPushTransform = function (placement) {
      if (placement === 'left' || placement === 'right') {
        return "translateX(".concat(placement === 'left' ? 180 : -180, "px)");
      }

      if (placement === 'top' || placement === 'bottom') {
        return "translateY(".concat(placement === 'top' ? 180 : -180, "px)");
      }
    };

    _this.getRcDrawerStyle = function () {
      var _this$props = _this.props,
          zIndex = _this$props.zIndex,
          placement = _this$props.placement,
          style = _this$props.style;
      var push = _this.state.push;
      return _extends({
        zIndex: zIndex,
        transform: push ? _this.getPushTransform(placement) : undefined
      }, style);
    }; // render drawer body dom


    _this.renderBody = function () {
      var _this$props2 = _this.props,
          bodyStyle = _this$props2.bodyStyle,
          drawerStyle = _this$props2.drawerStyle,
          prefixCls = _this$props2.prefixCls,
          visible = _this$props2.visible;

      if (_this.destroyClose && !visible) {
        return null;
      }

      _this.destroyClose = false;
      var containerStyle = {};

      var isDestroyOnClose = _this.getDestroyOnClose();

      if (isDestroyOnClose) {
        // Increase the opacity transition, delete children after closing.
        containerStyle.opacity = 0;
        containerStyle.transition = 'opacity .3s';
      }

      return React.createElement("div", {
        className: "".concat(prefixCls, "-wrapper-body"),
        style: _extends(_extends({}, containerStyle), drawerStyle),
        onTransitionEnd: _this.onDestroyTransitionEnd
      }, _this.renderHeader(), React.createElement("div", {
        className: "".concat(prefixCls, "-body"),
        style: bodyStyle
      }, _this.props.children));
    }; // render Provider for Multi-level drawer


    _this.renderProvider = function (value) {
      var _a = _this.props,
          prefixCls = _a.prefixCls,
          placement = _a.placement,
          className = _a.className,
          wrapClassName = _a.wrapClassName,
          width = _a.width,
          height = _a.height,
          mask = _a.mask,
          rest = __rest(_a, ["prefixCls", "placement", "className", "wrapClassName", "width", "height", "mask"]);

      (0, _warning["default"])(wrapClassName === undefined, 'Drawer', 'wrapClassName is deprecated, please use className instead.');
      var haveMask = mask ? '' : 'no-mask';
      _this.parentDrawer = value;
      var offsetStyle = {};

      if (placement === 'left' || placement === 'right') {
        offsetStyle.width = width;
      } else {
        offsetStyle.height = height;
      }

      return React.createElement(DrawerContext.Provider, {
        value: _assertThisInitialized(_this)
      }, React.createElement(_rcDrawer["default"], _extends({
        handler: false
      }, (0, _omit["default"])(rest, ['zIndex', 'style', 'closable', 'destroyOnClose', 'drawerStyle', 'headerStyle', 'bodyStyle', 'title', 'push', 'visible', 'getPopupContainer', 'rootPrefixCls', 'getPrefixCls', 'renderEmpty', 'csp', 'pageHeader', 'autoInsertSpaceInButton']), offsetStyle, {
        prefixCls: prefixCls,
        open: _this.props.visible,
        showMask: mask,
        placement: placement,
        style: _this.getRcDrawerStyle(),
        className: (0, _classnames["default"])(wrapClassName, className, haveMask)
      }), _this.renderBody()));
    };

    return _this;
  }

  _createClass(Drawer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // fix: delete drawer in child and re-render, no push started.
      // <Drawer>{show && <Drawer />}</Drawer>
      var visible = this.props.visible;

      if (visible && this.parentDrawer) {
        this.parentDrawer.push();
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(preProps) {
      var visible = this.props.visible;

      if (preProps.visible !== visible && this.parentDrawer) {
        if (visible) {
          this.parentDrawer.push();
        } else {
          this.parentDrawer.pull();
        }
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      // unmount drawer in child, clear push.
      if (this.parentDrawer) {
        this.parentDrawer.pull();
        this.parentDrawer = null;
      }
    }
  }, {
    key: "renderHeader",
    value: function renderHeader() {
      var _this$props3 = this.props,
          title = _this$props3.title,
          prefixCls = _this$props3.prefixCls,
          closable = _this$props3.closable,
          headerStyle = _this$props3.headerStyle;

      if (!title && !closable) {
        return null;
      }

      var headerClassName = title ? "".concat(prefixCls, "-header") : "".concat(prefixCls, "-header-no-title");
      return React.createElement("div", {
        className: headerClassName,
        style: headerStyle
      }, title && React.createElement("div", {
        className: "".concat(prefixCls, "-title")
      }, title), closable && this.renderCloseIcon());
    }
  }, {
    key: "renderCloseIcon",
    value: function renderCloseIcon() {
      var _this$props4 = this.props,
          closable = _this$props4.closable,
          prefixCls = _this$props4.prefixCls,
          onClose = _this$props4.onClose;
      return closable && // eslint-disable-next-line react/button-has-type
      React.createElement("button", {
        onClick: onClose,
        "aria-label": "Close",
        className: "".concat(prefixCls, "-close")
      }, React.createElement(_icon["default"], {
        type: "close"
      }));
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(DrawerContext.Consumer, null, this.renderProvider);
    }
  }]);

  return Drawer;
}(React.Component);

Drawer.defaultProps = {
  width: 256,
  height: 256,
  closable: true,
  placement: 'right',
  maskClosable: true,
  mask: true,
  level: null,
  keyboard: true
};

var _default = (0, _context.withConfigConsumer)({
  prefixCls: 'drawer'
})(Drawer);

exports["default"] = _default;
//# sourceMappingURL=index.js.map
