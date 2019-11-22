'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = generateScopedName;

var _utils = require('../utils');

/**
 * Resolves generateScopedName option for css-modules-require-hook
 *
 * @param {String|Function} value
 *
 * @returns {String|Function}
 */
function generateScopedName(value /* ,currentConfig */) {
    if ((0, _utils.isModulePath)(value)) {
        const requiredModule = (0, _utils.requireLocalFileOrNodeModule)(value);

        if ((0, _utils.isString)(requiredModule) || (0, _utils.isFunction)(requiredModule)) {
            return requiredModule;
        }

        throw new Error(`Configuration file for 'generateScopedName' is not exporting a string nor a function`);
    } else if ((0, _utils.isString)(value) || (0, _utils.isFunction)(value)) {
        return value;
    } else {
        throw new Error(`Configuration 'generateScopedName' is not a function, string nor valid path to module`);
    }
}