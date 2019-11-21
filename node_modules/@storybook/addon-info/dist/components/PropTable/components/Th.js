"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Th = function Th(_ref) {
  var children = _ref.children;
  return _react["default"].createElement("th", null, children);
};

Th.propTypes = {
  children: _propTypes["default"].oneOfType([_propTypes["default"].node, _propTypes["default"].element, _propTypes["default"].arrayOf(_propTypes["default"].node), _propTypes["default"].arrayOf(_propTypes["default"].element)]).isRequired
};
var _default = Th;
exports["default"] = _default;