"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var styles = {
  hasProperty: {
    whiteSpace: 'nowrap'
  }
};

var PropertyLabel = function PropertyLabel(_ref) {
  var property = _ref.property,
      required = _ref.required;
  if (!property) return null;
  return _react["default"].createElement("span", {
    style: styles.hasProperty
  }, property, required ? '' : '?', ":", ' ');
};

PropertyLabel.propTypes = {
  property: _propTypes["default"].string,
  required: _propTypes["default"].bool
};
PropertyLabel.defaultProps = {
  property: '',
  required: false
};
var _default = PropertyLabel;
exports["default"] = _default;