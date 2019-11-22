'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = resolve;

var _path = require('path');

var _fs = require('fs');

var _utils = require('../utils');

/**
 * Resolves resolve option for css-modules-require-hook
 *
 * @param {*} value
 * @returns {Object}
 */
function resolve(value /* , currentConfig */) {
    if (!(0, _utils.isPlainObject)(value)) {
        throw new Error(`Configuration 'resolve' is not an object`);
    }

    if ('alias' in value && !(0, _utils.isPlainObject)(value.alias)) {
        throw new Error(`Configuration 'resolve.alias' is not an object`);
    }

    if ('extensions' in value) {
        if (!Array.isArray(value.extensions)) {
            throw new Error(`Configuration 'resolve.extensions' is not an array`);
        }

        value.extensions.map((option, index) => {
            if (!(0, _utils.isString)(option)) {
                throw new Error(`Configuration 'resolve.extensions[${index}]' is not a string`);
            }
        });
    }

    if ('modules' in value) {
        if (!Array.isArray(value.modules)) {
            throw new Error(`Configuration 'resolve.modules' is not an array`);
        }

        value.modules.map((option, index) => {
            if (!(0, _path.isAbsolute)(option) || !(0, _fs.statSync)(option).isDirectory()) {
                throw new Error(`Configuration 'resolve.modules[${index}]' is not containing a valid absolute path`);
            }
        });
    }

    if ('mainFile' in value && !(0, _utils.isString)(value.mainFile)) {
        throw new Error(`Configuration 'resolve.mainFile' is not a string`);
    }

    if ('preserveSymlinks' in value && !(0, _utils.isBoolean)(value.preserveSymlinks)) {
        throw new Error(`Configuration 'resolve.preserveSymlinks' is not a boolean`);
    }

    return value;
}