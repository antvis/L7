'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isString;
/**
 * Is provided object a string?
 *
 * @param {*} object
 * @returns {boolean}
 */
function isString(object) {
  return typeof object === 'string';
}