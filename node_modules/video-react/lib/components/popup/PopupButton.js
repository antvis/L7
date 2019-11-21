"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = PopupButton;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _ClickableComponent = _interopRequireDefault(require("../ClickableComponent"));

var _Popup = _interopRequireDefault(require("./Popup"));

var propTypes = {
  inline: _propTypes["default"].bool,
  onClick: _propTypes["default"].func.isRequired,
  onFocus: _propTypes["default"].func,
  onBlur: _propTypes["default"].func,
  className: _propTypes["default"].string
};
var defaultProps = {
  inline: true
};

function PopupButton(props) {
  var inline = props.inline,
      className = props.className;
  var ps = (0, _objectSpread2["default"])({}, props);
  delete ps.children;
  delete ps.inline;
  delete ps.className;
  return _react["default"].createElement(_ClickableComponent["default"], (0, _extends2["default"])({
    className: (0, _classnames["default"])(className, {
      'video-react-menu-button-inline': !!inline,
      'video-react-menu-button-popup': !inline
    }, 'video-react-control video-react-button video-react-menu-button')
  }, ps), _react["default"].createElement(_Popup["default"], props));
}

PopupButton.propTypes = propTypes;
PopupButton.defaultProps = defaultProps;
PopupButton.displayName = 'PopupButton';