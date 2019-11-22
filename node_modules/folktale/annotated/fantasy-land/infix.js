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
 * name: module folktale/fantasy-land/infix
 */
module.exports = __metamagical_withMeta({
  apply: require('./apply').infix,
  bimap: require('./bimap').infix,
  chain: require('./chain').infix,
  concat: require('./concat').infix,
  empty: require('./empty').infix,
  equals: require('./equals').infix,
  map: require('./map').infix,
  of: require('./of').infix
}, {
  'name': 'module folktale/fantasy-land/infix',
  'source': '{\n  apply: require(\'./apply\').infix,\n  bimap: require(\'./bimap\').infix,\n  chain: require(\'./chain\').infix,\n  concat: require(\'./concat\').infix,\n  empty: require(\'./empty\').infix,\n  equals: require(\'./equals\').infix,\n  map: require(\'./map\').infix,\n  of: require(\'./of\').infix\n}',
  'location': {
    'filename': 'source/fantasy-land/infix.js',
    'start': {
      'line': 15,
      'column': 0
    },
    'end': {
      'line': 24,
      'column': 2
    }
  },
  'module': 'folktale/fantasy-land/infix',
  'licence': 'MIT',
  'authors': ['Quildreen Motta'],
  'repository': 'https://github.com/origamitower/folktale',
  'npmPackage': 'folktale',
  'copyright': '(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS',
  'maintainers': ['Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)'],
  'isModule': true,
  'stability': 'experimental'
});