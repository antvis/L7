"use strict";

exports.__esModule = true;
exports["default"] = _default;

/**
 * Check if a string ends with something
 * @private
 */
function _default(string, suffix) {
  return string.substr(-suffix.length) === suffix;
}

module.exports = exports.default;