'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = devMode;

var _utils = require('../utils');

/**
 * Resolves devMode option for css-modules-require-hook
 *
 * @param {*} value
 * @returns {boolean}
 */
function devMode(value /* , currentConfig */) {
    if (!(0, _utils.isBoolean)(value)) {
        throw new Error(`Configuration 'devMode' is not a boolean`);
    }

    return value;
}