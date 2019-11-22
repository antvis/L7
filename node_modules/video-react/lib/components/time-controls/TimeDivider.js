"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = TimeDivider;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var propTypes = {
  separator: _propTypes["default"].string,
  className: _propTypes["default"].string
};

function TimeDivider(_ref) {
  var separator = _ref.separator,
      className = _ref.className;
  var separatorText = separator || '/';
  return _react["default"].createElement("div", {
    className: (0, _classnames["default"])('video-react-time-control video-react-time-divider', className),
    dir: "ltr"
  }, _react["default"].createElement("div", null, _react["default"].createElement("span", null, separatorText)));
}

TimeDivider.propTypes = propTypes;
TimeDivider.displayName = 'TimeDivider';