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

var define = Object.defineProperty;

/*~
 * stability: stable
 * authors:
 *   - Quildreen Motta
 *
 * complexity : O(n), n is the length of the array
 * type: |
 *   (Array (String or Symbol, 'a)) => Object 'a
 */
var fromPairs = __metamagical_withMeta(function (pairs) {
  return pairs.reduce(function (r, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        k = _ref2[0],
        v = _ref2[1];

    return define(r, k, { value: v,
      writable: true,
      enumerable: true,
      configurable: true
    });
  }, {});
}, {
  "name": "fromPairs",
  "source": "(pairs) =>\n        pairs.reduce((r, [k, v]) => define(r, k, { value: v,\n                                                   writable: true,\n                                                   enumerable: true,\n                                                   configurable: true\n                                                  }),\n                     {})",
  "signature": "fromPairs(pairs)",
  "location": {
    "filename": "source/core/object/from-pairs.js",
    "start": {
      "line": 22,
      "column": 0
    },
    "end": {
      "line": 28,
      "column": 25
    }
  },
  "module": "folktale/core/object/from-pairs",
  "licence": "MIT",
  "authors": ["Quildreen Motta"],
  "repository": "https://github.com/origamitower/folktale",
  "npmPackage": "folktale",
  "copyright": "(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS",
  "maintainers": ["Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)"],
  "stability": "stable",
  "complexity": "O(n), n is the length of the array",
  "type": "(Array (String or Symbol, 'a)) => Object 'a\n"
});

// --[ Exports ]-------------------------------------------------------
module.exports = fromPairs;