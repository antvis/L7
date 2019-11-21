'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = isModulePath;

var _path = require('path');

var _isString = require('./isString');

var _isString2 = _interopRequireDefault(_isString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Is given path a valid file or node module path?
 *
 * @param {String} path
 * @returns {boolean}
 */
function isModulePath(path) {
    if (!(0, _isString2.default)(path) || path === '') {
        return false;
    }

    try {
        require.resolve((0, _path.resolve)(process.cwd(), path));
        return true;
    } catch (e) {
        try {
            require.resolve(path);
            return true;
        } catch (_e) {
            return false;
        }
    }
}