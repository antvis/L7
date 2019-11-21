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
  });
  object[Symbol.for('@@meta:magical')] = oldMeta;return object;
};

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// --[ Dependencies ]---------------------------------------------------
var assertType = require('../../../helpers/assert-type');
var flEquals = require('../../../fantasy-land/equals');
var fl = require('../../../helpers/fantasy-land');
var provideAliases = require('../../../helpers/provide-fantasy-land-aliases');
var copyDocs = require('../../../helpers/copy-documentation');

var _require = require('../union'),
    tagSymbol = _require.tagSymbol,
    typeSymbol = _require.typeSymbol;

var toString = Object.prototype.toString;
var prototypeOf = Object.getPrototypeOf;

// --[ Helpers ]--------------------------------------------------------

/*~
 * type: (Any) => Boolean
 */
var isSetoid = __metamagical_withMeta(function (value) {
  return value != null && (typeof value[fl.equals] === 'function' || typeof value.equals === 'function');
}, {
  'name': 'isSetoid',
  'source': '(value) => value != null \n                         && (typeof value[fl.equals] === \'function\' || typeof value.equals === \'function\')',
  'signature': 'isSetoid(value)',
  'location': {
    'filename': 'source/adt/union/derivations/equality.js',
    'start': {
      'line': 27,
      'column': 0
    },
    'end': {
      'line': 28,
      'column': 107
    }
  },
  'module': 'folktale/adt/union/derivations/equality',
  'licence': 'MIT',
  'authors': ['Quildreen Motta'],
  'repository': 'https://github.com/origamitower/folktale',
  'npmPackage': 'folktale',
  'copyright': '(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS',
  'maintainers': ['Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)'],
  'type': '(Any) => Boolean'
});

/*~
 * type: (Variant, Variant) => Boolean
 */
var sameType = __metamagical_withMeta(function (a, b) {
  return a[typeSymbol] === b[typeSymbol] && a[tagSymbol] === b[tagSymbol];
}, {
  'name': 'sameType',
  'source': '(a, b) => a[typeSymbol] === b[typeSymbol] \n                        && a[tagSymbol] === b[tagSymbol]',
  'signature': 'sameType(a, b)',
  'location': {
    'filename': 'source/adt/union/derivations/equality.js',
    'start': {
      'line': 33,
      'column': 0
    },
    'end': {
      'line': 34,
      'column': 57
    }
  },
  'module': 'folktale/adt/union/derivations/equality',
  'licence': 'MIT',
  'authors': ['Quildreen Motta'],
  'repository': 'https://github.com/origamitower/folktale',
  'npmPackage': 'folktale',
  'copyright': '(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS',
  'maintainers': ['Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)'],
  'type': '(Variant, Variant) => Boolean'
});

var isPlainObject = function isPlainObject(object) {
  if (Object(object) !== object) return false;

  return !prototypeOf(object) || !object.toString || toString.call(object) === object.toString();
};

var deepEquals = function deepEquals(a, b) {
  if (a === b) return true;

  var leftSetoid = isSetoid(a);
  var rightSetoid = isSetoid(b);
  if (leftSetoid) {
    if (rightSetoid) return flEquals(a, b);else return false;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every(function (x, i) {
      return deepEquals(x, b[i]);
    });
  }

  if (isPlainObject(a) && isPlainObject(b)) {
    var keysA = Object.keys(a);
    var keysB = Object.keys(b);
    var setB = new Set(keysB);
    return keysA.length === keysB.length && prototypeOf(a) === prototypeOf(b) && keysA.every(function (k) {
      return setB.has(k) && a[k] === b[k];
    });
  }

  return false;
};

// --[ Implementation ]------------------------------------------------
/*~
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   (('a, 'a) => Boolean) => (Variant, Union) => Void
 */
var createDerivation = __metamagical_withMeta(function (valuesEqual) {
  /*~
   * type: ('a, 'a) => Boolean
   */
  var equals = __metamagical_withMeta(function (a, b) {
    // identical objects must be equal
    if (a === b) return true;

    // we require both values to be setoids if one of them is
    var leftSetoid = isSetoid(a);
    var rightSetoid = isSetoid(b);
    if (leftSetoid) {
      if (rightSetoid) return flEquals(a, b);else return false;
    }

    // fall back to the provided equality
    return valuesEqual(a, b);
  }, {
    'name': 'equals',
    'source': '(a, b) => {\n    // identical objects must be equal\n    if (a === b)  return true;\n\n    // we require both values to be setoids if one of them is\n    const leftSetoid  = isSetoid(a);\n    const rightSetoid = isSetoid(b);\n    if (leftSetoid) {\n      if (rightSetoid)  return flEquals(a, b);\n      else              return false;\n    }\n\n    // fall back to the provided equality\n    return valuesEqual(a, b);\n  }',
    'signature': 'equals(a, b)',
    'location': {
      'filename': 'source/adt/union/derivations/equality.js',
      'start': {
        'line': 87,
        'column': 2
      },
      'end': {
        'line': 101,
        'column': 4
      }
    },
    'module': 'folktale/adt/union/derivations/equality',
    'licence': 'MIT',
    'authors': ['Quildreen Motta'],
    'repository': 'https://github.com/origamitower/folktale',
    'npmPackage': 'folktale',
    'copyright': '(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS',
    'maintainers': ['Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)'],
    'type': '(\'a, \'a) => Boolean'
  });

  /*~
   * type: (Object Any, Object Any, Array String) => Boolean
   */
  var compositesEqual = __metamagical_withMeta(function (a, b, keys) {
    for (var i = 0; i < keys.length; ++i) {
      var keyA = a[keys[i]];
      var keyB = b[keys[i]];
      if (!equals(keyA, keyB)) {
        return false;
      }
    }
    return true;
  }, {
    'name': 'compositesEqual',
    'source': '(a, b, keys) => {\n    for (let i = 0; i < keys.length; ++i) {\n      const keyA = a[keys[i]];\n      const keyB = b[keys[i]];\n      if (!(equals(keyA, keyB))) {\n        return false;\n      }\n    }\n    return true;\n  }',
    'signature': 'compositesEqual(a, b, keys)',
    'location': {
      'filename': 'source/adt/union/derivations/equality.js',
      'start': {
        'line': 107,
        'column': 2
      },
      'end': {
        'line': 116,
        'column': 4
      }
    },
    'module': 'folktale/adt/union/derivations/equality',
    'licence': 'MIT',
    'authors': ['Quildreen Motta'],
    'repository': 'https://github.com/origamitower/folktale',
    'npmPackage': 'folktale',
    'copyright': '(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS',
    'maintainers': ['Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)'],
    'type': '(Object Any, Object Any, Array String) => Boolean'
  });

  var derivation = function derivation(variant, adt) {
    /*~
     * stability: experimental
     * module: null
     * authors:
     *   - "@boris-marinov"
     *   - Quildreen Motta
     * 
     * type: |
     *   forall S, a:
     *     (S a).(S a) => Boolean
     *   where S is Setoid
     */
    variant.prototype.equals = __metamagical_withMeta(function (value) {
      assertType(adt)(this[tagSymbol] + '#equals', value);
      return sameType(this, value) && compositesEqual(this, value, Object.keys(this));
    }, {
      'name': 'equals',
      'source': 'function(value) {\n      assertType(adt)(`${this[tagSymbol]}#equals`, value);\n      return sameType(this, value) && compositesEqual(this, value, Object.keys(this));\n    }',
      'signature': 'equals(value)',
      'belongsTo': function belongsTo() {
        return variant.prototype;
      },
      'stability': 'experimental',
      'module': null,
      'authors': ['@boris-marinov', 'Quildreen Motta'],
      'type': 'forall S, a:\n  (S a).(S a) => Boolean\nwhere S is Setoid\n   \n'
    });
    provideAliases(variant.prototype);
    return variant;
  };
  copyDocs(createDerivation, derivation, {
    type: '(Variant, Union) => Void'
  });

  return derivation;
}, {
  'name': 'createDerivation',
  'source': '(valuesEqual) => {\n  /*~\n   * type: (\'a, \'a) => Boolean\n   */\n  const equals = (a, b) => {\n    // identical objects must be equal\n    if (a === b)  return true;\n\n    // we require both values to be setoids if one of them is\n    const leftSetoid  = isSetoid(a);\n    const rightSetoid = isSetoid(b);\n    if (leftSetoid) {\n      if (rightSetoid)  return flEquals(a, b);\n      else              return false;\n    }\n\n    // fall back to the provided equality\n    return valuesEqual(a, b);\n  };\n\n\n  /*~\n   * type: (Object Any, Object Any, Array String) => Boolean\n   */\n  const compositesEqual = (a, b, keys) => {\n    for (let i = 0; i < keys.length; ++i) {\n      const keyA = a[keys[i]];\n      const keyB = b[keys[i]];\n      if (!(equals(keyA, keyB))) {\n        return false;\n      }\n    }\n    return true;\n  };\n\n\n  const derivation = (variant, adt) => {\n    /*~\n     * stability: experimental\n     * module: null\n     * authors:\n     *   - "@boris-marinov"\n     *   - Quildreen Motta\n     * \n     * type: |\n     *   forall S, a:\n     *     (S a).(S a) => Boolean\n     *   where S is Setoid\n     */\n    variant.prototype.equals = function(value) {\n      assertType(adt)(`${this[tagSymbol]}#equals`, value);\n      return sameType(this, value) && compositesEqual(this, value, Object.keys(this));\n    };\n    provideAliases(variant.prototype);\n    return variant;\n  };\n  copyDocs(createDerivation, derivation, {\n    type: \'(Variant, Union) => Void\'\n  });\n\n\n  return derivation;\n}',
  'signature': 'createDerivation(valuesEqual)',
  'location': {
    'filename': 'source/adt/union/derivations/equality.js',
    'start': {
      'line': 83,
      'column': 0
    },
    'end': {
      'line': 145,
      'column': 2
    }
  },
  'module': 'folktale/adt/union/derivations/equality',
  'licence': 'MIT',
  'authors': ['@boris-marinov'],
  'repository': 'https://github.com/origamitower/folktale',
  'npmPackage': 'folktale',
  'copyright': '(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS',
  'maintainers': ['Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)'],
  'stability': 'experimental',
  'type': '((\'a, \'a) => Boolean) => (Variant, Union) => Void\n'
});

// --[ Exports ]-------------------------------------------------------

/*~~inheritsMeta: createDerivation */
module.exports = createDerivation(deepEquals);

module.exports.withCustomComparison = createDerivation;