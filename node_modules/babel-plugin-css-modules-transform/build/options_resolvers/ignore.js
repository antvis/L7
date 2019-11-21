'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = ignore;

var _utils = require('../utils');

/**
 * Resolves ignore option for css-modules-require-hook
 *
 * @param {*} value
 * @returns {Function|String|RegExp}
 */
function ignore(value /* , currentConfig */) {
    if ((0, _utils.isFunction)(value) || (0, _utils.isRegExp)(value)) {
        return value;
    } else if ((0, _utils.isModulePath)(value)) {
        const requiredOption = (0, _utils.requireLocalFileOrNodeModule)(value);

        if ((0, _utils.isFunction)(requiredOption) || (0, _utils.isString)(requiredOption) || (0, _utils.isRegExp)(requiredOption)) {
            return requiredOption;
        }

        throw new Error(`Configuration file for 'ignore' is not exporting a string nor a function`);
    } else if ((0, _utils.isString)(value)) {
        return value;
    } else {
        throw new Error(`Configuration 'ignore' is not a function, string, RegExp nor valid path to module`);
    }
}