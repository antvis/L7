"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

var hasOwnProperty = Object.prototype.hasOwnProperty;

/*~
 * stability: stable
 * authors:
 *   - Quildreen Motta
 *
 * complexity : O(n), n is the number of own enumerable properties
 * type: |
 *   (
 *     object    : Object 'a,
 *     transform : ((String, 'a)) => (String, 'b),
 *     define    : (('x : Object 'b), String, 'b) => Object 'b :: mutates 'x
 *   ) => Object 'b
 */
var mapEntries = __metamagical_withMeta(function (object, transform, define) {
  return Object.keys(object).reduce(function (result, key) {
    var _transform = transform([key, object[key]]),
        _transform2 = _slicedToArray(_transform, 2),
        newKey = _transform2[0],
        newValue = _transform2[1];

    return define(result, newKey, newValue);
  }, {});
}, {
  "name": "mapEntries",
  "source": "(object, transform, define) =>\n        Object.keys(object).reduce((result, key) => {\n          const [newKey, newValue] = transform([key, object[key]]);\n          return define(result, newKey, newValue);\n        }, {})",
  "signature": "mapEntries(object, transform, define)",
  "location": {
    "filename": "source/core/object/map-entries.js",
    "start": {
      "line": 25,
      "column": 0
    },
    "end": {
      "line": 29,
      "column": 15
    }
  },
  "module": "folktale/core/object/map-entries",
  "licence": "MIT",
  "authors": ["Quildreen Motta"],
  "repository": "https://github.com/origamitower/folktale",
  "npmPackage": "folktale",
  "copyright": "(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS",
  "maintainers": ["Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)"],
  "stability": "stable",
  "complexity": "O(n), n is the number of own enumerable properties",
  "type": "(\n  object    : Object 'a,\n  transform : ((String, 'a)) => (String, 'b),\n  define    : (('x : Object 'b), String, 'b) => Object 'b :: mutates 'x\n) => Object 'b\n"
});

// --[ Convenience ]---------------------------------------------------
/*~
 * stability: stable
 * authors:
 *   - Quildreen Motta
 *
 * complexity : O(n), n is the number of own enumerable properties
 * type: |
 *   (Object 'a, ((String, 'a)) => (String, 'b)) => Object 'b
 */
mapEntries.overwrite = __metamagical_withMeta(function (object, transform) {
  return mapEntries(object, transform, function (result, key, value) {
    result[key] = value;
    return result;
  });
}, {
  "name": "overwrite",
  "source": "(object, transform) =>\n  mapEntries(object, transform, (result, key, value) => {\n    result[key] = value;\n    return result;\n  })",
  "signature": "overwrite(object, transform)",
  "belongsTo": function belongsTo() {
    return mapEntries;
  },
  "stability": "stable",
  "authors": ["Quildreen Motta"],
  "complexity": "O(n), n is the number of own enumerable properties",
  "type": "(Object 'a, ((String, 'a)) => (String, 'b)) => Object 'b\n"
});

/*~
 * stability: stable
 * authors:
 *   - Quildreen Motta
 *
 * throws:
 *   Error: when the transform returns duplicate property names.
 *
 * complexity : O(n), n is the number of own enumerable properties
 * type: |
 *   (Object 'a, ((String, 'a)) => (String, 'b)) => Object 'b :: throws Error
 */
mapEntries.unique = __metamagical_withMeta(function (object, transform) {
  return mapEntries(object, transform, function (result, key, value) {
    if (hasOwnProperty.call(result, key)) {
      throw new Error("The property " + key + " already exists in the resulting object.");
    }
    result[key] = value;
    return result;
  });
}, {
  "name": "unique",
  "source": "(object, transform) =>\n  mapEntries(object, transform, (result, key, value) => {\n    if (result::hasOwnProperty(key)) {\n      throw new Error(`The property ${key} already exists in the resulting object.`);\n    }\n    result[key] = value;\n    return result;\n  })",
  "signature": "unique(object, transform)",
  "belongsTo": function belongsTo() {
    return mapEntries;
  },
  "stability": "stable",
  "authors": ["Quildreen Motta"],
  "throws": {
    "Error": "when the transform returns duplicate property names."
  },
  "complexity": "O(n), n is the number of own enumerable properties",
  "type": "(Object 'a, ((String, 'a)) => (String, 'b)) => Object 'b :: throws Error\n"
});

// --[ Exports ]-------------------------------------------------------
module.exports = mapEntries;