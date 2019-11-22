"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _ProgressControl = _interopRequireDefault(require("./ProgressControl"));

var _PlayToggle = _interopRequireDefault(require("./PlayToggle"));

var _ForwardControl = _interopRequireDefault(require("./ForwardControl"));

var _ReplayControl = _interopRequireDefault(require("./ReplayControl"));

var _FullscreenToggle = _interopRequireDefault(require("./FullscreenToggle"));

var _RemainingTimeDisplay = _interopRequireDefault(require("../time-controls/RemainingTimeDisplay"));

var _CurrentTimeDisplay = _interopRequireDefault(require("../time-controls/CurrentTimeDisplay"));

var _DurationDisplay = _interopRequireDefault(require("../time-controls/DurationDisplay"));

var _TimeDivider = _interopRequireDefault(require("../time-controls/TimeDivider"));

var _VolumeMenuButton = _interopRequireDefault(require("./VolumeMenuButton"));

var _PlaybackRateMenuButton = _interopRequireDefault(require("./PlaybackRateMenuButton"));

var _utils = require("../../utils");

var propTypes = {
  children: _propTypes["default"].any,
  autoHide: _propTypes["default"].bool,
  autoHideTime: _propTypes["default"].number,
  // used in Player
  disableDefaultControls: _propTypes["default"].bool,
  disableCompletely: _propTypes["default"].bool,
  className: _propTypes["default"].string
};
var defaultProps = {
  autoHide: true,
  disableCompletely: false
};

var ControlBar =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(ControlBar, _Component);

  function ControlBar(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, ControlBar);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ControlBar).call(this, props));
    _this.getDefaultChildren = _this.getDefaultChildren.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getFullChildren = _this.getFullChildren.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(ControlBar, [{
    key: "getDefaultChildren",
    value: function getDefaultChildren() {
      return [_react["default"].createElement(_PlayToggle["default"], {
        key: "play-toggle",
        order: 1
      }), _react["default"].createElement(_VolumeMenuButton["default"], {
        key: "volume-menu-button",
        order: 4
      }), _react["default"].createElement(_CurrentTimeDisplay["default"], {
        key: "current-time-display",
        order: 5.1
      }), _react["default"].createElement(_TimeDivider["default"], {
        key: "time-divider",
        order: 5.2
      }), _react["default"].createElement(_DurationDisplay["default"], {
        key: "duration-display",
        order: 5.3
      }), _react["default"].createElement(_ProgressControl["default"], {
        key: "progress-control",
        order: 6
      }), _react["default"].createElement(_FullscreenToggle["default"], {
        key: "fullscreen-toggle",
        order: 8
      })];
    }
  }, {
    key: "getFullChildren",
    value: function getFullChildren() {
      return [_react["default"].createElement(_PlayToggle["default"], {
        key: "play-toggle",
        order: 1
      }), _react["default"].createElement(_ReplayControl["default"], {
        key: "replay-control",
        order: 2
      }), _react["default"].createElement(_ForwardControl["default"], {
        key: "forward-control",
        order: 3
      }), _react["default"].createElement(_VolumeMenuButton["default"], {
        key: "volume-menu-button",
        order: 4
      }), _react["default"].createElement(_CurrentTimeDisplay["default"], {
        key: "current-time-display",
        order: 5
      }), _react["default"].createElement(_TimeDivider["default"], {
        key: "time-divider",
        order: 6
      }), _react["default"].createElement(_DurationDisplay["default"], {
        key: "duration-display",
        order: 7
      }), _react["default"].createElement(_ProgressControl["default"], {
        key: "progress-control",
        order: 8
      }), _react["default"].createElement(_RemainingTimeDisplay["default"], {
        key: "remaining-time-display",
        order: 9
      }), _react["default"].createElement(_PlaybackRateMenuButton["default"], {
        rates: [1, 1.25, 1.5, 2],
        key: "playback-rate",
        order: 10
      }), _react["default"].createElement(_FullscreenToggle["default"], {
        key: "fullscreen-toggle",
        order: 11
      })];
    }
  }, {
    key: "getChildren",
    value: function getChildren() {
      var children = _react["default"].Children.toArray(this.props.children);

      var defaultChildren = this.props.disableDefaultControls ? [] : this.getDefaultChildren();
      var _this$props = this.props,
          className = _this$props.className,
          parentProps = (0, _objectWithoutProperties2["default"])(_this$props, ["className"]); // remove className

      return (0, _utils.mergeAndSortChildren)(defaultChildren, children, parentProps);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          autoHide = _this$props2.autoHide,
          className = _this$props2.className,
          disableCompletely = _this$props2.disableCompletely;
      var children = this.getChildren();
      return disableCompletely ? null : _react["default"].createElement("div", {
        className: (0, _classnames["default"])('video-react-control-bar', {
          'video-react-control-bar-auto-hide': autoHide
        }, className)
      }, children);
    }
  }]);
  return ControlBar;
}(_react.Component);

exports["default"] = ControlBar;
ControlBar.propTypes = propTypes;
ControlBar.defaultProps = defaultProps;
ControlBar.displayName = 'ControlBar';