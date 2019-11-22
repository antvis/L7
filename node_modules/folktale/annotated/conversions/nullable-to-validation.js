'use strict';

var __metamagical_withMeta = function metamagical_withMeta(object, meta) {
  var parent = Object.getPrototypeOf(object);var oldMeta = object[Symbol.for('@@meta:magical')] || {};if (parent && parent[Symbol.for('@@meta:magical')] === oldMeta) {
    oldMeta = {};
  }Object.keys(meta).forEach(function (key) {
    if (/^~/.test(key)) {
      oldMeta[key.slice(1)] = meta[key];
    } else {
      oldMeta[key] = meta[key];
    }
  });object[Symbol.for('@@meta:magical')] = oldMeta;return object;
};

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var _require = require('../validation/validation'),
    Success = _require.Success,
    Failure = _require.Failure;

/*~
 * stability: stable
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall a, b:
 *     (a or None, b) => Validation b a
 */


var nullableToValidation = __metamagical_withMeta(function (a, fallbackValue) {
  return a != null ? Success(a) : /*else*/Failure(fallbackValue);
}, {
  'name': 'nullableToValidation',
  'source': '(a, fallbackValue) =>\n  a != null ?  Success(a)\n  :/*else*/    Failure(fallbackValue)',
  'signature': 'nullableToValidation(a, fallbackValue)',
  'location': {
    'filename': 'source/conversions/nullable-to-validation.js',
    'start': {
      'line': 22,
      'column': 0
    },
    'end': {
      'line': 24,
      'column': 38
    }
  },
  'module': 'folktale/conversions/nullable-to-validation',
  'licence': 'MIT',
  'authors': ['@boris-marinov'],
  'repository': 'https://github.com/origamitower/folktale',
  'npmPackage': 'folktale',
  'copyright': '(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS',
  'maintainers': ['Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)'],
  'stability': 'stable',
  'type': 'forall a, b:\n  (a or None, b) => Validation b a\n'
});

module.exports = nullableToValidation;