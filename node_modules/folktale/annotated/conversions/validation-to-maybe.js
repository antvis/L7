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
 *     (Validation a b) => Maybe b
 */


var validationToMaybe = __metamagical_withMeta(function (aValidation) {
  return aValidation.matchWith({
    Failure: function Failure() {
      return Nothing();
    },
    Success: function Success(_ref) {
      var value = _ref.value;
      return Just(value);
    }
  });
}, {
  'name': 'validationToMaybe',
  'source': '(aValidation) =>\n  aValidation.matchWith({\n    Failure:  () => Nothing(),\n    Success:  ({ value }) => Just(value)\n  })',
  'signature': 'validationToMaybe(aValidation)',
  'location': {
    'filename': 'source/conversions/validation-to-maybe.js',
    'start': {
      'line': 22,
      'column': 0
    },
    'end': {
      'line': 26,
      'column': 5
    }
  },
  'module': 'folktale/conversions/validation-to-maybe',
  'licence': 'MIT',
  'authors': ['@boris-marinov'],
  'repository': 'https://github.com/origamitower/folktale',
  'npmPackage': 'folktale',
  'copyright': '(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS',
  'maintainers': ['Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)'],
  'stability': 'stable',
  'type': 'forall a, b:\n  (Validation a b) => Maybe b\n'
});

module.exports = validationToMaybe;