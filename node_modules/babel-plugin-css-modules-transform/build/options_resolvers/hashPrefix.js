'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = hashPrefix;

var _utils = require('../utils');

/**
 * Resolves hashPrefix option for css-modules-require-hook
 *
 * @param {*} value
 * @returns {String}
 */
function hashPrefix(value /* , currentConfig */) {
    if (!(0, _utils.isString)(value)) {
        throw new Error(`Configuration 'hashPrefix' is not a string`);
    }

    return value;
}