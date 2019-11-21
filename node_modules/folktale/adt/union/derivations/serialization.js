'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// --[ Dependencies ]---------------------------------------------------
var _require = require('../union'),
    tagSymbol = _require.tagSymbol,
    typeSymbol = _require.typeSymbol;

var mapValues = require('../../../core/object/map-values');
var values = require('../../../core/object/values');
var extend = require('../../../helpers/extend');

// --[ Constants ]------------------------------------------------------
var typeJsonKey = '@@type';
var tagJsonKey = '@@tag';
var valueJsonKey = '@@value';

// --[ Helpers ]--------------------------------------------------------

/*~
 * type: ((Object 'a) => 'b) => ([Object 'a]) => Object 'b  
 */
var arrayToObject = function arrayToObject(extractKey) {
  return function (array) {
    return array.reduce(function (object, element) {
      object[extractKey(element)] = element;
      return object;
    }, {});
  };
};

/*~
 * type: (String) => (Object 'a) => 'a | None 
 */
var property = function property(propertyName) {
  return function (object) {
    return object[propertyName];
  };
};

/*~
 * type: ([Object 'a]) => Object 'a 
 */
var indexByType = arrayToObject(property(typeSymbol));

/*~
 * type: (String, String) => Bool
 */
var assertType = function assertType(given, expected) {
  if (expected !== given) {
    throw new TypeError('\n       The JSON structure was generated from ' + expected + '.\n       You are trying to parse it as ' + given + '. \n    ');
  }
};

/*~
 * type: |
 *   type JSONSerialisation = {
 *     "@@type":  String,
 *     "@@tag":   String,
 *     "@@value": Object Any
 *   }
 *   type JSONParser = {
 *     fromJSON: (JSONSerialisation, Array JSONParser) => Variant
 *   }
 * 
 *   (Object JSONParser) => (JSONSerialisation) => Any
 */
var parseValue = function parseValue(parsers) {
  return function (value) {
    if (value !== null && typeof value[typeJsonKey] === 'string') {
      var type = value[typeJsonKey];
      if (parsers[type]) {
        return parsers[type].fromJSON(value, parsers, true);
      } else {
        return value;
      }
    } else {
      return value;
    }
  };
};

/*~
 * type: ('a) => JSON
 */
var serializeValue = function serializeValue(value) {
  return value === undefined ? null : value !== null && typeof value.toJSON === 'function' ? value.toJSON() : /* otherwise */value;
};

// --[ Implementation ]-------------------------------------------------

/*~
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   (Variant, ADT) => Void 
 */
var serialization = function serialization(variant, adt) {
  var typeName = adt[typeSymbol];
  var tagName = variant.prototype[tagSymbol];

  /*~
   * stability: experimental
   * module: null
   * authors:
   *   - "@boris-marinov"
   * 
   * type: |
   *   type JSONSerialisation = {
   *     "@@type":  String,
   *     "@@tag":   String,
   *     "@@value": Object Any
   *   }
   * 
   *   Variant . () => JSONSerialisation
   */
  variant.prototype.toJSON = function () {
    var _ref;

    return _ref = {}, _defineProperty(_ref, typeJsonKey, typeName), _defineProperty(_ref, tagJsonKey, tagName), _defineProperty(_ref, valueJsonKey, mapValues(this, serializeValue)), _ref;
  };

  /*~
   * stability: experimental
   * module: null
   * authors:
   *   - "@boris-marinov"
   * 
   * type: |
   *   type JSONSerialisation = {
   *     "@@type":  String,
   *     "@@tag":   String,
   *     "@@value": Object Any
   *   }
   *   type JSONParser = {
   *     fromJSON: (JSONSerialisation, Array JSONParser) => Variant
   *   }
   * 
   *   (JSONSerialisation, Array JSONParser) => Variant
   */
  adt.fromJSON = function (value) {
    var parsers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _defineProperty({}, typeName, adt);
    var keysIndicateType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var valueTypeName = value[typeJsonKey];
    var valueTagName = value[tagJsonKey];
    var valueContents = value[valueJsonKey];
    assertType(typeName, valueTypeName);
    var parsersByType = keysIndicateType ? parsers : /*otherwise*/indexByType(values(parsers));

    var parsedValue = mapValues(valueContents, parseValue(parsersByType));
    return extend(Object.create(adt[valueTagName].prototype), parsedValue);
  };
};

// --[ Exports ]--------------------------------------------------------
module.exports = serialization;