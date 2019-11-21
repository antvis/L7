'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unknownArgMessage = unknownArgMessage;
exports.unknownDirectiveArgMessage = unknownDirectiveArgMessage;
exports.KnownArgumentNames = KnownArgumentNames;

var _error = require('../../error');

var _find = require('../../jsutils/find');

var _find2 = _interopRequireDefault(_find);

var _invariant = require('../../jsutils/invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _suggestionList = require('../../jsutils/suggestionList');

var _suggestionList2 = _interopRequireDefault(_suggestionList);

var _quotedOrList = require('../../jsutils/quotedOrList');

var _quotedOrList2 = _interopRequireDefault(_quotedOrList);

var _kinds = require('../../language/kinds');

var Kind = _interopRequireWildcard(_kinds);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function unknownArgMessage(argName, fieldName, typeName, suggestedArgs) {
  var message = 'Unknown argument "' + argName + '" on field "' + fieldName + '" of ' + ('type "' + typeName + '".');
  if (suggestedArgs.length) {
    message += ' Did you mean ' + (0, _quotedOrList2.default)(suggestedArgs) + '?';
  }
  return message;
} /**
   * Copyright (c) 2015-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   */

function unknownDirectiveArgMessage(argName, directiveName, suggestedArgs) {
  var message = 'Unknown argument "' + argName + '" on directive "@' + directiveName + '".';
  if (suggestedArgs.length) {
    message += ' Did you mean ' + (0, _quotedOrList2.default)(suggestedArgs) + '?';
  }
  return message;
}

/**
 * Known argument names
 *
 * A GraphQL field is only valid if all supplied arguments are defined by
 * that field.
 */
function KnownArgumentNames(context) {
  return {
    Argument: function Argument(node, key, parent, path, ancestors) {
      var argumentOf = ancestors[ancestors.length - 1];
      if (argumentOf.kind === Kind.FIELD) {
        var fieldDef = context.getFieldDef();
        if (fieldDef) {
          var fieldArgDef = (0, _find2.default)(fieldDef.args, function (arg) {
            return arg.name === node.name.value;
          });
          if (!fieldArgDef) {
            var parentType = context.getParentType();
            !parentType ? (0, _invariant2.default)(0) : void 0;
            context.reportError(new _error.GraphQLError(unknownArgMessage(node.name.value, fieldDef.name, parentType.name, (0, _suggestionList2.default)(node.name.value, fieldDef.args.map(function (arg) {
              return arg.name;
            }))), [node]));
          }
        }
      } else if (argumentOf.kind === Kind.DIRECTIVE) {
        var directive = context.getDirective();
        if (directive) {
          var directiveArgDef = (0, _find2.default)(directive.args, function (arg) {
            return arg.name === node.name.value;
          });
          if (!directiveArgDef) {
            context.reportError(new _error.GraphQLError(unknownDirectiveArgMessage(node.name.value, directive.name, (0, _suggestionList2.default)(node.name.value, directive.args.map(function (arg) {
              return arg.name;
            }))), [node]));
          }
        }
      }
    }
  };
}