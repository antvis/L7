'use strict';

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
var isSetoid = function isSetoid(value) {
  return value != null && (typeof value[fl.equals] === 'function' || typeof value.equals === 'function');
};

/*~
 * type: (Variant, Variant) => Boolean
 */
var sameType = function sameType(a, b) {
  return a[typeSymbol] === b[typeSymbol] && a[tagSymbol] === b[tagSymbol];
};

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
var createDerivation = function createDerivation(valuesEqual) {
  /*~
   * type: ('a, 'a) => Boolean
   */
  var equals = function equals(a, b) {
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
  };

  /*~
   * type: (Object Any, Object Any, Array String) => Boolean
   */
  var compositesEqual = function compositesEqual(a, b, keys) {
    for (var i = 0; i < keys.length; ++i) {
      var keyA = a[keys[i]];
      var keyB = b[keys[i]];
      if (!equals(keyA, keyB)) {
        return false;
      }
    }
    return true;
  };

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
    variant.prototype.equals = function (value) {
      assertType(adt)(this[tagSymbol] + '#equals', value);
      return sameType(this, value) && compositesEqual(this, value, Object.keys(this));
    };
    provideAliases(variant.prototype);
    return variant;
  };
  copyDocs(createDerivation, derivation, {
    type: '(Variant, Union) => Void'
  });

  return derivation;
};

// --[ Exports ]-------------------------------------------------------

/*~~inheritsMeta: createDerivation */
module.exports = createDerivation(deepEquals);

module.exports.withCustomComparison = createDerivation;