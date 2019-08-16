"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.packUint8ToFloat = packUint8ToFloat;

var _clamp = _interopRequireDefault(require("@antv/util/lib/clamp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * encode 2 8-bit unsigned int into a 16-bit float
 * @param {number} a 8-bit int
 * @param {number} b 8-bit int
 * @return {number} float
 */
function packUint8ToFloat(a, b) {
  a = (0, _clamp["default"])(Math.floor(a), 0, 255);
  b = (0, _clamp["default"])(Math.floor(b), 0, 255);
  return 256 * a + b;
}