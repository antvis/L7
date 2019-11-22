"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var styles = {
  border: '1px solid #eee',
  borderRadius: 3,
  backgroundColor: '#FFFFFF',
  cursor: 'pointer',
  fontSize: 15,
  padding: '3px 10px',
  margin: 10
};

var Button = function Button(_ref) {
  var children = _ref.children,
      onClick = _ref.onClick;
  return _react["default"].createElement("button", {
    onClick: onClick,
    style: styles,
    type: "button"
  }, children);
};

Button.displayName = 'Button';
Button.propTypes = {
  children: _propTypes["default"].node.isRequired,
  onClick: _propTypes["default"].func
};
Button.defaultProps = {
  onClick: function onClick() {}
};
var _default = Button;
exports["default"] = _default;