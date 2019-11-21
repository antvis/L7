"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var propTypes = {
  tagName: _propTypes["default"].string,
  onClick: _propTypes["default"].func.isRequired,
  onFocus: _propTypes["default"].func,
  onBlur: _propTypes["default"].func,
  className: _propTypes["default"].string
};
var defaultProps = {
  tagName: 'div'
};

var ClickableComponent =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(ClickableComponent, _Component);

  function ClickableComponent(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, ClickableComponent);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ClickableComponent).call(this, props, context));
    _this.handleClick = _this.handleClick.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleFocus = _this.handleFocus.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleBlur = _this.handleBlur.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleKeypress = _this.handleKeypress.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(ClickableComponent, [{
    key: "handleKeypress",
    value: function handleKeypress(event) {
      // Support Space (32) or Enter (13) key operation to fire a click event
      if (event.which === 32 || event.which === 13) {
        event.preventDefault();
        this.handleClick(event);
      }
    }
  }, {
    key: "handleClick",
    value: function handleClick(event) {
      var onClick = this.props.onClick;
      onClick(event);
    }
  }, {
    key: "handleFocus",
    value: function handleFocus(e) {
      document.addEventListener('keydown', this.handleKeypress);

      if (this.props.onFocus) {
        this.props.onFocus(e);
      }
    }
  }, {
    key: "handleBlur",
    value: function handleBlur(e) {
      document.removeEventListener('keydown', this.handleKeypress);

      if (this.props.onBlur) {
        this.props.onBlur(e);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var Tag = this.props.tagName;
      var props = (0, _objectSpread2["default"])({}, this.props);
      delete props.tagName;
      delete props.className;
      return _react["default"].createElement(Tag, (0, _extends2["default"])({
        className: (0, _classnames["default"])(this.props.className),
        role: "button",
        tabIndex: "0",
        onClick: this.handleClick,
        onFocus: this.handleFocus,
        onBlur: this.handleBlur
      }, props));
    }
  }]);
  return ClickableComponent;
}(_react.Component);

exports["default"] = ClickableComponent;
ClickableComponent.propTypes = propTypes;
ClickableComponent.defaultProps = defaultProps;
ClickableComponent.displayName = 'ClickableComponent';