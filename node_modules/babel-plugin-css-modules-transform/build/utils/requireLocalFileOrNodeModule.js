'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = requireLocalFileOrNodeModule;

var _path = require('path');

/**
 * Require local file or node modules
 *
 * @param {String} path
 * @returns {*}
 */
function requireLocalFileOrNodeModule(path) {
    const localFile = (0, _path.resolve)(process.cwd(), path);

    try {
        // first try to require local file
        return require(localFile);
    } catch (e) {
        if (e.code === 'MODULE_NOT_FOUND') {
            // try to require node_module
            return require(path);
        }

        throw e;
    }
}