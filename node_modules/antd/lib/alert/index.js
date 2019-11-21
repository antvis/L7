"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(require("react"));

var ReactDOM = _interopRequireWildcard(require("react-dom"));

var _rcAnimate = _interopRequireDefault(require("rc-animate"));

var _classnames = _interopRequireDefault(require("classnames"));

var _icon = _interopRequireDefault(require("../icon"));

var _configProvider = require("../config-provider");

var _getDataOrAriaProps = _interopRequireDefault(require("../_util/getDataOrAriaProps"));

var _warning = _interopRequireDefault(require("../_util/warning"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function noop() {}

var Alert =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Alert, _React$Component);

  function Alert(props) {
    var _this;

    _classCallCheck(this, Alert);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Alert).call(this, props));

    _this.handleClose = function (e) {
      e.preventDefault();
      var dom = ReactDOM.findDOMNode(_assertThisInitialized(_this));
      dom.style.height = "".concat(dom.offsetHeight, "px"); // Magic code
      // 重复一次后才能正确设置 height

      dom.style.height = "".concat(dom.offsetHeight, "px");

      _this.setState({
        closing: true
      });

      (_this.props.onClose || noop)(e);
    };

    _this.animationEnd = function () {
      _this.setState({
        closing: false,
        closed: true
      });

      (_this.props.afterClose || noop)();
    };

    _this.renderAlert = function (_ref) {
      var _classNames;

      var getPrefixCls = _ref.getPrefixCls;
      var _this$props = _this.props,
          description = _this$props.description,
          customizePrefixCls = _this$props.prefixCls,
          message = _this$props.message,
          closeText = _this$props.closeText,
          banner = _this$props.banner,
          _this$props$className = _this$props.className,
          className = _this$props$className === void 0 ? '' : _this$props$className,
          style = _this$props.style,
          icon = _this$props.icon;
      var _this$props2 = _this.props,
          closable = _this$props2.closable,
          type = _this$props2.type,
          showIcon = _this$props2.showIcon,
          iconType = _this$props2.iconType;
      var _this$state = _this.state,
          closing = _this$state.closing,
          closed = _this$state.closed;
      var prefixCls = getPrefixCls('alert', customizePrefixCls); // banner模式默认有 Icon

      showIcon = banner && showIcon === undefined ? true : showIcon; // banner模式默认为警告

      type = banner && type === undefined ? 'warning' : type || 'info';
      var iconTheme = 'filled';

      if (!iconType) {
        switch (type) {
          case 'success':
            iconType = 'check-circle';
            break;

          case 'info':
            iconType = 'info-circle';
            break;

          case 'error':
            iconType = 'close-circle';
            break;

          case 'warning':
            iconType = 'exclamation-circle';
            break;

          default:
            iconType = 'default';
        } // use outline icon in alert with description


        if (description) {
          iconTheme = 'outlined';
        }
      } // closeable when closeText is assigned


      if (closeText) {
        closable = true;
      }

      var alertCls = (0, _classnames["default"])(prefixCls, "".concat(prefixCls, "-").concat(type), (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-closing"), closing), _defineProperty(_classNames, "".concat(prefixCls, "-with-description"), !!description), _defineProperty(_classNames, "".concat(prefixCls, "-no-icon"), !showIcon), _defineProperty(_classNames, "".concat(prefixCls, "-banner"), !!banner), _defineProperty(_classNames, "".concat(prefixCls, "-closable"), closable), _classNames), className);
      var closeIcon = closable ? React.createElement("button", {
        type: "button",
        onClick: _this.handleClose,
        className: "".concat(prefixCls, "-close-icon"),
        tabIndex: 0
      }, closeText ? React.createElement("span", {
        className: "".concat(prefixCls, "-close-text")
      }, closeText) : React.createElement(_icon["default"], {
        type: "close"
      })) : null;
      var dataOrAriaProps = (0, _getDataOrAriaProps["default"])(_this.props);
      var iconNode = icon && (React.isValidElement(icon) ? React.cloneElement(icon, {
        className: (0, _classnames["default"])("".concat(prefixCls, "-icon"), _defineProperty({}, icon.props.className, icon.props.className))
      }) : React.createElement("span", {
        className: "".concat(prefixCls, "-icon")
      }, icon)) || React.createElement(_icon["default"], {
        className: "".concat(prefixCls, "-icon"),
        type: iconType,
        theme: iconTheme
      });
      return closed ? null : React.createElement(_rcAnimate["default"], {
        component: "",
        showProp: "data-show",
        transitionName: "".concat(prefixCls, "-slide-up"),
        onEnd: _this.animationEnd
      }, React.createElement("div", _extends({
        "data-show": !closing,
        className: alertCls,
        style: style
      }, dataOrAriaProps), showIcon ? iconNode : null, React.createElement("span", {
        className: "".concat(prefixCls, "-message")
      }, message), React.createElement("span", {
        className: "".concat(prefixCls, "-description")
      }, description), closeIcon));
    };

    (0, _warning["default"])(!('iconType' in props), 'Alert', '`iconType` is deprecated. Please use `icon` instead.');
    _this.state = {
      closing: false,
      closed: false
    };
    return _this;
  }

  _createClass(Alert, [{
    key: "render",
    value: function render() {
      return React.createElement(_configProvider.ConfigConsumer, null, this.renderAlert);
    }
  }]);

  return Alert;
}(React.Component);

exports["default"] = Alert;
//# sourceMappingURL=index.js.map
