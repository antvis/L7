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
var arrayToObject = __metamagical_withMeta(function (extractKey) {
  return function (array) {
    return array.reduce(function (object, element) {
      object[extractKey(element)] = element;
      return object;
    }, {});
  };
}, {
  'name': 'arrayToObject',
  'source': '(extractKey) => (array) => \n  array.reduce((object, element) => {\n    object[extractKey(element)] = element;\n    return object;\n  }, {})',
  'signature': 'arrayToObject(extractKey)',
  'location': {
    'filename': 'source/adt/union/derivations/serialization.js',
    'start': {
      'line': 28,
      'column': 0
    },
    'end': {
      'line': 32,
      'column': 9
    }
  },
  'module': 'folktale/adt/union/derivations/serialization',
  'licence': 'MIT',
  'authors': ['Quildreen Motta'],
  'repository': 'https://github.com/origamitower/folktale',
  'npmPackage': 'folktale',
  'copyright': '(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS',
  'maintainers': ['Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)'],
  'type': '((Object \'a) => \'b) => ([Object \'a]) => Object \'b'
});

/*~
 * type: (String) => (Object 'a) => 'a | None 
 */
var property = __metamagical_withMeta(function (propertyName) {
  return function (object) {
    return object[propertyName];
  };
}, {
  'name': 'property',
  'source': '(propertyName) => (object) => object[propertyName]',
  'signature': 'property(propertyName)',
  'location': {
    'filename': 'source/adt/union/derivations/serialization.js',
    'start': {
      'line': 38,
      'column': 0
    },
    'end': {
      'line': 38,
      'column': 68
    }
  },
  'module': 'folktale/adt/union/derivations/serialization',
  'licence': 'MIT',
  'authors': ['Quildreen Motta'],
  'repository': 'https://github.com/origamitower/folktale',
  'npmPackage': 'folktale',
  'copyright': '(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS',
  'maintainers': ['Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)'],
  'type': '(String) => (Object \'a) => \'a | None'
});

/*~
 * type: ([Object 'a]) => Object 'a 
 */
var indexByType = __metamagical_withMeta(arrayToObject(property(typeSymbol)), {
  'name': 'indexByType',
  'source': 'arrayToObject(property(typeSymbol))',
  'location': {
    'filename': 'source/adt/union/derivations/serialization.js',
    'start': {
      'line': 44,
      'column': 0
    },
    'end': {
      'line': 44,
      'column': 56
    }
  },
  'module': 'folktale/adt/union/derivations/serialization',
  'licence': 'MIT',
  'authors': ['Quildreen Motta'],
  'repository': 'https://github.com/origamitower/folktale',
  'npmPackage': 'folktale',
  'copyright': '(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS',
  'maintainers': ['Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)'],
  'type': '([Object \'a]) => Object \'a'
});

/*~
 * type: (String, String) => Bool
 */
var assertType = __metamagical_withMeta(function (given, expected) {
  if (expected !== given) {
    throw new TypeError('\n       The JSON structure was generated from ' + expected + '.\n       You are trying to parse it as ' + given + '. \n    ');
  }
}, {
  'name': 'assertType',
  'source': '(given, expected) => {\n  if (expected !== given) {\n    throw new TypeError(`\n       The JSON structure was generated from ${expected}.\n       You are trying to parse it as ${given}. \n    `);\n  }\n}',
  'signature': 'assertType(given, expected)',
  'location': {
    'filename': 'source/adt/union/derivations/serialization.js',
    'start': {
      'line': 50,
      'column': 0
    },
    'end': {
      'line': 57,
      'column': 2
    }
  },
  'module': 'folktale/adt/union/derivations/serialization',
  'licence': 'MIT',
  'authors': ['Quildreen Motta'],
  'repository': 'https://github.com/origamitower/folktale',
  'npmPackage': 'folktale',
  'copyright': '(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS',
  'maintainers': ['Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)'],
  'type': '(String, String) => Bool'
});

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
var parseValue = __metamagical_withMeta(function (parsers) {
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
}, {
  'name': 'parseValue',
  'source': '(parsers) => (value) => {\n  if (value !== null && typeof value[typeJsonKey] === \'string\') {\n    const type = value[typeJsonKey];\n    if (parsers[type]) {\n      return parsers[type].fromJSON(value, parsers, true);\n    } else {\n      return value;\n    }\n  } else {\n    return value;\n  }\n}',
  'signature': 'parseValue(parsers)',
  'location': {
    'filename': 'source/adt/union/derivations/serialization.js',
    'start': {
      'line': 73,
      'column': 0
    },
    'end': {
      'line': 84,
      'column': 2
    }
  },
  'module': 'folktale/adt/union/derivations/serialization',
  'licence': 'MIT',
  'authors': ['Quildreen Motta'],
  'repository': 'https://github.com/origamitower/folktale',
  'npmPackage': 'folktale',
  'copyright': '(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS',
  'maintainers': ['Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)'],
  'type': 'type JSONSerialisation = {\n  "@@type":  String,\n  "@@tag":   String,\n  "@@value": Object Any\n}\ntype JSONParser = {\n  fromJSON: (JSONSerialisation, Array JSONParser) => Variant\n}\n\n(Object JSONParser) => (JSONSerialisation) => Any\n'
});

/*~
 * type: ('a) => JSON
 */
var serializeValue = __metamagical_withMeta(function (value) {
  return value === undefined ? null : value !== null && typeof value.toJSON === 'function' ? value.toJSON() : /* otherwise */value;
}, {
  'name': 'serializeValue',
  'source': '(value) =>\n  value === undefined                                  ?  null\n: value !== null && typeof value.toJSON === \'function\' ?  value.toJSON()\n: /* otherwise */                                         value',
  'signature': 'serializeValue(value)',
  'location': {
    'filename': 'source/adt/union/derivations/serialization.js',
    'start': {
      'line': 90,
      'column': 0
    },
    'end': {
      'line': 93,
      'column': 64
    }
  },
  'module': 'folktale/adt/union/derivations/serialization',
  'licence': 'MIT',
  'authors': ['Quildreen Motta'],
  'repository': 'https://github.com/origamitower/folktale',
  'npmPackage': 'folktale',
  'copyright': '(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS',
  'maintainers': ['Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)'],
  'type': '(\'a) => JSON'
});

// --[ Implementation ]-------------------------------------------------

/*~
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   (Variant, ADT) => Void 
 */
var serialization = __metamagical_withMeta(function (variant, adt) {
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
  variant.prototype.toJSON = __metamagical_withMeta(function () {
    var _ref;

    return _ref = {}, _defineProperty(_ref, typeJsonKey, typeName), _defineProperty(_ref, tagJsonKey, tagName), _defineProperty(_ref, valueJsonKey, mapValues(this, serializeValue)), _ref;
  }, {
    'name': 'toJSON',
    'source': 'function() {\n    return { \n      [typeJsonKey]:  typeName, \n      [tagJsonKey]:   tagName, \n      [valueJsonKey]: mapValues(this, serializeValue) \n    };\n  }',
    'signature': 'toJSON()',
    'belongsTo': function belongsTo() {
      return variant.prototype;
    },
    'stability': 'experimental',
    'module': null,
    'authors': ['@boris-marinov'],
    'type': 'type JSONSerialisation = {\n  "@@type":  String,\n  "@@tag":   String,\n  "@@value": Object Any\n}\n\nVariant . () => JSONSerialisation\n \n'
  });

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
  adt.fromJSON = __metamagical_withMeta(function (value) {
    var parsers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _defineProperty({}, typeName, adt);
    var keysIndicateType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var valueTypeName = value[typeJsonKey];
    var valueTagName = value[tagJsonKey];
    var valueContents = value[valueJsonKey];
    assertType(typeName, valueTypeName);
    var parsersByType = keysIndicateType ? parsers : /*otherwise*/indexByType(values(parsers));

    var parsedValue = mapValues(valueContents, parseValue(parsersByType));
    return extend(Object.create(adt[valueTagName].prototype), parsedValue);
  }, {
    'name': 'fromJSON',
    'source': 'function(value, parsers = { [typeName]: adt }, keysIndicateType = false) {\n    const valueTypeName = value[typeJsonKey];\n    const valueTagName = value[tagJsonKey];\n    const valueContents = value[valueJsonKey];\n    assertType(typeName, valueTypeName);\n    const parsersByType = keysIndicateType ? parsers\n          : /*otherwise*/                    indexByType(values(parsers));\n\n    const parsedValue = mapValues(valueContents, parseValue(parsersByType));\n    return extend(Object.create(adt[valueTagName].prototype), parsedValue);\n  }',
    'signature': 'fromJSON(value, parsers = {\n  [typeName]: adt\n}, keysIndicateType = false)',
    'belongsTo': function belongsTo() {
      return adt;
    },
    'stability': 'experimental',
    'module': null,
    'authors': ['@boris-marinov'],
    'type': 'type JSONSerialisation = {\n  "@@type":  String,\n  "@@tag":   String,\n  "@@value": Object Any\n}\ntype JSONParser = {\n  fromJSON: (JSONSerialisation, Array JSONParser) => Variant\n}\n\n(JSONSerialisation, Array JSONParser) => Variant\n \n'
  });
}, {
  'name': 'serialization',
  'source': '(variant, adt) => {\n  const typeName = adt[typeSymbol];\n  const tagName = variant.prototype[tagSymbol];\n\n  /*~\n   * stability: experimental\n   * module: null\n   * authors:\n   *   - "@boris-marinov"\n   * \n   * type: |\n   *   type JSONSerialisation = {\n   *     "@@type":  String,\n   *     "@@tag":   String,\n   *     "@@value": Object Any\n   *   }\n   * \n   *   Variant . () => JSONSerialisation\n   */\n  variant.prototype.toJSON = function() {\n    return { \n      [typeJsonKey]:  typeName, \n      [tagJsonKey]:   tagName, \n      [valueJsonKey]: mapValues(this, serializeValue) \n    };\n  };\n\n  /*~\n   * stability: experimental\n   * module: null\n   * authors:\n   *   - "@boris-marinov"\n   * \n   * type: |\n   *   type JSONSerialisation = {\n   *     "@@type":  String,\n   *     "@@tag":   String,\n   *     "@@value": Object Any\n   *   }\n   *   type JSONParser = {\n   *     fromJSON: (JSONSerialisation, Array JSONParser) => Variant\n   *   }\n   * \n   *   (JSONSerialisation, Array JSONParser) => Variant\n   */\n  adt.fromJSON = function(value, parsers = { [typeName]: adt }, keysIndicateType = false) {\n    const valueTypeName = value[typeJsonKey];\n    const valueTagName = value[tagJsonKey];\n    const valueContents = value[valueJsonKey];\n    assertType(typeName, valueTypeName);\n    const parsersByType = keysIndicateType ? parsers\n          : /*otherwise*/                    indexByType(values(parsers));\n\n    const parsedValue = mapValues(valueContents, parseValue(parsersByType));\n    return extend(Object.create(adt[valueTagName].prototype), parsedValue);\n  };\n}',
  'signature': 'serialization(variant, adt)',
  'location': {
    'filename': 'source/adt/union/derivations/serialization.js',
    'start': {
      'line': 106,
      'column': 0
    },
    'end': {
      'line': 162,
      'column': 2
    }
  },
  'module': 'folktale/adt/union/derivations/serialization',
  'licence': 'MIT',
  'authors': ['@boris-marinov'],
  'repository': 'https://github.com/origamitower/folktale',
  'npmPackage': 'folktale',
  'copyright': '(c) 2013-2017 Quildreen Motta, and CONTRIBUTORS',
  'maintainers': ['Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)'],
  'stability': 'experimental',
  'type': '(Variant, ADT) => Void \n'
});

// --[ Exports ]--------------------------------------------------------
module.exports = serialization;