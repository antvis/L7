'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = rootDir;

var _path = require('path');

var _fs = require('fs');

var _utils = require('../utils');

/**
 * Resolves rootDir option for css-modules-require-hook
 *
 * @param {*} value
 * @returns {String}
 */
function rootDir(value /* , currentConfig */) {
    if (!(0, _utils.isString)(value)) {
        throw new Error(`Configuration 'rootDir' is not a string`);
    }

    if (!(0, _path.isAbsolute)(value) || !(0, _fs.statSync)(value).isDirectory()) {
        throw new Error(`Configuration 'rootDir' is not containing a valid absolute path`);
    }

    return value;
}