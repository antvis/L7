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
 * signature: compose(f, g)(value)
 * type: |
 *   (('b) => 'c, ('a) => 'b) => (('a) => 'c)
 */
var compose = __metamagical_withMeta(function (f, g) {
  return function (value) {
    return f(g(value));
  };
}, {
  "name": "compose",
  "source": "(f, g) => (value) => f(g(value))",
  "signature": "compose(f, g)(value)",
  "location": {
    "filename": "source/core/lambda/compose.js",
    "start": {
      "line": 19,
      "column": 0
    },
    "end": {
      "line": 19,
      "column": 49
    }
  },
  "module": "folktale/core/lambda/compose",
  "licence": "MIT",
  "authors": ["Quildreen Motta"],
  "repository": "https://github.com/origamitower/folktale",
  "npmPackage": "folktale",
  "copyright": "(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS",
  "maintainers": ["Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)"],
  "stability": "stable",
  "type": "(('b) => 'c, ('a) => 'b) => (('a) => 'c)\n"
});

// --[ Convenience ]---------------------------------------------------

/*~
 * stability: stable
 * authors:
 *   - Quildreen Motta
 *
 * type: |
 *   (('b) => 'c) . (('a) => 'b) => (('a) => 'c)
 */
compose.infix = __metamagical_withMeta(function (that) {
  return compose(that, this);
}, {
  "name": "infix",
  "source": "function(that) {\n  return compose(that, this);\n}",
  "signature": "infix(that)",
  "belongsTo": function belongsTo() {
    return compose;
  },
  "stability": "stable",
  "authors": ["Quildreen Motta"],
  "type": "(('b) => 'c) . (('a) => 'b) => (('a) => 'c)\n"
});

/*~
 * stability: stable
 * authors:
 *   - Quildreen Motta
 *
 * type: |
 *   (Function...) -> Function
 */
compose.all = __metamagical_withMeta(function () {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  /* eslint-disable no-magic-numbers */
  if (fns.length < 1) {
    // eslint-disable-next-line prefer-rest-params
    throw new TypeError("compose.all requires at least one argument, " + arguments.length + " given.");
  }
  return fns.reduce(compose);
}, {
  "name": "all",
  "source": "function(...fns) {\n  /* eslint-disable no-magic-numbers */\n  if (fns.length < 1) { // eslint-disable-next-line prefer-rest-params\n    throw new TypeError(`compose.all requires at least one argument, ${arguments.length} given.`);\n  }\n  return fns.reduce(compose);\n}",
  "signature": "all(...fns)",
  "belongsTo": function belongsTo() {
    return compose;
  },
  "stability": "stable",
  "authors": ["Quildreen Motta"],
  "type": "(Function...) -> Function\n"
}); /* eslint-enable no-magic-numbers */

// --[ Exports ]-------------------------------------------------------
module.exports = compose;