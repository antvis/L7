'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = isPlainObject;
/**
 * Is provided value an plain object?
 *
 * @param {*} object
 * @returns {boolean}
 */
function isPlainObject(object) {
    if (object === null || object === undefined) {
        return false;
    }

    return object.toString() === '[object Object]';
}