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

var Dom = _interopRequireWildcard(require("../../utils/dom"));

var _SeekBar = _interopRequireDefault(require("./SeekBar"));

var propTypes = {
  player: _propTypes["default"].object,
  className: _propTypes["default"].string
};

var ProgressControl =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(ProgressControl, _Component);

  function ProgressControl(props, context) {
    var _this;

    (0, _classCallCheck2["default"])(this, ProgressControl);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ProgressControl).call(this, props, context));
    _this.state = {
      mouseTime: {
        time: null,
        position: 0
      }
    };
    _this.handleMouseMoveThrottle = _this.handleMouseMove.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(ProgressControl, [{
    key: "handleMouseMove",
    value: function handleMouseMove(event) {
      if (!event.pageX) {
        return;
      }

      var duration = this.props.player.duration;
      var node = this.seekBar;
      var newTime = Dom.getPointerPosition(node, event).x * duration;
      var position = event.pageX - Dom.findElPosition(node).left;
      this.setState({
        mouseTime: {
          time: newTime,
          position: position
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var className = this.props.className;
      return _react["default"].createElement("div", {
        onMouseMove: this.handleMouseMoveThrottle,
        className: (0, _classnames["default"])('video-react-progress-control video-react-control', className)
      }, _react["default"].createElement(_SeekBar["default"], (0, _extends2["default"])({
        mouseTime: this.state.mouseTime,
        ref: function ref(c) {
          _this2.seekBar = c;
        }
      }, this.props)));
    }
  }]);
  return ProgressControl;
}(_react.Component);

exports["default"] = ProgressControl;
ProgressControl.propTypes = propTypes;
ProgressControl.displayName = 'ProgressControl';