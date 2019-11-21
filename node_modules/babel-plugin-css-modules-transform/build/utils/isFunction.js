'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isFunction;
/**
 * Is provided object a function?
 *
 * @param {*} object
 * @returns {boolean}
 */
function isFunction(object) {
  return typeof object === 'function';
}