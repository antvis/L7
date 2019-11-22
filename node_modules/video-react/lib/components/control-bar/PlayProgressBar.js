"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = PlayProgressBar;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _utils = require("../../utils");

var propTypes = {
  currentTime: _propTypes["default"].number,
  duration: _propTypes["default"].number,
  percentage: _propTypes["default"].string,
  className: _propTypes["default"].string
}; // Shows play progress

function PlayProgressBar(_ref) {
  var currentTime = _ref.currentTime,
      duration = _ref.duration,
      percentage = _ref.percentage,
      className = _ref.className;
  return _react["default"].createElement("div", {
    "data-current-time": (0, _utils.formatTime)(currentTime, duration),
    className: (0, _classnames["default"])('video-react-play-progress video-react-slider-bar', className),
    style: {
      width: percentage
    }
  }, _react["default"].createElement("span", {
    className: "video-react-control-text"
  }, "Progress: ".concat(percentage)));
}

PlayProgressBar.propTypes = propTypes;
PlayProgressBar.displayName = 'PlayProgressBar';