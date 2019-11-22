"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
const checkForDeprecatedOptions = require('../lib/check-for-deprecated-options');

const generateSWStringSchema = require('./options/generate-sw-string-schema');

const getFileManifestEntries = require('../lib/get-file-manifest-entries');

const populateSWTemplate = require('../lib/populate-sw-template');

const validate = require('./options/validate');
/**
 * This method generates a service worker based on the configuration options
 * provided.
 *
 * @param {Object} config Please refer to the
 * [configuration guide](https://developers.google.com/web/tools/workbox/modules/workbox-build#generateswstring_mode).
 * @return {Promise<{swString: string, warnings: Array<string>}>} A promise that
 * resolves once the service worker template is populated. The `swString`
 * property contains a string representation of the full service worker code.
 * Any non-fatal warning messages will be returned via `warnings`.
 *
 * @memberof module:workbox-build
 */


function generateSWString(_x) {
  return _generateSWString.apply(this, arguments);
}

function _generateSWString() {
  _generateSWString = (0, _asyncToGenerator2.default)(function* (config) {
    // This check needs to be done before validation, since the deprecated options
    // will be renamed.
    const deprecationWarnings = checkForDeprecatedOptions(config);
    const options = validate(config, generateSWStringSchema);

    const _ref = yield getFileManifestEntries(options),
          manifestEntries = _ref.manifestEntries,
          warnings = _ref.warnings;

    const swString = yield populateSWTemplate(Object.assign({
      manifestEntries
    }, options)); // Add in any deprecation warnings.

    warnings.push(...deprecationWarnings);
    return {
      swString,
      warnings
    };
  });
  return _generateSWString.apply(this, arguments);
}

module.exports = generateSWString;