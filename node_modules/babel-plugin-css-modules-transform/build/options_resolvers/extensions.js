'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = extensions;

var _utils = require('../utils');

/**
 * Resolves extensions for css-modules-require-hook
 *
 * @param {*} value
 * @returns {Array.<String>}
 */
function extensions(value /* , currentConfig */) {
    if (Array.isArray(value)) {
        return value.map((extension, index) => {
            if (!(0, _utils.isString)(extension)) {
                throw new Error(`Configuration 'extensions[${index}]' is not a string`);
            }

            return extension;
        });
    }

    throw new Error(`Configuration 'extensions' is not an array`);
}