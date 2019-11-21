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

var Future = require('./_future');

/*~
 * stability: experimental
 * name: module folktale/concurrency/future
 */
module.exports = __metamagical_withMeta({
  of: Future.of,
  rejected: Future.rejected,
  fromPromise: Future.fromPromise,
  _Deferred: require('./_deferred'),
  _ExecutionState: require('./_execution-state'),
  _Future: Future
}, {
  'name': 'module folktale/concurrency/future',
  'source': '{\n  of: Future.of,\n  rejected: Future.rejected,\n  fromPromise: Future.fromPromise,\n  _Deferred: require(\'./_deferred\'),\n  _ExecutionState: require(\'./_execution-state\'),\n  _Future: Future\n}',
  'location': {
    'filename': 'source/concurrency/future/index.js',
    'start': {
      'line': 16,
      'column': 0
    },
    'end': {
      'line': 23,
      'column': 2
    }
  },
  'module': 'folktale/concurrency/future',
  'licence': 'MIT',
  'authors': ['Quildreen Motta'],
  'repository': 'https://github.com/origamitower/folktale',
  'npmPackage': 'folktale',
  'copyright': '(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS',
  'maintainers': ['Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)'],
  'isModule': true,
  'stability': 'experimental'
});