"use strict";

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
 * stability : stable
 * authors:
 *   - Quildreen Motta
 *
 * complexity : O(n), n is the number of own enumerable properties
 * type: |
 *   (Object 'a) => Array (String or Symbol, 'a)
 */
var toPairs = __metamagical_withMeta(function (object) {
  return Object.keys(object).map(function (k) {
    return [k, object[k]];
  });
}, {
  "name": "toPairs",
  "source": "(object) => Object.keys(object).map(k => [k, object[k]])",
  "signature": "toPairs(object)",
  "location": {
    "filename": "source/core/object/to-pairs.js",
    "start": {
      "line": 20,
      "column": 0
    },
    "end": {
      "line": 20,
      "column": 73
    }
  },
  "module": "folktale/core/object/to-pairs",
  "licence": "MIT",
  "authors": ["Quildreen Motta"],
  "repository": "https://github.com/origamitower/folktale",
  "npmPackage": "folktale",
  "copyright": "(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS",
  "maintainers": ["Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)"],
  "stability": "stable",
  "complexity": "O(n), n is the number of own enumerable properties",
  "type": "(Object 'a) => Array (String or Symbol, 'a)\n"
});

// --[ Exports ]-------------------------------------------------------
module.exports = toPairs;