'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = processorOpts;

var _utils = require('../utils');

/**
 * Resolves processorOpts option for css-modules-require-hook
 *
 * @param {String|Function} value
 *
 * @returns {String|Function}
 */
function processorOpts(value /* ,currentConfig */) {
    if ((0, _utils.isModulePath)(value)) {
        const requiredModule = (0, _utils.requireLocalFileOrNodeModule)(value);

        if ((0, _utils.isPlainObject)(requiredModule)) {
            return requiredModule;
        }

        throw new Error(`Configuration file for 'processorOpts' is not exporting a plain object`);
    } else if ((0, _utils.isPlainObject)(value)) {
        return value;
    } else {
        throw new Error(`Configuration 'processorOpts' is not a plain object nor a valid path to module`);
    }
}