'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assertValidName = assertValidName;
exports.formatWarning = formatWarning;
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

var NAME_RX = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
var ERROR_PREFIX_RX = /^Error: /;

// Silences warnings if an environment flag is enabled
var noNameWarning = Boolean(process && process.env && process.env.GRAPHQL_NO_NAME_WARNING);

// Ensures console warnings are only issued once.
var hasWarnedAboutDunder = false;

/**
 * Upholds the spec rules about naming.
 */
function assertValidName(name, isIntrospection) {
  if (!name || typeof name !== 'string') {
    throw new Error('Must be named. Unexpected name: ' + name + '.');
  }
  if (!isIntrospection && !hasWarnedAboutDunder && !noNameWarning && name.slice(0, 2) === '__') {
    hasWarnedAboutDunder = true;
    /* eslint-disable no-console */
    if (console && console.warn) {
      var error = new Error('Name "' + name + '" must not begin with "__", which is reserved by ' + 'GraphQL introspection. In a future release of graphql this will ' + 'become a hard error.');
      console.warn(formatWarning(error));
    }
    /* eslint-enable no-console */
  }
  if (!NAME_RX.test(name)) {
    throw new Error('Names must match /^[_a-zA-Z][_a-zA-Z0-9]*$/ but "' + name + '" does not.');
  }
}

/**
 * Returns a human-readable warning based an the supplied Error object,
 * including stack trace information if available.
 */
function formatWarning(error) {
  var formatted = '';
  var errorString = String(error).replace(ERROR_PREFIX_RX, '');
  var stack = error.stack;
  if (stack) {
    formatted = stack.replace(ERROR_PREFIX_RX, '');
  }
  if (formatted.indexOf(errorString) === -1) {
    formatted = errorString + '\n' + formatted;
  }
  return formatted.trim();
}