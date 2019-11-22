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

var _Slider = _interopRequireDefault(require("../Slider"));

var _PlayProgressBar = _interopRequireDefault(require("./PlayProgressBar"));

var _LoadProgressBar = _interopRequireDefault(require("./LoadProgressBar"));

var _MouseTimeDisplay = _interopRequireDefault(require("./MouseTimeDisplay"));

var _utils = require("../../utils");

var propTypes = {
  player: _propTypes["default"].object,
  mouseTime: _propTypes["default"].object,
  actions: _propTypes["default"].object,
  className: _propTypes["default"].string
};

var SeekBar =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(SeekBar, _Component);

  function SeekBar(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, SeekBar);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(SeekBar).call(this, props, context));
    _this.getPercent = _this.getPercent.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getNewTime = _this.getNewTime.bind((0, _assertThisInitialized2["default"])(_this));
    _this.stepForward = _this.stepForward.bind((0, _assertThisInitialized2["default"])(_this));
    _this.stepBack = _this.stepBack.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleMouseDown = _this.handleMouseDown.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleMouseMove = _this.handleMouseMove.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleMouseUp = _this.handleMouseUp.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(SeekBar, [{
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {}
    /**
     * Get percentage of video played
     *
     * @return {Number} Percentage played
     * @method getPercent
     */

  }, {
    key: "getPercent",
    value: function getPercent() {
      var _this$props$player = this.props.player,
          currentTime = _this$props$player.currentTime,
          seekingTime = _this$props$player.seekingTime,
          duration = _this$props$player.duration;
      var time = seekingTime || currentTime;
      var percent = time / duration;
      return percent >= 1 ? 1 : percent;
    }
  }, {
    key: "getNewTime",
    value: function getNewTime(event) {
      var duration = this.props.player.duration;
      var distance = this.slider.calculateDistance(event);
      var newTime = distance * duration; // Don't let video end while scrubbing.

      return newTime === duration ? newTime - 0.1 : newTime;
    }
  }, {
    key: "handleMouseDown",
    value: function handleMouseDown() {}
  }, {
    key: "handleMouseUp",
    value: function handleMouseUp(event) {
      var actions = this.props.actions;
      var newTime = this.getNewTime(event); // Set new time (tell video to seek to new time)

      actions.seek(newTime);
      actions.handleEndSeeking(newTime);
    }
  }, {
    key: "handleMouseMove",
    value: function handleMouseMove(event) {
      var actions = this.props.actions;
      var newTime = this.getNewTime(event);
      actions.handleSeekingTime(newTime);
    }
  }, {
    key: "stepForward",
    value: function stepForward() {
      var actions = this.props.actions;
      actions.forward(5);
    }
  }, {
    key: "stepBack",
    value: function stepBack() {
      var actions = this.props.actions;
      actions.replay(5);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          _this$props$player2 = _this$props.player,
          currentTime = _this$props$player2.currentTime,
          seekingTime = _this$props$player2.seekingTime,
          duration = _this$props$player2.duration,
          buffered = _this$props$player2.buffered,
          mouseTime = _this$props.mouseTime;
      var time = seekingTime || currentTime;
      return _react["default"].createElement(_Slider["default"], {
        ref: function ref(input) {
          _this2.slider = input;
        },
        label: "video progress bar",
        className: (0, _classnames["default"])('video-react-progress-holder', this.props.className),
        valuenow: (this.getPercent() * 100).toFixed(2),
        valuetext: (0, _utils.formatTime)(time, duration),
        onMouseDown: this.handleMouseDown,
        onMouseMove: this.handleMouseMove,
        onMouseUp: this.handleMouseUp,
        getPercent: this.getPercent,
        stepForward: this.stepForward,
        stepBack: this.stepBack
      }, _react["default"].createElement(_LoadProgressBar["default"], {
        buffered: buffered,
        currentTime: time,
        duration: duration
      }), _react["default"].createElement(_MouseTimeDisplay["default"], {
        duration: duration,
        mouseTime: mouseTime
      }), _react["default"].createElement(_PlayProgressBar["default"], {
        currentTime: time,
        duration: duration
      }));
    }
  }]);
  return SeekBar;
}(_react.Component);

exports["default"] = SeekBar;
SeekBar.propTypes = propTypes;
SeekBar.displayName = 'SeekBar';