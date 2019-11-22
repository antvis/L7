"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isBoolean;
/**
 * Is provided value a boolean?
 *
 * @param {*} value
 * @returns {boolean}
 */
function isBoolean(value) {
  return value === true || value === false;
}