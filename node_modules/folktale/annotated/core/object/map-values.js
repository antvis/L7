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
 * complexity: O(n), n is the number of own enumerable properties.
 * type: |
 *   (Object 'a, ('a) => 'b) => Object 'b
 */
var mapValues = __metamagical_withMeta(function (object, transformation) {
  var keys = Object.keys(object);
  var result = {};

  for (var i = 0; i < keys.length; ++i) {
    var key = keys[i];
    result[key] = transformation(object[key]);
  }

  return result;
}, {
  "name": "mapValues",
  "source": "(object, transformation) => {\n  const keys = Object.keys(object);\n  const result = {};\n\n  for (let i = 0; i < keys.length; ++i) {\n    const key = keys[i];\n    result[key] = transformation(object[key]);\n  }\n\n  return result;\n}",
  "signature": "mapValues(object, transformation)",
  "location": {
    "filename": "source/core/object/map-values.js",
    "start": {
      "line": 19,
      "column": 0
    },
    "end": {
      "line": 29,
      "column": 2
    }
  },
  "module": "folktale/core/object/map-values",
  "licence": "MIT",
  "authors": ["Quildreen Motta"],
  "repository": "https://github.com/origamitower/folktale",
  "npmPackage": "folktale",
  "copyright": "(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS",
  "maintainers": ["Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)"],
  "stability": "stable",
  "complexity": "O(n), n is the number of own enumerable properties.",
  "type": "(Object 'a, ('a) => 'b) => Object 'b\n"
});

// --[ Convenience ]---------------------------------------------------

/*~
 * stability: stable
 * authors:
 *   - Quildreen Motta
 * 
 * complexity: O(n), n is the number of own enumerable properties.
 * type: |
 *   (Object 'a) . (('a) => 'b) => Object 'b
 */
mapValues.infix = __metamagical_withMeta(function (transformation) {
  return mapValues(this, transformation);
}, {
  "name": "infix",
  "source": "function(transformation) {\n  return mapValues(this, transformation);\n}",
  "signature": "infix(transformation)",
  "belongsTo": function belongsTo() {
    return mapValues;
  },
  "stability": "stable",
  "authors": ["Quildreen Motta"],
  "complexity": "O(n), n is the number of own enumerable properties.",
  "type": "(Object 'a) . (('a) => 'b) => Object 'b\n"
});

// --[ Exports ]-------------------------------------------------------
module.exports = mapValues;