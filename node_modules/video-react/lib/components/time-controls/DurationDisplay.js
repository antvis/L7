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

function DurationDisplay(_ref) {
  var duration = _ref.player.duration,
      className = _ref.className;
  var formattedTime = (0, _utils.formatTime)(duration);
  return _react["default"].createElement("div", {
    className: (0, _classnames["default"])(className, 'video-react-duration video-react-time-control video-react-control')
  }, _react["default"].createElement("div", {
    className: "video-react-duration-display",
    "aria-live": "off"
  }, _react["default"].createElement("span", {
    className: "video-react-control-text"
  }, "Duration Time "), formattedTime));
}

DurationDisplay.propTypes = propTypes;
DurationDisplay.displayName = 'DurationDisplay';
var _default = DurationDisplay;
exports["default"] = _default;