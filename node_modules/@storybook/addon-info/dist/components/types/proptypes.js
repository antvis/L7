"use strict";

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-own-property-descriptor");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPropTypes = exports.TypeInfo = void 0;

var _propTypes = _interopRequireWildcard(require("prop-types"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var TypeInfo = (0, _propTypes.oneOfType)([_propTypes["default"].shape({
  name: _propTypes["default"].string,
  value: _propTypes["default"].any
}), _propTypes["default"].string]);
exports.TypeInfo = TypeInfo;

var getPropTypes = function getPropTypes(propType) {
  return typeof propType === 'string' ? propType : propType.value || propType.elements;
};

exports.getPropTypes = getPropTypes;