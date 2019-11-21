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
 * type: |
 *   forall v, e: ([Task e v Any]) => Task e v Any
 */
var waitAny = __metamagical_withMeta(function (tasks) {
  if (tasks.length === 0) {
    throw new Error('Task.waitAny() requires a non-empty array of tasks.');
  }

  return tasks.reduce(function (a, b) {
    return a.or(b);
  });
}, {
  'name': 'waitAny',
  'source': '(tasks) => {\n  if (tasks.length === 0) {\n    throw new Error(\'Task.waitAny() requires a non-empty array of tasks.\');\n  }\n\n  return tasks.reduce((a, b) => a.or(b));\n}',
  'signature': 'waitAny(tasks)',
  'location': {
    'filename': 'source/concurrency/task/wait-any.js',
    'start': {
      'line': 16,
      'column': 0
    },
    'end': {
      'line': 22,
      'column': 2
    }
  },
  'module': 'folktale/concurrency/task/wait-any',
  'licence': 'MIT',
  'authors': ['Quildreen Motta'],
  'repository': 'https://github.com/origamitower/folktale',
  'npmPackage': 'folktale',
  'copyright': '(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS',
  'maintainers': ['Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)'],
  'stability': 'experimental',
  'type': 'forall v, e: ([Task e v Any]) => Task e v Any\n'
});

module.exports = waitAny;