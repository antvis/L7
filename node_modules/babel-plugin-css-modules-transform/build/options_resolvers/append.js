'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = append;

var _utils = require('../utils');

/**
 * Resolves append option for css-modules-require-hook
 *
 * @param {*} value
 * @returns {Function}
 */
function append(value /* , currentConfig */) {
    if (Array.isArray(value)) {
        return value.map((option, index) => {
            if ((0, _utils.isFunction)(option)) {
                return option();
            } else if ((0, _utils.isModulePath)(option)) {
                const requiredOption = (0, _utils.requireLocalFileOrNodeModule)(option);

                if (!(0, _utils.isFunction)(requiredOption)) {
                    throw new Error(`Configuration 'append[${index}]' module is not exporting a function`);
                }

                return requiredOption();
            }

            throw new Error(`Configuration 'append[${index}]' is not a function or a valid module path`);
        });
    }

    throw new Error(`Configuration 'append' is not an array`);
}