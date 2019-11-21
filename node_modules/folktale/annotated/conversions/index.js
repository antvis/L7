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

/*~
 * stability: stable
 * name: module folktale/conversions
 */
module.exports = __metamagical_withMeta({
  resultToValidation: require('./result-to-validation'), resultToMaybe: require('./result-to-maybe'),
  validationToResult: require('./validation-to-result'),
  validationToMaybe: require('./validation-to-maybe'),
  maybeToValidation: require('./maybe-to-validation'),
  maybeToResult: require('./maybe-to-result'),
  nullableToValidation: require('./nullable-to-validation'),
  nullableToResult: require('./nullable-to-result'),
  nullableToMaybe: require('./nullable-to-maybe'),
  nodebackToTask: require('./nodeback-to-task'),
  futureToPromise: require('./future-to-promise'),
  promiseToFuture: require('./promise-to-future'),
  promisedToTask: require('./promised-to-task')
}, {
  'name': 'module folktale/conversions',
  'source': '{\n  resultToValidation: require(\'./result-to-validation\'),\n  resultToMaybe: require(\'./result-to-maybe\'),\n  validationToResult: require(\'./validation-to-result\'),\n  validationToMaybe: require(\'./validation-to-maybe\'),\n  maybeToValidation: require(\'./maybe-to-validation\'),\n  maybeToResult: require(\'./maybe-to-result\'),\n  nullableToValidation: require(\'./nullable-to-validation\'),\n  nullableToResult: require(\'./nullable-to-result\'),\n  nullableToMaybe: require(\'./nullable-to-maybe\'),\n  nodebackToTask: require(\'./nodeback-to-task\'),\n  futureToPromise: require(\'./future-to-promise\'),\n  promiseToFuture: require(\'./promise-to-future\'),\n  promisedToTask: require(\'./promised-to-task\')\n}',
  'location': {
    'filename': 'source/conversions/index.js',
    'start': {
      'line': 14,
      'column': 0
    },
    'end': {
      'line': 28,
      'column': 2
    }
  },
  'module': 'folktale/conversions',
  'licence': 'MIT',
  'authors': ['Quildreen Motta'],
  'repository': 'https://github.com/origamitower/folktale',
  'npmPackage': 'folktale',
  'copyright': '(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS',
  'maintainers': ['Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)'],
  'isModule': true,
  'stability': 'stable'
});