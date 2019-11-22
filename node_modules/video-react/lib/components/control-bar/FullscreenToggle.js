"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

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
  actions: _propTypes["default"].object,
  player: _propTypes["default"].object,
  className: _propTypes["default"].string
};

var FullscreenToggle =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(FullscreenToggle, _Component);

  function FullscreenToggle(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, FullscreenToggle);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(FullscreenToggle).call(this, props, context));
    _this.handleClick = _this.handleClick.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(FullscreenToggle, [{
    key: "handleClick",
    value: function handleClick() {
      var _this$props = this.props,
          player = _this$props.player,
          actions = _this$props.actions;
      actions.toggleFullscreen(player);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          player = _this$props2.player,
          className = _this$props2.className;
      return _react["default"].createElement("button", {
        className: (0, _classnames["default"])(className, {
          'video-react-icon-fullscreen-exit': player.isFullscreen,
          'video-react-icon-fullscreen': !player.isFullscreen
        }, 'video-react-fullscreen-control video-react-control video-react-button video-react-icon'),
        ref: function ref(c) {
          _this2.button = c;
        },
        type: "button",
        tabIndex: "0",
        onClick: this.handleClick
      }, _react["default"].createElement("span", {
        className: "video-react-control-text"
      }, "Non-Fullscreen"));
    }
  }]);
  return FullscreenToggle;
}(_react.Component);

exports["default"] = FullscreenToggle;
FullscreenToggle.propTypes = propTypes;
FullscreenToggle.displayName = 'FullscreenToggle';