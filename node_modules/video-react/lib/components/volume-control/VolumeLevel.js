"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var propTypes = {
  percentage: _propTypes["default"].string,
  vertical: _propTypes["default"].bool,
  className: _propTypes["default"].string
};
var defaultProps = {
  percentage: '100%',
  vertical: false
};

function VolumeLevel(_ref) {
  var percentage = _ref.percentage,
      vertical = _ref.vertical,
      className = _ref.className;
  var style = {};

  if (vertical) {
    style.height = percentage;
  } else {
    style.width = percentage;
  }

  return _react["default"].createElement("div", {
    className: (0, _classnames["default"])(className, 'video-react-volume-level'),
    style: style
  }, _react["default"].createElement("span", {
    className: "video-react-control-text"
  }));
}

VolumeLevel.propTypes = propTypes;
VolumeLevel.defaultProps = defaultProps;
VolumeLevel.displayName = 'VolumeLevel';
var _default = VolumeLevel;
exports["default"] = _default;