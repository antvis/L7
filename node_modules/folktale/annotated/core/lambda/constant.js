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
 * stability: stable
 * authors:
 *   - Quildreen Motta
 *
 * type: |
 *   ('a) => ('b) => 'a
 */
var constant = __metamagical_withMeta(function (value) {
  return function (_) {
    return value;
  };
}, {
  "name": "constant",
  "source": "(value) => (_) => value",
  "signature": "constant(value)",
  "location": {
    "filename": "source/core/lambda/constant.js",
    "start": {
      "line": 18,
      "column": 0
    },
    "end": {
      "line": 18,
      "column": 41
    }
  },
  "module": "folktale/core/lambda/constant",
  "licence": "MIT",
  "authors": ["Quildreen Motta"],
  "repository": "https://github.com/origamitower/folktale",
  "npmPackage": "folktale",
  "copyright": "(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS",
  "maintainers": ["Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)"],
  "stability": "stable",
  "type": "('a) => ('b) => 'a\n"
});

// --[ Exports ]-------------------------------------------------------
module.exports = constant;