"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _Slider = _interopRequireDefault(require("../Slider"));

var _VolumeLevel = _interopRequireDefault(require("./VolumeLevel"));

var propTypes = {
  actions: _propTypes["default"].object,
  player: _propTypes["default"].object,
  className: _propTypes["default"].string,
  onFocus: _propTypes["default"].func,
  onBlur: _propTypes["default"].func
};

var VolumeBar =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(VolumeBar, _Component);

  function VolumeBar(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, VolumeBar);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(VolumeBar).call(this, props, context));
    _this.state = {
      percentage: '0%'
    };
    _this.handleMouseMove = _this.handleMouseMove.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handlePercentageChange = _this.handlePercentageChange.bind((0, _assertThisInitialized2["default"])(_this));
    _this.checkMuted = _this.checkMuted.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getPercent = _this.getPercent.bind((0, _assertThisInitialized2["default"])(_this));
    _this.stepForward = _this.stepForward.bind((0, _assertThisInitialized2["default"])(_this));
    _this.stepBack = _this.stepBack.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleFocus = _this.handleFocus.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleBlur = _this.handleBlur.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleClick = _this.handleClick.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(VolumeBar, [{
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "getPercent",
    value: function getPercent() {
      var player = this.props.player;

      if (player.muted) {
        return 0;
      }

      return player.volume;
    }
  }, {
    key: "checkMuted",
    value: function checkMuted() {
      var _this$props = this.props,
          player = _this$props.player,
          actions = _this$props.actions;

      if (player.muted) {
        actions.mute(false);
      }
    }
  }, {
    key: "handleMouseMove",
    value: function handleMouseMove(event) {
      var actions = this.props.actions;
      this.checkMuted();
      var distance = this.slider.calculateDistance(event);
      actions.changeVolume(distance);
    }
  }, {
    key: "stepForward",
    value: function stepForward() {
      var _this$props2 = this.props,
          player = _this$props2.player,
          actions = _this$props2.actions;
      this.checkMuted();
      actions.changeVolume(player.volume + 0.1);
    }
  }, {
    key: "stepBack",
    value: function stepBack() {
      var _this$props3 = this.props,
          player = _this$props3.player,
          actions = _this$props3.actions;
      this.checkMuted();
      actions.changeVolume(player.volume - 0.1);
    }
  }, {
    key: "handleFocus",
    value: function handleFocus(e) {
      if (this.props.onFocus) {
        this.props.onFocus(e);
      }
    }
  }, {
    key: "handleBlur",
    value: function handleBlur(e) {
      if (this.props.onBlur) {
        this.props.onBlur(e);
      }
    }
  }, {
    key: "handlePercentageChange",
    value: function handlePercentageChange(percentage) {
      if (percentage !== this.state.percentage) {
        this.setState({
          percentage: percentage
        });
      }
    }
  }, {
    key: "handleClick",
    value: function handleClick(event) {
      event.stopPropagation();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props4 = this.props,
          player = _this$props4.player,
          className = _this$props4.className;
      var volume = (player.volume * 100).toFixed(2);
      return _react["default"].createElement(_Slider["default"], (0, _extends2["default"])({
        ref: function ref(c) {
          _this2.slider = c;
        },
        label: "volume level",
        valuenow: volume,
        valuetext: "".concat(volume, "%"),
        onMouseMove: this.handleMouseMove,
        onFocus: this.handleFocus,
        onBlur: this.handleBlur,
        onClick: this.handleClick,
        sliderActive: this.handleFocus,
        sliderInactive: this.handleBlur,
        getPercent: this.getPercent,
        onPercentageChange: this.handlePercentageChange,
        stepForward: this.stepForward,
        stepBack: this.stepBack
      }, this.props, {
        className: (0, _classnames["default"])(className, 'video-react-volume-bar video-react-slider-bar')
      }), _react["default"].createElement(_VolumeLevel["default"], this.props));
    }
  }]);
  return VolumeBar;
}(_react.Component);

VolumeBar.propTypes = propTypes;
VolumeBar.displayName = 'VolumeBar';
var _default = VolumeBar;
exports["default"] = _default;