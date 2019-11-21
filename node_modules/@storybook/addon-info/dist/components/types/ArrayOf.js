"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _PrettyPropType = _interopRequireDefault(require("./PrettyPropType"));

var _proptypes = require("./proptypes");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable import/no-cycle */
var ArrayOf = function ArrayOf(_ref) {
  var propType = _ref.propType;
  return _react["default"].createElement("span", null, _react["default"].createElement("span", null, "["), _react["default"].createElement("span", null, _react["default"].createElement(_PrettyPropType["default"], {
    propType: (0, _proptypes.getPropTypes)(propType)
  })), _react["default"].createElement("span", null, "]"));
};

ArrayOf.propTypes = {
  propType: _proptypes.TypeInfo.isRequired
};
var _default = ArrayOf;
exports["default"] = _default;