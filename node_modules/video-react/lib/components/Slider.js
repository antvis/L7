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

var Dom = _interopRequireWildcard(require("../utils/dom"));

var propTypes = {
  className: _propTypes["default"].string,
  onMouseDown: _propTypes["default"].func,
  onMouseMove: _propTypes["default"].func,
  stepForward: _propTypes["default"].func,
  stepBack: _propTypes["default"].func,
  sliderActive: _propTypes["default"].func,
  sliderInactive: _propTypes["default"].func,
  onMouseUp: _propTypes["default"].func,
  onFocus: _propTypes["default"].func,
  onBlur: _propTypes["default"].func,
  onClick: _propTypes["default"].func,
  getPercent: _propTypes["default"].func,
  vertical: _propTypes["default"].bool,
  children: _propTypes["default"].node,
  label: _propTypes["default"].string,
  valuenow: _propTypes["default"].string,
  valuetext: _propTypes["default"].string
};

var Slider =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(Slider, _Component);

  function Slider(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, Slider);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Slider).call(this, props, context));
    _this.handleMouseDown = _this.handleMouseDown.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleMouseMove = _this.handleMouseMove.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleMouseUp = _this.handleMouseUp.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleFocus = _this.handleFocus.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleBlur = _this.handleBlur.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleClick = _this.handleClick.bind((0, _assertThisInitialized2["default"])(_this));
    _this.handleKeyPress = _this.handleKeyPress.bind((0, _assertThisInitialized2["default"])(_this));
    _this.stepForward = _this.stepForward.bind((0, _assertThisInitialized2["default"])(_this));
    _this.stepBack = _this.stepBack.bind((0, _assertThisInitialized2["default"])(_this));
    _this.calculateDistance = _this.calculateDistance.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getProgress = _this.getProgress.bind((0, _assertThisInitialized2["default"])(_this));
    _this.renderChildren = _this.renderChildren.bind((0, _assertThisInitialized2["default"])(_this));
    _this.state = {
      active: false
    };
    return _this;
  }

  (0, _createClass2["default"])(Slider, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      document.removeEventListener('mousemove', this.handleMouseMove, true);
      document.removeEventListener('mouseup', this.handleMouseUp, true);
      document.removeEventListener('touchmove', this.handleMouseMove, true);
      document.removeEventListener('touchend', this.handleMouseUp, true);
      document.removeEventListener('keydown', this.handleKeyPress, true);
    }
  }, {
    key: "getProgress",
    value: function getProgress() {
      var getPercent = this.props.getPercent;

      if (!getPercent) {
        return 0;
      }

      var progress = getPercent(); // Protect against no duration and other division issues

      if (typeof progress !== 'number' || progress < 0 || progress === Infinity) {
        progress = 0;
      }

      return progress;
    }
  }, {
    key: "handleMouseDown",
    value: function handleMouseDown(event) {
      var onMouseDown = this.props.onMouseDown; // event.preventDefault();
      // event.stopPropagation();

      document.addEventListener('mousemove', this.handleMouseMove, true);
      document.addEventListener('mouseup', this.handleMouseUp, true);
      document.addEventListener('touchmove', this.handleMouseMove, true);
      document.addEventListener('touchend', this.handleMouseUp, true);
      this.setState({
        active: true
      });

      if (this.props.sliderActive) {
        this.props.sliderActive(event);
      }

      this.handleMouseMove(event);

      if (onMouseDown) {
        onMouseDown(event);
      }
    }
  }, {
    key: "handleMouseMove",
    value: function handleMouseMove(event) {
      var onMouseMove = this.props.onMouseMove;

      if (onMouseMove) {
        onMouseMove(event);
      }
    }
  }, {
    key: "handleMouseUp",
    value: function handleMouseUp(event) {
      // On iOS safari, a subsequent mouseup event will be fired after touchend.
      // Its weird event positions make the player seek a wrong time.
      // calling preventDefault (at touchend phase) will prevent the mouseup event
      event.preventDefault();
      var onMouseUp = this.props.onMouseUp;
      document.removeEventListener('mousemove', this.handleMouseMove, true);
      document.removeEventListener('mouseup', this.handleMouseUp, true);
      document.removeEventListener('touchmove', this.handleMouseMove, true);
      document.removeEventListener('touchend', this.handleMouseUp, true);
      this.setState({
        active: false
      });

      if (this.props.sliderInactive) {
        this.props.sliderInactive(event);
      }

      if (onMouseUp) {
        onMouseUp(event);
      }
    }
  }, {
    key: "handleFocus",
    value: function handleFocus(e) {
      document.addEventListener('keydown', this.handleKeyPress, true);

      if (this.props.onFocus) {
        this.props.onFocus(e);
      }
    }
  }, {
    key: "handleBlur",
    value: function handleBlur(e) {
      document.removeEventListener('keydown', this.handleKeyPress, true);

      if (this.props.onBlur) {
        this.props.onBlur(e);
      }
    }
  }, {
    key: "handleClick",
    value: function handleClick(event) {
      event.preventDefault(); // event.stopPropagation();

      if (this.props.onClick) {
        this.props.onClick(event);
      }
    }
  }, {
    key: "handleKeyPress",
    value: function handleKeyPress(event) {
      if (event.which === 37 || event.which === 40) {
        // Left and Down Arrows
        event.preventDefault();
        event.stopPropagation();
        this.stepBack();
      } else if (event.which === 38 || event.which === 39) {
        // Up and Right Arrows
        event.preventDefault();
        event.stopPropagation();
        this.stepForward();
      }
    }
  }, {
    key: "stepForward",
    value: function stepForward() {
      if (this.props.stepForward) {
        this.props.stepForward();
      }
    }
  }, {
    key: "stepBack",
    value: function stepBack() {
      if (this.props.stepBack) {
        this.props.stepBack();
      }
    }
  }, {
    key: "calculateDistance",
    value: function calculateDistance(event) {
      var node = this.slider;
      var position = Dom.getPointerPosition(node, event);

      if (this.props.vertical) {
        return position.y;
      }

      return position.x;
    }
  }, {
    key: "renderChildren",
    value: function renderChildren() {
      var progress = this.getProgress();
      var percentage = "".concat((progress * 100).toFixed(2), "%");
      return _react["default"].Children.map(this.props.children, function (child) {
        return _react["default"].cloneElement(child, {
          progress: progress,
          percentage: percentage
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          vertical = _this$props.vertical,
          label = _this$props.label,
          valuenow = _this$props.valuenow,
          valuetext = _this$props.valuetext;
      return _react["default"].createElement("div", {
        className: (0, _classnames["default"])(this.props.className, {
          'video-react-slider-vertical': vertical,
          'video-react-slider-horizontal': !vertical,
          'video-react-sliding': this.state.active
        }, 'video-react-slider'),
        ref: function ref(c) {
          _this2.slider = c;
        },
        tabIndex: "0",
        role: "slider",
        onMouseDown: this.handleMouseDown,
        onTouchStart: this.handleMouseDown,
        onFocus: this.handleFocus,
        onBlur: this.handleBlur,
        onClick: this.handleClick,
        "aria-label": label || '',
        "aria-valuenow": valuenow || '',
        "aria-valuetext": valuetext || '',
        "aria-valuemin": 0,
        "aria-valuemax": 100
      }, this.renderChildren());
    }
  }]);
  return Slider;
}(_react.Component);

exports["default"] = Slider;
Slider.propTypes = propTypes;
Slider.displayName = 'Slider';