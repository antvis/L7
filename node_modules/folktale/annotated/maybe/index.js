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
},
    _metamagical_withMet,
    _metamagical_withMet2;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------


var Maybe = require('./maybe');
var _require = require('../adt/union/union'),
    typeSymbol = _require.typeSymbol;

/*~
 * stability: stable
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * name: module folktale/maybe
 */


module.exports = __metamagical_withMeta((_metamagical_withMet = (_metamagical_withMet2 = {
  Just: Maybe.Just,
  Nothing: Maybe.Nothing,
  hasInstance: Maybe.hasInstance,
  of: Maybe.of,
  empty: Maybe.empty,
  fromJSON: Maybe.fromJSON
}, _defineProperty(_metamagical_withMet2, typeSymbol, Maybe[typeSymbol]), _defineProperty(_metamagical_withMet2, 'fantasy-land/of', Maybe['fantasy-land/of']), _defineProperty(_metamagical_withMet2, 'fromNullable', function fromNullable(aNullable) {
  return require('../conversions/nullable-to-maybe')(aNullable);
}), _defineProperty(_metamagical_withMet2, 'fromResult', function fromResult(aResult) {
  return require('../conversions/result-to-maybe')(aResult);
}), _defineProperty(_metamagical_withMet2, 'fromValidation', function fromValidation(aValidation) {
  return require('../conversions/validation-to-maybe')(aValidation);
}), _metamagical_withMet2), __metamagical_withMeta(_metamagical_withMet['fromNullable'], {
  'name': 'fromNullable',
  'source': 'fromNullable(aNullable) {\n    return require(\'folktale/conversions/nullable-to-maybe\')(aNullable);\n  }',
  'signature': 'fromNullable(aNullable)',
  'location': {
    'filename': 'source/maybe/index.js',
    'start': {
      'line': 23,
      'column': 17
    },
    'end': {
      'line': 59,
      'column': 1
    }
  },
  'module': 'folktale/maybe',
  'licence': 'MIT',
  'authors': ['Quildreen Motta'],
  'repository': 'https://github.com/origamitower/folktale',
  'npmPackage': 'folktale',
  'copyright': '(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS',
  'maintainers': ['Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)'],
  'stability': 'stable',
  'type': 'forall a: (a or void) => Maybe a\n \n'
}), __metamagical_withMeta(_metamagical_withMet['fromResult'], {
  'name': 'fromResult',
  'source': 'fromResult(aResult) {\n    return require(\'folktale/conversions/result-to-maybe\')(aResult);\n  }',
  'signature': 'fromResult(aResult)',
  'location': {
    'filename': 'source/maybe/index.js',
    'start': {
      'line': 23,
      'column': 17
    },
    'end': {
      'line': 59,
      'column': 1
    }
  },
  'module': 'folktale/maybe',
  'licence': 'MIT',
  'authors': ['Quildreen Motta'],
  'repository': 'https://github.com/origamitower/folktale',
  'npmPackage': 'folktale',
  'copyright': '(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS',
  'maintainers': ['Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)'],
  'stability': 'stable',
  'type': 'forall a, b: (Result a b) => Maybe b\n \n'
}), __metamagical_withMeta(_metamagical_withMet['fromValidation'], {
  'name': 'fromValidation',
  'source': 'fromValidation(aValidation) {\n    return require(\'folktale/conversions/validation-to-maybe\')(aValidation);\n  }',
  'signature': 'fromValidation(aValidation)',
  'location': {
    'filename': 'source/maybe/index.js',
    'start': {
      'line': 23,
      'column': 17
    },
    'end': {
      'line': 59,
      'column': 1
    }
  },
  'module': 'folktale/maybe',
  'licence': 'MIT',
  'authors': ['Quildreen Motta'],
  'repository': 'https://github.com/origamitower/folktale',
  'npmPackage': 'folktale',
  'copyright': '(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS',
  'maintainers': ['Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)'],
  'stability': 'stable',
  'type': 'forall a, b: (Validation a b) => Maybe b\n \n'
}), _metamagical_withMet), {
  'name': 'module folktale/maybe',
  'source': '{\n  Just: Maybe.Just,\n  Nothing: Maybe.Nothing,\n  hasInstance: Maybe.hasInstance,\n  of: Maybe.of,\n  empty: Maybe.empty,\n  fromJSON: Maybe.fromJSON,\n  [typeSymbol]: Maybe[typeSymbol],\n  [\'fantasy-land/of\']: Maybe[\'fantasy-land/of\'],\n\n  /*~\n   * stability: stable\n   * type: |\n   *   forall a: (a or void) => Maybe a\n   */\n  fromNullable(aNullable) {\n    return require(\'folktale/conversions/nullable-to-maybe\')(aNullable);\n  },\n\n  /*~\n   * stability: stable\n   * type: |\n   *   forall a, b: (Result a b) => Maybe b\n   */\n  fromResult(aResult) {\n    return require(\'folktale/conversions/result-to-maybe\')(aResult);\n  },\n\n  /*~\n   * stability: stable\n   * type: |\n   *   forall a, b: (Validation a b) => Maybe b\n   */\n  fromValidation(aValidation) {\n    return require(\'folktale/conversions/validation-to-maybe\')(aValidation);\n  }\n}',
  'location': {
    'filename': 'source/maybe/index.js',
    'start': {
      'line': 23,
      'column': 0
    },
    'end': {
      'line': 59,
      'column': 2
    }
  },
  'module': 'folktale/maybe',
  'licence': 'MIT',
  'authors': ['@boris-marinov', 'Quildreen Motta'],
  'repository': 'https://github.com/origamitower/folktale',
  'npmPackage': 'folktale',
  'copyright': '(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS',
  'maintainers': ['Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)'],
  'isModule': true,
  'stability': 'stable'
});