"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _utils = require("../../utils");

var propTypes = {
  player: _propTypes["default"].object,
  className: _propTypes["default"].string
};

function RemainingTimeDisplay(_ref) {
  var _ref$player = _ref.player,
      currentTime = _ref$player.currentTime,
      duration = _ref$player.duration,
      className = _ref.className;
  var remainingTime = duration - currentTime;
  var formattedTime = (0, _utils.formatTime)(remainingTime);
  return _react["default"].createElement("div", {
    className: (0, _classnames["default"])('video-react-remaining-time video-react-time-control video-react-control', className)
  }, _react["default"].createElement("div", {
    className: "video-react-remaining-time-display",
    "aria-live": "off"
  }, _react["default"].createElement("span", {
    className: "video-react-control-text"
  }, "Remaining Time "), "-".concat(formattedTime)));
}

RemainingTimeDisplay.propTypes = propTypes;
RemainingTimeDisplay.displayName = 'RemainingTimeDisplay';
var _default = RemainingTimeDisplay;
exports["default"] = _default;