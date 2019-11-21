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
    Just = _require.Just,
    Nothing = _require.Nothing;

/*~
 * stability: stable
 * authors:
 *   - "@boris-marinov"
 *
 * type: |
 *   forall a, b:
 *     (Result a b) => Maybe b
 */


var resultToMaybe = __metamagical_withMeta(function (aResult) {
  return aResult.matchWith({
    Error: function Error(_ref) {
      var _ = _ref.value;
      return Nothing();
    },
    Ok: function Ok(_ref2) {
      var value = _ref2.value;
      return Just(value);
    }
  });
}, {
  'name': 'resultToMaybe',
  'source': '(aResult) =>\n  aResult.matchWith({\n    Error: ({ value: _ }) => Nothing(),\n    Ok: ({ value }) => Just(value)\n  })',
  'signature': 'resultToMaybe(aResult)',
  'location': {
    'filename': 'source/conversions/result-to-maybe.js',
    'start': {
      'line': 22,
      'column': 0
    },
    'end': {
      'line': 26,
      'column': 5
    }
  },
  'module': 'folktale/conversions/result-to-maybe',
  'licence': 'MIT',
  'authors': ['@boris-marinov'],
  'repository': 'https://github.com/origamitower/folktale',
  'npmPackage': 'folktale',
  'copyright': '(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS',
  'maintainers': ['Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)'],
  'stability': 'stable',
  'type': 'forall a, b:\n  (Result a b) => Maybe b\n'
});

module.exports = resultToMaybe;