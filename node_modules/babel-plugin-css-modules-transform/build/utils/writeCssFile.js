'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = writeCssFile;

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _path = require('path');

var _fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Writes css file to given path (and creates directories)
 *
 * @param {String} path
 * @param {String} content
 * @param {Boolean} append
 */
function writeCssFile(path, content, append = false) {
    _mkdirp2.default.sync((0, _path.dirname)(path));

    if (append) {
        (0, _fs.appendFileSync)(path, content);
    } else {
        (0, _fs.writeFileSync)(path, content);
    }
}