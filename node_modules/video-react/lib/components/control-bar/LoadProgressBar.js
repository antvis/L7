"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = LoadProgressBar;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var propTypes = {
  duration: _propTypes["default"].number,
  buffered: _propTypes["default"].object,
  className: _propTypes["default"].string
}; // Shows load progress

function LoadProgressBar(_ref) {
  var buffered = _ref.buffered,
      duration = _ref.duration,
      className = _ref.className;

  if (!buffered || !buffered.length) {
    return null;
  }

  var bufferedEnd = buffered.end(buffered.length - 1);
  var style = {};

  if (bufferedEnd > duration) {
    bufferedEnd = duration;
  } // get the percent width of a time compared to the total end


  function percentify(time, end) {
    var percent = time / end || 0; // no NaN

    return "".concat((percent >= 1 ? 1 : percent) * 100, "%");
  } // the width of the progress bar


  style.width = percentify(bufferedEnd, duration);
  var parts = []; // add child elements to represent the individual buffered time ranges

  for (var i = 0; i < buffered.length; i++) {
    var start = buffered.start(i);
    var end = buffered.end(i); // set the percent based on the width of the progress bar (bufferedEnd)

    var part = _react["default"].createElement("div", {
      style: {
        left: percentify(start, bufferedEnd),
        width: percentify(end - start, bufferedEnd)
      },
      key: "part-".concat(i)
    });

    parts.push(part);
  }

  if (parts.length === 0) {
    parts = null;
  }

  return _react["default"].createElement("div", {
    style: style,
    className: (0, _classnames["default"])('video-react-load-progress', className)
  }, _react["default"].createElement("span", {
    className: "video-react-control-text"
  }, "Loaded: 0%"), parts);
}

LoadProgressBar.propTypes = propTypes;
LoadProgressBar.displayName = 'LoadProgressBar';