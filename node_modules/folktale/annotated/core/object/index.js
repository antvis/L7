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
 * name: module folktale/core/object
 */
module.exports = __metamagical_withMeta({
  mapEntries: require('./map-entries'),
  mapValues: require('./map-values'),
  values: require('./values'),
  toPairs: require('./to-pairs'),
  fromPairs: require('./from-pairs')
}, {
  'name': 'module folktale/core/object',
  'source': '{\n  mapEntries: require(\'./map-entries\'),\n  mapValues: require(\'./map-values\'),\n  values: require(\'./values\'),\n  toPairs: require(\'./to-pairs\'),\n  fromPairs: require(\'./from-pairs\')\n}',
  'location': {
    'filename': 'source/core/object/index.js',
    'start': {
      'line': 14,
      'column': 0
    },
    'end': {
      'line': 20,
      'column': 2
    }
  },
  'module': 'folktale/core/object',
  'licence': 'MIT',
  'authors': ['Quildreen Motta'],
  'repository': 'https://github.com/origamitower/folktale',
  'npmPackage': 'folktale',
  'copyright': '(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS',
  'maintainers': ['Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)'],
  'isModule': true,
  'stability': 'stable'
});