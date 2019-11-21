"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function CopyButton(_ref) {
  var onClick = _ref.onClick,
      toggled = _ref.toggled;
  var toggleText = 'Copied!';
  var text = 'Copy';
  return _react["default"].createElement("button", {
    type: "button",
    onClick: onClick,
    style: {
      backgroundColor: 'rgb(255, 255, 255)',
      cursor: 'pointer',
      fontSize: '13px',
      alignSelf: 'flex-start',
      flexShrink: '0',
      overflow: 'hidden',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'rgb(238, 238, 238)',
      borderImage: 'initial',
      borderRadius: '3px',
      padding: '3px 10px'
    }
  }, toggled ? toggleText : text);
}

CopyButton.propTypes = {
  onClick: _propTypes["default"].func,
  toggled: _propTypes["default"].bool
};
CopyButton.defaultProps = {
  onClick: function onClick() {},
  toggled: false
};
var _default = CopyButton;
exports["default"] = _default;