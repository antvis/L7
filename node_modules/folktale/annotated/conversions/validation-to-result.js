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

var _require = require('../result/result'),
    Error = _require.Error,
    Ok = _require.Ok;

/*~
 * stability: stable
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall a, b:
 *      (Validation a b) => Result a b
 */


var validationToResult = __metamagical_withMeta(function (aValidation) {
  return aValidation.matchWith({
    Failure: function Failure(_ref) {
      var value = _ref.value;
      return Error(value);
    },
    Success: function Success(_ref2) {
      var value = _ref2.value;
      return Ok(value);
    }
  });
}, {
  'name': 'validationToResult',
  'source': '(aValidation) =>\n  aValidation.matchWith({\n    Failure: ({ value }) => Error(value),\n    Success: ({ value }) => Ok(value)\n  })',
  'signature': 'validationToResult(aValidation)',
  'location': {
    'filename': 'source/conversions/validation-to-result.js',
    'start': {
      'line': 22,
      'column': 0
    },
    'end': {
      'line': 26,
      'column': 5
    }
  },
  'module': 'folktale/conversions/validation-to-result',
  'licence': 'MIT',
  'authors': ['@boris-marinov'],
  'repository': 'https://github.com/origamitower/folktale',
  'npmPackage': 'folktale',
  'copyright': '(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS',
  'maintainers': ['Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)'],
  'stability': 'stable',
  'type': 'forall a, b:\n   (Validation a b) => Result a b\n'
});

module.exports = validationToResult;