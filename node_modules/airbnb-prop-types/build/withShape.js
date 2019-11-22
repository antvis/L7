"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = withShape;

var _and = _interopRequireDefault(require("./and"));

var _shape = _interopRequireDefault(require("./shape"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function withShape(type, shapeTypes) {
  if (typeof type !== 'function') {
    throw new TypeError('type must be a valid PropType');
  }

  var shapeValidator = (0, _shape["default"])(shapeTypes);
  return (0, _and["default"])([type, shapeValidator], 'withShape');
}
//# sourceMappingURL=withShape.js.map