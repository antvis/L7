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
 * name: module folktale
 */
module.exports = __metamagical_withMeta({
  adt: require('./adt'),
  concurrency: require('./concurrency'),
  conversions: require('./conversions'),
  core: require('./core'),
  fantasyLand: require('./fantasy-land'),
  maybe: require('./maybe'),
  result: require('./result'),
  validation: require('./validation')
}, {
  'name': 'module folktale',
  'source': '{\n  adt: require(\'./adt\'),\n  concurrency: require(\'./concurrency\'),\n  conversions: require(\'./conversions\'),\n  core: require(\'./core\'),\n  fantasyLand: require(\'./fantasy-land\'),\n  maybe: require(\'./maybe\'),\n  result: require(\'./result\'),\n  validation: require(\'./validation\')\n}',
  'location': {
    'filename': 'source/index.js',
    'start': {
      'line': 14,
      'column': 0
    },
    'end': {
      'line': 23,
      'column': 2
    }
  },
  'module': 'folktale',
  'licence': 'MIT',
  'authors': ['Quildreen Motta'],
  'repository': 'https://github.com/origamitower/folktale',
  'npmPackage': 'folktale',
  'copyright': '(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS',
  'maintainers': ['Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)'],
  'isModule': true,
  'stability': 'stable'
});