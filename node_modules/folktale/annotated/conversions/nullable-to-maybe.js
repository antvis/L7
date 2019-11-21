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

var _require = require('../maybe/maybe'),
    Nothing = _require.Nothing,
    Just = _require.Just;

/*~
 * stability: stable
 * authors:
 *   - Quildreen Motta
 * 
 * type: |
 *   forall a:
 *     (a or None) => Maybe a
 */


var nullableToMaybe = __metamagical_withMeta(function (a) {
  return a != null ? Just(a) : /*else*/Nothing();
}, {
  'name': 'nullableToMaybe',
  'source': '(a) =>\n  a != null ? Just(a)\n  :/*else*/   Nothing()',
  'signature': 'nullableToMaybe(a)',
  'location': {
    'filename': 'source/conversions/nullable-to-maybe.js',
    'start': {
      'line': 22,
      'column': 0
    },
    'end': {
      'line': 24,
      'column': 24
    }
  },
  'module': 'folktale/conversions/nullable-to-maybe',
  'licence': 'MIT',
  'authors': ['Quildreen Motta'],
  'repository': 'https://github.com/origamitower/folktale',
  'npmPackage': 'folktale',
  'copyright': '(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS',
  'maintainers': ['Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)'],
  'stability': 'stable',
  'type': 'forall a:\n  (a or None) => Maybe a\n'
});

module.exports = nullableToMaybe;