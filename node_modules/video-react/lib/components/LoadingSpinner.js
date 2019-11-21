"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = LoadingSpinner;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var propTypes = {
  player: _propTypes["default"].object,
  className: _propTypes["default"].string
};

function LoadingSpinner(_ref) {
  var player = _ref.player,
      className = _ref.className;

  if (player.error) {
    return null;
  }

  return _react["default"].createElement("div", {
    className: (0, _classnames["default"])('video-react-loading-spinner', className)
  });
}

LoadingSpinner.propTypes = propTypes;
LoadingSpinner.displayName = 'LoadingSpinner';