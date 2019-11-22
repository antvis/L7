"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Tr = function Tr(_ref) {
  var children = _ref.children;
  return _react["default"].createElement("tr", null, children);
};

Tr.propTypes = {
  children: _propTypes["default"].node.isRequired
};
var _default = Tr;
exports["default"] = _default;