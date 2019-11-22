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

var Task = require('./_task');

var noop = function noop() {};

/*~
 * stability: experimental
 * type: |
 *   forall value, reason:
 *     (
 *       ({
 *          resolve: (value) => Void,
 *          reject: (reason) => Void,
 *          cancel: () => Void,
 *          cleanup: (() => Void) => Void,
 *          onCancelled: (() => Void) => Void,
 *          get isCancelled: Boolean
 *        }) => Void
 *     ) => Task reason value
 */
var task = __metamagical_withMeta(function (computation) {
  return new Task(computation);
}, {
  'name': 'task',
  'source': '(computation) =>\n  new Task(computation)',
  'signature': 'task(computation)',
  'location': {
    'filename': 'source/concurrency/task/task.js',
    'start': {
      'line': 29,
      'column': 0
    },
    'end': {
      'line': 30,
      'column': 24
    }
  },
  'module': 'folktale/concurrency/task/task',
  'licence': 'MIT',
  'authors': ['Quildreen Motta'],
  'repository': 'https://github.com/origamitower/folktale',
  'npmPackage': 'folktale',
  'copyright': '(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS',
  'maintainers': ['Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)'],
  'stability': 'experimental',
  'type': 'forall value, reason:\n  (\n    ({\n       resolve: (value) => Void,\n       reject: (reason) => Void,\n       cancel: () => Void,\n       cleanup: (() => Void) => Void,\n       onCancelled: (() => Void) => Void,\n       get isCancelled: Boolean\n     }) => Void\n  ) => Task reason value\n'
});

module.exports = task;