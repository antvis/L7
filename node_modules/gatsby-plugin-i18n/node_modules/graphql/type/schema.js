'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GraphQLSchema = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _definition = require('./definition');

var _directives = require('./directives');

var _introspection = require('./introspection');

var _find = require('../jsutils/find');

var _find2 = _interopRequireDefault(_find);

var _invariant = require('../jsutils/invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _typeComparators = require('../utilities/typeComparators');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
                                                                                                                                                           * Copyright (c) 2015-present, Facebook, Inc.
                                                                                                                                                           *
                                                                                                                                                           * This source code is licensed under the MIT license found in the
                                                                                                                                                           * LICENSE file in the root directory of this source tree.
                                                                                                                                                           *
                                                                                                                                                           * 
                                                                                                                                                           */

/**
 * Schema Definition
 *
 * A Schema is created by supplying the root types of each type of operation,
 * query and mutation (optional). A schema definition is then supplied to the
 * validator and executor.
 *
 * Example:
 *
 *     const MyAppSchema = new GraphQLSchema({
 *       query: MyAppQueryRootType,
 *       mutation: MyAppMutationRootType,
 *     })
 *
 * Note: If an array of `directives` are provided to GraphQLSchema, that will be
 * the exact list of directives represented and allowed. If `directives` is not
 * provided then a default set of the specified directives (e.g. @include and
 * @skip) will be used. If you wish to provide *additional* directives to these
 * specified directives, you must explicitly declare them. Example:
 *
 *     const MyAppSchema = new GraphQLSchema({
 *       ...
 *       directives: specifiedDirectives.concat([ myCustomDirective ]),
 *     })
 *
 */
var GraphQLSchema = exports.GraphQLSchema = function () {
  function GraphQLSchema(config) {
    var _this = this;

    _classCallCheck(this, GraphQLSchema);

    !((typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object') ? (0, _invariant2.default)(0, 'Must provide configuration object.') : void 0;

    !(config.query instanceof _definition.GraphQLObjectType) ? (0, _invariant2.default)(0, 'Schema query must be Object Type but got: ' + String(config.query) + '.') : void 0;
    this._queryType = config.query;

    !(!config.mutation || config.mutation instanceof _definition.GraphQLObjectType) ? (0, _invariant2.default)(0, 'Schema mutation must be Object Type if provided but got: ' + String(config.mutation) + '.') : void 0;
    this._mutationType = config.mutation;

    !(!config.subscription || config.subscription instanceof _definition.GraphQLObjectType) ? (0, _invariant2.default)(0, 'Schema subscription must be Object Type if provided but got: ' + String(config.subscription) + '.') : void 0;
    this._subscriptionType = config.subscription;

    !(!config.types || Array.isArray(config.types)) ? (0, _invariant2.default)(0, 'Schema types must be Array if provided but got: ' + String(config.types) + '.') : void 0;

    !(!config.directives || Array.isArray(config.directives) && config.directives.every(function (directive) {
      return directive instanceof _directives.GraphQLDirective;
    })) ? (0, _invariant2.default)(0, 'Schema directives must be Array<GraphQLDirective> if provided but got: ' + String(config.directives) + '.') : void 0;
    // Provide specified directives (e.g. @include and @skip) by default.
    this._directives = config.directives || _directives.specifiedDirectives;
    this.astNode = config.astNode || null;

    // Build type map now to detect any errors within this schema.
    var initialTypes = [this.getQueryType(), this.getMutationType(), this.getSubscriptionType(), _introspection.__Schema];

    var types = config.types;
    if (types) {
      initialTypes = initialTypes.concat(types);
    }

    this._typeMap = initialTypes.reduce(typeMapReducer, Object.create(null));

    // Keep track of all implementations by interface name.
    this._implementations = Object.create(null);
    Object.keys(this._typeMap).forEach(function (typeName) {
      var type = _this._typeMap[typeName];
      if (type instanceof _definition.GraphQLObjectType) {
        type.getInterfaces().forEach(function (iface) {
          var impls = _this._implementations[iface.name];
          if (impls) {
            impls.push(type);
          } else {
            _this._implementations[iface.name] = [type];
          }
        });
      }
    });

    // Enforce correct interface implementations.
    Object.keys(this._typeMap).forEach(function (typeName) {
      var type = _this._typeMap[typeName];
      if (type instanceof _definition.GraphQLObjectType) {
        type.getInterfaces().forEach(function (iface) {
          return assertObjectImplementsInterface(_this, type, iface);
        });
      }
    });
  }

  GraphQLSchema.prototype.getQueryType = function getQueryType() {
    return this._queryType;
  };

  GraphQLSchema.prototype.getMutationType = function getMutationType() {
    return this._mutationType;
  };

  GraphQLSchema.prototype.getSubscriptionType = function getSubscriptionType() {
    return this._subscriptionType;
  };

  GraphQLSchema.prototype.getTypeMap = function getTypeMap() {
    return this._typeMap;
  };

  GraphQLSchema.prototype.getType = function getType(name) {
    return this.getTypeMap()[name];
  };

  GraphQLSchema.prototype.getPossibleTypes = function getPossibleTypes(abstractType) {
    if (abstractType instanceof _definition.GraphQLUnionType) {
      return abstractType.getTypes();
    }
    !(abstractType instanceof _definition.GraphQLInterfaceType) ? (0, _invariant2.default)(0) : void 0;
    return this._implementations[abstractType.name];
  };

  GraphQLSchema.prototype.isPossibleType = function isPossibleType(abstractType, possibleType) {
    var possibleTypeMap = this._possibleTypeMap;
    if (!possibleTypeMap) {
      this._possibleTypeMap = possibleTypeMap = Object.create(null);
    }

    if (!possibleTypeMap[abstractType.name]) {
      var possibleTypes = this.getPossibleTypes(abstractType);
      !Array.isArray(possibleTypes) ? (0, _invariant2.default)(0, 'Could not find possible implementing types for ' + abstractType.name + ' ' + 'in schema. Check that schema.types is defined and is an array of ' + 'all possible types in the schema.') : void 0;
      possibleTypeMap[abstractType.name] = possibleTypes.reduce(function (map, type) {
        return map[type.name] = true, map;
      }, Object.create(null));
    }

    return Boolean(possibleTypeMap[abstractType.name][possibleType.name]);
  };

  GraphQLSchema.prototype.getDirectives = function getDirectives() {
    return this._directives;
  };

  GraphQLSchema.prototype.getDirective = function getDirective(name) {
    return (0, _find2.default)(this.getDirectives(), function (directive) {
      return directive.name === name;
    });
  };

  return GraphQLSchema;
}();

function typeMapReducer(map, type) {
  if (!type) {
    return map;
  }
  if (type instanceof _definition.GraphQLList || type instanceof _definition.GraphQLNonNull) {
    return typeMapReducer(map, type.ofType);
  }
  if (map[type.name]) {
    !(map[type.name] === type) ? (0, _invariant2.default)(0, 'Schema must contain unique named types but contains multiple ' + ('types named "' + type.name + '".')) : void 0;
    return map;
  }
  map[type.name] = type;

  var reducedMap = map;

  if (type instanceof _definition.GraphQLUnionType) {
    reducedMap = type.getTypes().reduce(typeMapReducer, reducedMap);
  }

  if (type instanceof _definition.GraphQLObjectType) {
    reducedMap = type.getInterfaces().reduce(typeMapReducer, reducedMap);
  }

  if (type instanceof _definition.GraphQLObjectType || type instanceof _definition.GraphQLInterfaceType) {
    var fieldMap = type.getFields();
    Object.keys(fieldMap).forEach(function (fieldName) {
      var field = fieldMap[fieldName];

      if (field.args) {
        var fieldArgTypes = field.args.map(function (arg) {
          return arg.type;
        });
        reducedMap = fieldArgTypes.reduce(typeMapReducer, reducedMap);
      }
      reducedMap = typeMapReducer(reducedMap, field.type);
    });
  }

  if (type instanceof _definition.GraphQLInputObjectType) {
    var _fieldMap = type.getFields();
    Object.keys(_fieldMap).forEach(function (fieldName) {
      var field = _fieldMap[fieldName];
      reducedMap = typeMapReducer(reducedMap, field.type);
    });
  }

  return reducedMap;
}

function assertObjectImplementsInterface(schema, object, iface) {
  var objectFieldMap = object.getFields();
  var ifaceFieldMap = iface.getFields();

  // Assert each interface field is implemented.
  Object.keys(ifaceFieldMap).forEach(function (fieldName) {
    var objectField = objectFieldMap[fieldName];
    var ifaceField = ifaceFieldMap[fieldName];

    // Assert interface field exists on object.
    !objectField ? (0, _invariant2.default)(0, '"' + iface.name + '" expects field "' + fieldName + '" but "' + object.name + '" ' + 'does not provide it.') : void 0;

    // Assert interface field type is satisfied by object field type, by being
    // a valid subtype. (covariant)
    !(0, _typeComparators.isTypeSubTypeOf)(schema, objectField.type, ifaceField.type) ? (0, _invariant2.default)(0, iface.name + '.' + fieldName + ' expects type "' + String(ifaceField.type) + '" ' + 'but ' + (object.name + '.' + fieldName + ' provides type "' + String(objectField.type) + '".')) : void 0;

    // Assert each interface field arg is implemented.
    ifaceField.args.forEach(function (ifaceArg) {
      var argName = ifaceArg.name;
      var objectArg = (0, _find2.default)(objectField.args, function (arg) {
        return arg.name === argName;
      });

      // Assert interface field arg exists on object field.
      !objectArg ? (0, _invariant2.default)(0, iface.name + '.' + fieldName + ' expects argument "' + argName + '" but ' + (object.name + '.' + fieldName + ' does not provide it.')) : void 0;

      // Assert interface field arg type matches object field arg type.
      // (invariant)
      !(0, _typeComparators.isEqualType)(ifaceArg.type, objectArg.type) ? (0, _invariant2.default)(0, iface.name + '.' + fieldName + '(' + argName + ':) expects type ' + ('"' + String(ifaceArg.type) + '" but ') + (object.name + '.' + fieldName + '(' + argName + ':) provides type ') + ('"' + String(objectArg.type) + '".')) : void 0;
    });

    // Assert additional arguments must not be required.
    objectField.args.forEach(function (objectArg) {
      var argName = objectArg.name;
      var ifaceArg = (0, _find2.default)(ifaceField.args, function (arg) {
        return arg.name === argName;
      });
      if (!ifaceArg) {
        !!(objectArg.type instanceof _definition.GraphQLNonNull) ? (0, _invariant2.default)(0, object.name + '.' + fieldName + '(' + argName + ':) is of required type ' + ('"' + String(objectArg.type) + '" but is not also provided by the ') + ('interface ' + iface.name + '.' + fieldName + '.')) : void 0;
      }
    });
  });
}