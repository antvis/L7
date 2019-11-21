'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = mode;

var _utils = require('../utils');

/**
 * Resolves mode option for css-modules-require-hook
 *
 * @param {*} value
 * @returns {String}
 */
function mode(value /* , currentConfig */) {
    if (!(0, _utils.isString)(value)) {
        throw new Error(`Configuration 'mode' is not a string`);
    }

    return value;
}