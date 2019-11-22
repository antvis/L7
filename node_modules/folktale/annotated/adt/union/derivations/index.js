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
 * stability: experimental
 * name: module folktale/adt/union/derivations
 */
module.exports = __metamagical_withMeta({
  serialization: require('./serialization'),
  equality: require('./equality'),
  debugRepresentation: require('./debug-representation')
}, {
  'name': 'module folktale/adt/union/derivations',
  'source': '{\n  serialization: require(\'./serialization\'),\n  equality: require(\'./equality\'),\n  debugRepresentation: require(\'./debug-representation\')\n}',
  'location': {
    'filename': 'source/adt/union/derivations/index.js',
    'start': {
      'line': 14,
      'column': 0
    },
    'end': {
      'line': 18,
      'column': 2
    }
  },
  'module': 'folktale/adt/union/derivations',
  'licence': 'MIT',
  'authors': ['Quildreen Motta'],
  'repository': 'https://github.com/origamitower/folktale',
  'npmPackage': 'folktale',
  'copyright': '(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS',
  'maintainers': ['Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)'],
  'isModule': true,
  'stability': 'experimental'
});