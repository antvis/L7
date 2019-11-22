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

function MouseTimeDisplay(_ref) {
  var duration = _ref.duration,
      mouseTime = _ref.mouseTime,
      className = _ref.className,
      text = _ref.text;

  if (!mouseTime.time) {
    return null;
  }

  var time = text || (0, _utils.formatTime)(mouseTime.time, duration);
  return _react["default"].createElement("div", {
    className: (0, _classnames["default"])('video-react-mouse-display', className),
    style: {
      left: "".concat(mouseTime.position, "px")
    },
    "data-current-time": time
  });
}

MouseTimeDisplay.propTypes = {
  duration: _propTypes["default"].number,
  mouseTime: _propTypes["default"].object,
  className: _propTypes["default"].string
};
MouseTimeDisplay.displayName = 'MouseTimeDisplay';
var _default = MouseTimeDisplay;
exports["default"] = _default;