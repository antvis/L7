"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isRegExp;
/**
 * Is Provided object an RegExp?
 *
 * @param {*} object
 * @returns {boolean}
 */
function isRegExp(object) {
  return object instanceof RegExp;
}