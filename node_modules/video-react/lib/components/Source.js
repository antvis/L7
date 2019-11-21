"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Source;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var propTypes = {
  src: _propTypes["default"].string.isRequired,
  media: _propTypes["default"].string,
  type: _propTypes["default"].string
};

function Source(props) {
  var src = props.src,
      media = props.media,
      type = props.type;
  return _react["default"].createElement("source", {
    src: src,
    media: media,
    type: type
  });
}

Source.propTypes = propTypes;
Source.displayName = 'Source';