'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = processCss;

var _utils = require('../utils');

/**
 * Resolves processCss option for css-modules-require-hook
 *
 * @param {String|Function} value
 *
 * @returns {String|Function}
 */
function processCss(value /* ,currentConfig */) {
    if ((0, _utils.isModulePath)(value)) {
        const requiredModule = (0, _utils.requireLocalFileOrNodeModule)(value);

        if ((0, _utils.isFunction)(requiredModule)) {
            return requiredModule;
        }

        throw new Error(`Configuration file for 'processCss' is not exporting a function`);
    } else if ((0, _utils.isFunction)(value)) {
        return value;
    } else {
        throw new Error(`Configuration 'processCss' is not a function nor a valid path to module`);
    }
}