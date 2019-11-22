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
  position: _propTypes["default"].string,
  className: _propTypes["default"].string
};
var defaultProps = {
  position: 'left'
};

var BigPlayButton =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(BigPlayButton, _Component);

  function BigPlayButton(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, BigPlayButton);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(BigPlayButton).call(this, props, context));
    _this.handleClick = _this.handleClick.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(BigPlayButton, [{
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "handleClick",
    value: function handleClick() {
      var actions = this.props.actions;
      actions.play();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          player = _this$props.player,
          position = _this$props.position;
      return _react["default"].createElement("button", {
        className: (0, _classnames["default"])('video-react-big-play-button', "video-react-big-play-button-".concat(position), this.props.className, {
          'big-play-button-hide': player.hasStarted || !player.currentSrc
        }),
        type: "button",
        "aria-live": "polite",
        tabIndex: "0",
        onClick: this.handleClick
      }, _react["default"].createElement("span", {
        className: "video-react-control-text"
      }, "Play Video"));
    }
  }]);
  return BigPlayButton;
}(_react.Component);

exports["default"] = BigPlayButton;
BigPlayButton.propTypes = propTypes;
BigPlayButton.defaultProps = defaultProps;
BigPlayButton.displayName = 'BigPlayButton';