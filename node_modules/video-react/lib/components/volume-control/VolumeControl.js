"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = VolumeControl;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _VolumeBar = _interopRequireDefault(require("./VolumeBar"));

var propTypes = {
  className: _propTypes["default"].string
};

function VolumeControl(_ref) {
  var className = _ref.className,
      rest = (0, _objectWithoutProperties2["default"])(_ref, ["className"]);
  return _react["default"].createElement("div", {
    className: (0, _classnames["default"])(className, 'video-react-volume-control video-react-control')
  }, _react["default"].createElement(_VolumeBar["default"], rest));
}

VolumeControl.propTypes = propTypes;
VolumeControl.displayName = 'VolumeControl';