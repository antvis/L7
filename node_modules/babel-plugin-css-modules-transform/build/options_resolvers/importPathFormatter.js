'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = importPathFormatter;

var _utils = require('../utils');

/**
 * Resolves importPathFormatter option
 *
 * @param {String|Function} value
 * @returns {Function}
 */
function importPathFormatter(value /* , currentConfig */) {
    if ((0, _utils.isFunction)(value)) {
        return value;
    } else if ((0, _utils.isModulePath)(value)) {
        const requiredOption = (0, _utils.requireLocalFileOrNodeModule)(value);

        if (!(0, _utils.isFunction)(requiredOption)) {
            throw new Error(`Configuration file for 'importPathFormatter' is not exporting a function`);
        }

        return requiredOption;
    }

    throw new Error(`Configuration 'importPathFormatter' is not a function nor a valid module path`);
}