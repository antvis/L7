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
  });
  object[Symbol.for('@@meta:magical')] = oldMeta;
  return object;
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
 * stability: experimental
 * name: module folktale/concurrency
 */module.exports = __metamagical_withMeta({
  future: require('./future'), task: require('./task')
}, {
  'name': 'module folktale/concurrency',
  'source': '{\n  future: require(\'./future\'),\n  task: require(\'./task\')\n}',
  'location': {
    'filename': 'source/concurrency/index.js',
    'start': {
      'line': 15,
      'column': 0
    },
    'end': {
      'line': 18,
      'column': 2
    }
  },
  'module': 'folktale/concurrency',
  'licence': 'MIT',
  'authors': ['Quildreen Motta'],
  'repository': 'https://github.com/origamitower/folktale',
  'npmPackage': 'folktale',
  'copyright': '(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS',
  'maintainers': ['Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)'],
  'isModule': true,
  'stability': 'experimental'
});