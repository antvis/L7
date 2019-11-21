'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = prepend;

var _utils = require('../utils');

/**
 * Resolves prepend option for css-modules-require-hook
 *
 * @param {*} value
 * @returns {Function}
 */
function prepend(value /* , currentConfig */) {
    if (Array.isArray(value)) {
        return value.map((option, index) => {
            if ((0, _utils.isFunction)(option)) {
                return option();
            } else if ((0, _utils.isModulePath)(option)) {
                const requiredOption = (0, _utils.requireLocalFileOrNodeModule)(option);

                if (!(0, _utils.isFunction)(requiredOption)) {
                    throw new Error(`Configuration 'prepend[${index}]' module is not exporting a function`);
                }

                return requiredOption();
            }

            throw new Error(`Configuration 'prepend[${index}]' is not a function or a valid module path`);
        });
    }

    throw new Error(`Configuration 'prepend' is not an array`);
}