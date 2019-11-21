"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
var mapEntries = function mapEntries(object, transform, define) {
  return Object.keys(object).reduce(function (result, key) {
    var _transform = transform([key, object[key]]),
        _transform2 = _slicedToArray(_transform, 2),
        newKey = _transform2[0],
        newValue = _transform2[1];

    return define(result, newKey, newValue);
  }, {});
};

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
mapEntries.overwrite = function (object, transform) {
  return mapEntries(object, transform, function (result, key, value) {
    result[key] = value;
    return result;
  });
};

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
mapEntries.unique = function (object, transform) {
  return mapEntries(object, transform, function (result, key, value) {
    if (hasOwnProperty.call(result, key)) {
      throw new Error("The property " + key + " already exists in the resulting object.");
    }
    result[key] = value;
    return result;
  });
};

// --[ Exports ]-------------------------------------------------------
module.exports = mapEntries;