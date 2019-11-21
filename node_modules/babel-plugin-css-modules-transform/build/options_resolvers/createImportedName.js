'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createImportedName;

var _utils = require('../utils');

/**
 * Resolves createImportedName css-modules-require-hook option
 *
 * @param {String|Function} value
 * @returns {Function}
 */
function createImportedName(value /* , currentConfig */) {
    if ((0, _utils.isFunction)(value)) {
        return value;
    } else if ((0, _utils.isModulePath)(value)) {
        const requiredOption = (0, _utils.requireLocalFileOrNodeModule)(value);

        if (!(0, _utils.isFunction)(requiredOption)) {
            throw new Error(`Configuration file for 'createImportedName' is not exporting a function`);
        }

        return requiredOption;
    }

    throw new Error(`Configuration 'createImportedName' is not a function nor a valid module path`);
}