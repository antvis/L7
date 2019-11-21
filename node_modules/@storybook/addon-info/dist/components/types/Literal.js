"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _proptypes = require("./proptypes");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Literal = function Literal(_ref) {
  var propType = _ref.propType;
  return _react["default"].createElement("span", null, propType.value);
};

Literal.propTypes = {
  propType: _proptypes.TypeInfo.isRequired
};
var _default = Literal;
exports["default"] = _default;