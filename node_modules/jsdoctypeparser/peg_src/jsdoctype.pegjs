{
  var meta = require('../lib/SyntaxType.js');
  var GenericTypeSyntax = meta.GenericTypeSyntax;
  var UnionTypeSyntax = meta.UnionTypeSyntax;
  var VariadicTypeSyntax = meta.VariadicTypeSyntax;
  var OptionalTypeSyntax = meta.OptionalTypeSyntax;
  var NullableTypeSyntax = meta.NullableTypeSyntax;
  var NotNullableTypeSyntax = meta.NotNullableTypeSyntax;
  var NodeType = require('../lib/NodeType.js');

  var NamepathOperatorType = {
    MEMBER: 'MEMBER',
    INNER_MEMBER: 'INNER_MEMBER',
    INSTANCE_MEMBER: 'INSTANCE_MEMBER',
  };

  function reverse(array) {
    var reversed = [].concat(array);
    reversed.reverse();
    return reversed;
  }
}



TopTypeExpr = _ expr:( VariadicTypeExpr
                  / UnionTypeExpr
                  / UnaryUnionTypeExpr
                  / ArrayTypeExpr
                  / GenericTypeExpr
                  / RecordTypeExpr
                  / ArrowTypeExpr
                  / FunctionTypeExpr
                  / TypeQueryExpr
                  / BroadNamepathExpr
                  / ParenthesizedExpr
                  / ValueExpr
                  / AnyTypeExpr
                  / UnknownTypeExpr
                  ) _ {
           return expr;
         }

TopLevel = _ expr:( VariadicTypeExpr
                  / UnionTypeExpr
                  / UnaryUnionTypeExpr
                  / ArrayTypeExpr
                  / GenericTypeExpr
                  / RecordTypeExpr
                  / ArrowTypeExpr
                  / FunctionTypeExpr
                  / TypeQueryExpr
                  / BroadNamepathExpr
                  / ParenthesizedExpr
                  / ValueExpr
                  / AnyTypeExpr
                  / UnknownTypeExpr
                  ) _ {
           return expr;
         }


/*
 * White spaces.
 */
_  = [ \t\r\n ]*


/*
 * JavaScript identifier names.
 *
 * NOTE: We does not support UnicodeIDStart and \UnicodeEscapeSequence yet.
 *
 * Spec:
 *   - http://www.ecma-international.org/ecma-262/6.0/index.html#sec-names-and-keywords
 *   - http://unicode.org/reports/tr31/#Table_Lexical_Classes_for_Identifiers
 */
JsIdentifier = $([a-zA-Z_$][a-zA-Z0-9_$]*)


// It is transformed to remove left recursion.
// See https://en.wikipedia.org/wiki/Left_recursion#Removing_left_recursion
NamepathExpr = rootOwner:(ParenthesizedExpr / ImportTypeExpr / TypeNameExpr) memberPartWithOperators:(_ InfixNamepathOperator _ "event:"? _ MemberName)* {
               return memberPartWithOperators.reduce(function(owner, tokens) {
                 var operatorType = tokens[1];
                 var eventNamespace = tokens[3];
                 var memberName = tokens[5];

                 switch (operatorType) {
                   case NamepathOperatorType.MEMBER:
                     return {
                       type: NodeType.MEMBER,
                       owner: owner,
                       name: memberName,
                       hasEventPrefix: Boolean(eventNamespace),
                     };
                   case NamepathOperatorType.INSTANCE_MEMBER:
                     return {
                       type: NodeType.INSTANCE_MEMBER,
                       owner: owner,
                       name: memberName,
                       hasEventPrefix: Boolean(eventNamespace),
                     };
                   case NamepathOperatorType.INNER_MEMBER:
                     return {
                       type: NodeType.INNER_MEMBER,
                       owner: owner,
                       name: memberName,
                       hasEventPrefix: Boolean(eventNamespace),
                     };
                   default:
                     throw new Error('Unexpected operator type: "' + operatorType + '"');
                 }
               }, rootOwner);
             }


/*
 * Type name expressions.
 *
 * Examples:
 *   - string
 *   - null
 *   - Error
 *   - $
 *   - _
 *   - custom-type (JSDoc compatible)
 *
 * Spec:
 *   - https://developers.google.com/closure/compiler/docs/js-for-compiler#types
 */
TypeNameExpr = TypeNameExprJsDocFlavored
             / TypeNameExprStrict


TypeNameExprStrict = name:JsIdentifier {
                     return {
                       type: NodeType.NAME,
                       name: name
                     };
                   }


// JSDoc allow to use hyphens in identifier contexts.
// See https://github.com/jsdoctypeparser/jsdoctypeparser/issues/15
TypeNameExprJsDocFlavored = name:$([a-zA-Z_$][a-zA-Z0-9_$-]*) {
                            return {
                              type: NodeType.NAME,
                              name: name
                            };
                          }


// TODO: Care escaped strings
MemberName = "'" name:$([^']*) "'" {
               return name;
             }
           / '"' name:$([^"]*) '"' {
               return name;
             }
           / JsIdentifier


InfixNamepathOperator = MemberTypeOperator
                      / InstanceMemberTypeOperator
                      / InnerMemberTypeOperator

QualifiedMemberName = rootOwner:TypeNameExpr memberPart:(_ "." _ TypeNameExpr)* {
                      return memberPart.reduce(function(owner, tokens) {
                        return {
                          type: NodeType.MEMBER,
                          owner: owner,
                          name: tokens[3]
                        }
                      }, rootOwner);
                    }


/*
 * Member type expressions.
 *
 * Examples:
 *   - owner.member
 *   - superOwner.owner.member
 */
MemberTypeOperator = "." {
                     return NamepathOperatorType.MEMBER;
                   }


/*
 * Inner member type expressions.
 *
 * Examples:
 *   - owner~innerMember
 *   - superOwner~owner~innerMember
 */
InnerMemberTypeOperator = "~" {
                          return NamepathOperatorType.INNER_MEMBER;
                        }


/*
 * Instance member type expressions.
 *
 * Examples:
 *   - owner#instanceMember
 *   - superOwner#owner#instanceMember
 */
InstanceMemberTypeOperator = "#" {
                             return NamepathOperatorType.INSTANCE_MEMBER;
                           }


BroadNamepathExpr = ExternalNameExpr
                  / ModuleNameExpr
                  / NamepathExpr


/*
 * External name expressions.
 *
 * Examples:
 *   - external:path/to/file
 *   - external:path/to/file.js
 *
 * Spec:
 *   - http://usejsdoc.org/tags-external.html
 */
ExternalNameExpr = "external" _ ":" _ value:NamepathExpr {
                   return {
                     type: NodeType.EXTERNAL,
                     value: value
                   };
                 }


/*
 * Module name expressions.
 *
 * Examples:
 *   - module:path/to/file
 *   - module:path/to/file.MyModule~Foo
 *
 * Spec:
 *   - http://usejsdoc.org/tags-module.html
 *   - http://usejsdoc.org/howto-commonjs-modules.html
 */
ModuleNameExpr = "module" _ ":" _ value:ModulePathExpr {
                 return {
                   type: NodeType.MODULE,
                   value: value,
                 };
               }



// It is transformed to remove left recursion
ModulePathExpr = rootOwner:(FilePathExpr) memberPartWithOperators:(_ InfixNamepathOperator _ "event:"? _ MemberName)* {
                 return memberPartWithOperators.reduce(function(owner, tokens) {
                   var operatorType = tokens[1];
                   var eventNamespace = tokens[3];
                   var memberName = tokens[5];

                   switch (operatorType) {
                     case NamepathOperatorType.MEMBER:
                       return {
                         type: NodeType.MEMBER,
                         owner: owner,
                         name: memberName,
                         hasEventPrefix: Boolean(eventNamespace),
                       };
                     case NamepathOperatorType.INSTANCE_MEMBER:
                       return {
                         type: NodeType.INSTANCE_MEMBER,
                         owner: owner,
                         name: memberName,
                         hasEventPrefix: Boolean(eventNamespace),
                       };
                     case NamepathOperatorType.INNER_MEMBER:
                       return {
                         type: NodeType.INNER_MEMBER,
                         owner: owner,
                         name: memberName,
                         hasEventPrefix: Boolean(eventNamespace),
                       };
                     default:
                       throw new Error('Unexpected operator type: "' + operatorType + '"');
                   }
                 }, rootOwner);
               }



FilePathExpr = filePath:$([a-zA-Z0-9_$/-]+) {
               return {
                 type: NodeType.FILE_PATH,
                 path: filePath,
               };
             }


/*
 * Any type expressions.
 *
 * Examples:
 *   - *
 *
 * Spec:
 *   - https://developers.google.com/closure/compiler/docs/js-for-compiler#types
 */
AnyTypeExpr = "*" {
              return { type: NodeType.ANY };
            }



/*
 * Unknown type expressions.
 *
 * Examples:
 *   - ?
 *
 * Spec:
 *   - https://developers.google.com/closure/compiler/docs/js-for-compiler#types
 */
UnknownTypeExpr = "?" {
                  return { type: NodeType.UNKNOWN };
                }



/*
 * Value type expressions.
 *
 * Example:
 *   - 123
 *   - 0.0
 *   - -123
 *   - 0b11
 *   - 0o77
 *   - 0cff
 *   - "foo"
 *   - "foo\"bar\nbuz"
 *
 * Spec:
 *   - https://github.com/senchalabs/jsduck/wiki/Type-Definitions#type-names
 */
ValueExpr = StringLiteralExpr / NumberLiteralExpr


StringLiteralExpr = '"' value:$([^\\"] / "\\".)* '"' {
                      return {
                        type: NodeType.STRING_VALUE,
                        string: value.replace(/\\"/g, '"')
                      };
                    }
                  / "'" value:$([^\\'] / "\\".)* "'" {
                      return {
                        type: NodeType.STRING_VALUE,
                        string: value.replace(/\\'/g, "'")
                      };
                    }


NumberLiteralExpr = value:(BinNumberLiteralExpr / OctNumberLiteralExpr / HexNumberLiteralExpr / DecimalNumberLiteralExpr) {
                    return {
                      type: NodeType.NUMBER_VALUE,
                      number: value
                    };
                  }


DecimalNumberLiteralExpr = $("-"? [0-9]+ ("." [0-9]+)?)


BinNumberLiteralExpr = $("-"? "0b"[01]+)


OctNumberLiteralExpr = $("-"? "0o"[0-7]+)


HexNumberLiteralExpr = $("-"? "0x"[0-9a-fA-F]+)



/*
 * Union type expressions.
 *
 * Examples:
 *   - number|undefined
 *   - Foo|Bar|Baz
 */
UnionTypeExpr = left:UnionTypeExprOperand _ syntax:UnionTypeOperator _ right:(UnionTypeExpr / UnionTypeExprOperand) {
                return {
                    type: NodeType.UNION,
                    left: left,
                    right: right,
                    meta: { syntax: syntax },
                };
              }

// https://github.com/senchalabs/jsduck/wiki/Type-Definitions#type-names
UnionTypeOperator = UnionTypeOperatorClosureLibraryFlavored
                  / UnionTypeOperatorJSDuckFlavored


UnionTypeOperatorClosureLibraryFlavored = "|" {
                                          return UnionTypeSyntax.PIPE;
                                        }


UnionTypeOperatorJSDuckFlavored = "/" {
                                  return UnionTypeSyntax.SLASH;
                                }


UnionTypeExprOperand = UnaryUnionTypeExpr
                     / RecordTypeExpr
                     / ArrowTypeExpr
                     / FunctionTypeExpr
                     / ParenthesizedExpr
                     / TypeQueryExpr
                     / GenericTypeExpr
                     / ArrayTypeExpr
                     / BroadNamepathExpr
                     / ValueExpr
                     / AnyTypeExpr
                     / UnknownTypeExpr


UnaryUnionTypeExpr = SuffixUnaryUnionTypeExpr
                   / PrefixUnaryUnionTypeExpr


PrefixUnaryUnionTypeExpr = PrefixOptionalTypeExpr
                         / PrefixNotNullableTypeExpr
                         / PrefixNullableTypeExpr


PrefixUnaryUnionTypeExprOperand = GenericTypeExpr
                                / RecordTypeExpr
                                / ArrowTypeExpr
                                / FunctionTypeExpr
                                / ParenthesizedExpr
                                / BroadNamepathExpr
                                / ValueExpr
                                / AnyTypeExpr
                                / UnknownTypeExpr

TypeQueryExpr = operator:"typeof" _ name:QualifiedMemberName {
                return {
                    type: NodeType.TYPE_QUERY,
                    name: name,
                };
              }

ImportTypeExpr = operator:"import" _ "(" _ path:StringLiteralExpr _ ")" {
                 return { type: NodeType.IMPORT, path: path };
               }

/*
 * Prefix nullable type expressions.
 *
 * Examples:
 *   - ?string
 *
 * Spec:
 *   - https://developers.google.com/closure/compiler/docs/js-for-compiler#types
 */
PrefixNullableTypeExpr = operator:"?" _ operand:PrefixUnaryUnionTypeExprOperand {
                         return {
                           type: NodeType.NULLABLE,
                           value: operand,
                           meta: { syntax: NullableTypeSyntax.PREFIX_QUESTION_MARK },
                         };
                       }



/*
 * Prefix not nullable type expressions.
 *
 * Examples:
 *   - !Object
 *
 * Spec:
 *   - https://developers.google.com/closure/compiler/docs/js-for-compiler#types
 */
PrefixNotNullableTypeExpr = operator:"!" _ operand:PrefixUnaryUnionTypeExprOperand {
                            return {
                              type: NodeType.NOT_NULLABLE,
                              value: operand,
                              meta: { syntax: NotNullableTypeSyntax.PREFIX_BANG },
                            };
                          }



/*
 * Suffix optional type expressions.
 * This expression is deprecated.
 *
 * Examples:
 *   - =string (deprecated)
 */
PrefixOptionalTypeExpr = operator:"=" _ operand:PrefixUnaryUnionTypeExprOperand {
                         return {
                           type: NodeType.OPTIONAL,
                           value: operand,
                           meta: { syntax: OptionalTypeSyntax.PREFIX_EQUALS_SIGN },
                         };
                       }



SuffixUnaryUnionTypeExpr = SuffixOptionalTypeExpr
                         / SuffixNullableTypeExpr
                         / SuffixNotNullableTypeExpr


SuffixUnaryUnionTypeExprOperand = PrefixUnaryUnionTypeExpr
                                / GenericTypeExpr
                                / RecordTypeExpr
                                / ArrowTypeExpr
                                / FunctionTypeExpr
                                / ParenthesizedExpr
                                / BroadNamepathExpr
                                / ValueExpr
                                / AnyTypeExpr
                                / UnknownTypeExpr


/*
 * Suffix nullable type expressions.
 * This expression is deprecated.
 *
 * Examples:
 *   - string? (deprecated)
 *
 * Note:
 *   Deprecated optional type operators can be placed before optional operators.
 *   See https://github.com/google/closure-library/blob/
 *     47f9c92bb4c7de9a3d46f9921a427402910073fb/closure/goog/net/tmpnetwork.js#L50
 */
SuffixNullableTypeExpr = operand:SuffixUnaryUnionTypeExprOperand _ operator:"?" {
                         return {
                           type: NodeType.NULLABLE,
                           value: operand,
                           meta: { syntax: NullableTypeSyntax.SUFFIX_QUESTION_MARK },
                         };
                       }



/*
 * Suffix not nullable type expressions.
 * This expression is deprecated.
 *
 * Examples:
 *   - Object! (deprecated)
 */
SuffixNotNullableTypeExpr = operand:SuffixUnaryUnionTypeExprOperand _ operator:"!" {
                            return {
                              type: NodeType.NOT_NULLABLE,
                              value: operand,
                              meta: { syntax: NotNullableTypeSyntax.SUFFIX_BANG },
                            };
                          }



/*
 * Suffix optional type expressions.
 *
 * Examples:
 *   - string=
 *
 * Spec:
 *   - https://developers.google.com/closure/compiler/docs/js-for-compiler#types
 */
SuffixOptionalTypeExpr = operand:( SuffixNullableTypeExpr
                                 / SuffixNotNullableTypeExpr
                                 / SuffixUnaryUnionTypeExprOperand
                                 ) _ operator:"=" {
                         return {
                           type: NodeType.OPTIONAL,
                           value: operand,
                           meta: { syntax: OptionalTypeSyntax.SUFFIX_EQUALS_SIGN },
                         };
                       }



/*
 * Generic type expressions.
 *
 * Examples:
 *   - Function<T>
 *   - Array.<string> (Legacy Closure Library style and JSDoc3 style)
 *
 * Spec:
 *   - https://developers.google.com/closure/compiler/docs/js-for-compiler#types
 *   - http://usejsdoc.org/tags-type.html
 */
GenericTypeExpr = operand:GenericTypeExprOperand _ syntax:GenericTypeStartToken _
                  params:GenericTypeExprTypeParamList _ GenericTypeEndToken {
                  return {
                    type: NodeType.GENERIC,
                    subject: operand,
                    objects: params,
                    meta: { syntax: syntax },
                  };
                }


GenericTypeExprOperand = ParenthesizedExpr
                       / BroadNamepathExpr
                       / ValueExpr
                       / AnyTypeExpr
                       / UnknownTypeExpr


GenericTypeExprTypeParamOperand = UnionTypeExpr
                                / UnaryUnionTypeExpr
                                / RecordTypeExpr
                                / ArrowTypeExpr
                                / FunctionTypeExpr
                                / ParenthesizedExpr
                                / ArrayTypeExpr
                                / GenericTypeExpr
                                / TypeQueryExpr
                                / BroadNamepathExpr
                                / ValueExpr
                                / AnyTypeExpr
                                / UnknownTypeExpr


GenericTypeExprTypeParamList = first:GenericTypeExprTypeParamOperand
                               restsWithComma:(_ "," _ GenericTypeExprTypeParamOperand)* {
                               return restsWithComma.reduce(function(params, tokens) {
                                 return params.concat([tokens[3]]);
                               }, [first]);
                             }


GenericTypeStartToken = GenericTypeEcmaScriptFlavoredStartToken
                      / GenericTypeTypeScriptFlavoredStartToken


GenericTypeEcmaScriptFlavoredStartToken = ".<" {
                                          return GenericTypeSyntax.ANGLE_BRACKET_WITH_DOT;
                                        }


GenericTypeTypeScriptFlavoredStartToken = "<" {
                                          return GenericTypeSyntax.ANGLE_BRACKET;
                                        }


GenericTypeEndToken = ">"



/*
 * JSDoc style array of a generic type expressions.
 *
 * Examples:
 *   - string[]
 *   - number[][]
 *
 * Spec:
 *   - https://github.com/senchalabs/jsduck/wiki/Type-Definitions#the-basic-syntax
 */
// TODO: We should care complex type expression like "Some[]![]"
ArrayTypeExpr = operand:ArrayTypeExprOperand brackets:(_ "[" _ "]")+ {
                return brackets.reduce(function(operand) {
                  return {
                    type: NodeType.GENERIC,
                    subject: {
                      type: NodeType.NAME,
                      name: 'Array'
                    },
                    objects: [ operand ],
                    meta: { syntax: GenericTypeSyntax.SQUARE_BRACKET },
                  };
                }, operand);
              }


ArrayTypeExprOperand = UnaryUnionTypeExpr
                     / RecordTypeExpr
                     / ArrowTypeExpr
                     / FunctionTypeExpr
                     / ParenthesizedExpr
                     / GenericTypeExpr
                     / TypeQueryExpr
                     / BroadNamepathExpr
                     / ValueExpr
                     / AnyTypeExpr
                     / UnknownTypeExpr

ArrowTypeExpr = newModifier:"new"? _ paramsPart:ArrowTypeExprParamsList _ "=>" _ returnedTypeNode:FunctionTypeExprReturnableOperand {
                   return {
                     type: NodeType.ARROW,
                     params: paramsPart,
                     returns: returnedTypeNode,
                     new: newModifier
                   };
}

ArrowTypeExprParamsList = "(" _ params:ArrowTypeExprParams _ ")" {
                            return params;
                          }
                        / "(" _ ")" {
                            return [];
                          }
ArrowTypeExprParams = paramsWithComma:(JsIdentifier _ ":" _ FunctionTypeExprParamOperand? _ "," _)* lastParam:VariadicNameExpr {
  return paramsWithComma.reduceRight(function(params, tokens) {
    var param = { type: NodeType.NAMED_PARAMETER, name: tokens[0], typeName: tokens[4] };
    return [param].concat(params);
  }, [lastParam]);
}

VariadicNameExpr = spread:"..."? _ id:JsIdentifier _ ":" _ type:FunctionTypeExprParamOperand? _ ","? {
  var operand = { type: NodeType.NAMED_PARAMETER, name: id, typeName: type };
  if (spread) {
  return {
    type: NodeType.VARIADIC,
    value: operand,
    meta: { syntax: VariadicTypeSyntax.PREFIX_DOTS },
  };
  }
  else {
    return operand;
  }
}

/*
 * Function type expressions.
 *
 * Examples:
 *   - function(string)
 *   - function(string, ...string)
 *   - function():number
 *   - function(this:jQuery):jQuery
 *   - function(new:Error)
 *
 * Spec:
 *   - https://developers.google.com/closure/compiler/docs/js-for-compiler#types
 */
FunctionTypeExpr = "function" _ paramsPart:FunctionTypeExprParamsList _
                   returnedTypePart:(":" _ FunctionTypeExprReturnableOperand)? {
                   var returnedTypeNode = returnedTypePart ? returnedTypePart[2] : null;

                   return {
                     type: NodeType.FUNCTION,
                     params: paramsPart.params,
                     returns: returnedTypeNode,
                     this: paramsPart.modifier.nodeThis,
                     new: paramsPart.modifier.nodeNew,
                   };
                 }


FunctionTypeExprParamsList = "(" _ modifier:FunctionTypeExprModifier _ "," _ params: FunctionTypeExprParams _ ")" {
                               return { params: params, modifier: modifier };
                             }
                           / "(" _ modifier:FunctionTypeExprModifier _ ")" {
                               return { params: [], modifier: modifier };
                             }
                           / "(" _ params:FunctionTypeExprParams _ ")" {
                               return { params: params, modifier: { nodeThis: null, nodeNew: null } };
                             }
                           / "(" _ ")" {
                               return { params: [], modifier: { nodeThis: null, nodeNew: null } };
                             }


// We can specify either "this:" or "new:".
// See https://github.com/google/closure-compiler/blob/
//       91cf3603d5b0b0dc289ba73adcd0f2741aa90d89/src/
//       com/google/javascript/jscomp/parsing/JsDocInfoParser.java#L2158-L2171
FunctionTypeExprModifier = modifierThis:("this" _ ":" _ FunctionTypeExprParamOperand) {
                             return { nodeThis: modifierThis[4], nodeNew: null };
                           }
                         / modifierNew:("new" _ ":" _ FunctionTypeExprParamOperand) {
                             return { nodeThis: null, nodeNew: modifierNew[4] };
                           }


FunctionTypeExprParams = paramsWithComma:(FunctionTypeExprParamOperand _ "," _)*
                         // Variadic type is only allowed on the last parameter.
                         lastParam:(VariadicTypeExpr / VariadicTypeExprOperand) {
                         return paramsWithComma.reduceRight(function(params, tokens) {
                           var param = tokens[0];
                           return [param].concat(params);
                         }, [lastParam]);
                       }


FunctionTypeExprParamOperand = UnionTypeExpr
                             / TypeQueryExpr
                             / UnaryUnionTypeExpr
                             / RecordTypeExpr
                             / ArrowTypeExpr
                             / FunctionTypeExpr
                             / ParenthesizedExpr
                             / ArrayTypeExpr
                             / GenericTypeExpr
                             / BroadNamepathExpr
                             / ValueExpr
                             / AnyTypeExpr
                             / UnknownTypeExpr


FunctionTypeExprReturnableOperand = PrefixUnaryUnionTypeExpr
                                  // Suffix unary union type operators should not be
                                  // placed here to keep operator precedence. For example,
                                  // "Foo|function():Returned=" should be parsed as
                                  // "(Foo|function():Returned)=" instead of
                                  // "Foo|(function():Returned=)". This result was expected
                                  // by Closure Library.
                                  //
                                  // See https://github.com/google/closure-library/blob/
                                  //   47f9c92bb4c7de9a3d46f9921a427402910073fb/
                                  //   closure/goog/ui/zippy.js#L47
                                  / RecordTypeExpr
                                  / ArrowTypeExpr
                                  / FunctionTypeExpr
                                  / ParenthesizedExpr
                                  / ArrayTypeExpr
                                  / TypeQueryExpr
                                  / GenericTypeExpr
                                  / BroadNamepathExpr
                                  / ValueExpr
                                  / AnyTypeExpr
                                  / UnknownTypeExpr



/*
 * Record type expressions.
 *
 * Examples:
 *   - {}
 *   - {length}
 *   - {length:number}
 *   - {toString:Function,valueOf:Function}
 *   - {'foo':*}
 *
 * Spec:
 *   - https://developers.google.com/closure/compiler/docs/js-for-compiler#types
 */
RecordTypeExpr = "{" _ entries:RecordTypeExprEntries? _ "}" {
                 return {
                   type: NodeType.RECORD,
                   entries: entries || [],
                 };
               }


RecordTypeExprEntries = first:RecordTypeExprEntry restWithComma:(_ "," _ RecordTypeExprEntry)* {
                        return restWithComma.reduce(function(entries, tokens) {
                          var entry = tokens[3];
                          return entries.concat([entry]);
                        }, [first]);
                      }


RecordTypeExprEntry = key:RecordTypeExprEntryKey _ ":" _ value:RecordTypeExprEntryOperand {
                        return {
                          type: NodeType.RECORD_ENTRY,
                          key: key,
                          value: value
                        };
                      }
                    / key:RecordTypeExprEntryKey {
                        return {
                          type: NodeType.RECORD_ENTRY,
                          key: key,
                          value: null,
                        };
                      }


RecordTypeExprEntryKey = '"' key:$([^"]*) '"' {
                           return key;
                         }
                       / "'" key:$([^']*) "'" {
                           return key;
                         }
                       / $([a-zA-Z0-9_$]+)


RecordTypeExprEntryOperand = UnionTypeExpr
                           / UnaryUnionTypeExpr
                           / RecordTypeExpr
                           / ArrowTypeExpr
                           / FunctionTypeExpr
                           / ParenthesizedExpr
                           / ArrayTypeExpr
                           / GenericTypeExpr
                           / BroadNamepathExpr
                           / ValueExpr
                           / AnyTypeExpr
                           / UnknownTypeExpr



/*
 * Parenthesis expressions.
 *
 * Examples:
 *   - (Foo|Bar)
 *   - (module: path/to/file).Module
 *
 * Spec:
 *   - https://developers.google.com/closure/compiler/docs/js-for-compiler#types
 */
ParenthesizedExpr = "(" _ wrapped:ParenthesizedExprOperand _ ")" {
                    return {
                      type: NodeType.PARENTHESIS,
                      value: wrapped,
                    };
                  }


ParenthesizedExprOperand = UnionTypeExpr
                         / UnaryUnionTypeExpr
                         / RecordTypeExpr
                         / ArrowTypeExpr
                         / FunctionTypeExpr
                         / ArrayTypeExpr
                         / TypeQueryExpr
                         / GenericTypeExpr
                         / BroadNamepathExpr
                         / ValueExpr
                         / AnyTypeExpr
                         / UnknownTypeExpr



/*
 * Variadic type expressions.
 *
 * Examples:
 *   - ...string (only allow on the top level or the last function parameter)
 *   - string... (only allow on the top level)
 *   - ...
 *
 * Note:
 *   It seems that we can omit the operand.
 *   See https://github.com/google/closure-library/blob/
 *       47f9c92bb4c7de9a3d46f9921a427402910073fb/
 *       closure/goog/base.js#L1847
 *
 * Spec:
 *   - https://developers.google.com/closure/compiler/docs/js-for-compiler#types
 *   - https://github.com/senchalabs/jsduck/wiki/Type-Definitions
 */
VariadicTypeExpr = PrefixVariadicTypeExpr
                 / SuffixVariadicTypeExpr
                 / AnyVariadicTypeExpr


PrefixVariadicTypeExpr = "..." operand:VariadicTypeExprOperand {
                         return {
                           type: NodeType.VARIADIC,
                           value: operand,
                           meta: { syntax: VariadicTypeSyntax.PREFIX_DOTS },
                         };
                       }


SuffixVariadicTypeExpr = operand:VariadicTypeExprOperand "..." {
                         return {
                           type: NodeType.VARIADIC,
                           value: operand,
                           meta: { syntax: VariadicTypeSyntax.SUFFIX_DOTS },
                         };
                       }


AnyVariadicTypeExpr = "..." {
                      return {
                        type: NodeType.VARIADIC,
                        value: null,
                        meta: { syntax: VariadicTypeSyntax.ONLY_DOTS },
                      };
                    }


VariadicTypeExprOperand = UnionTypeExpr
                        / UnaryUnionTypeExpr
                        / RecordTypeExpr
                        / ArrowTypeExpr
                        / FunctionTypeExpr
                        / ParenthesizedExpr
                        / TypeQueryExpr
                        / ArrayTypeExpr
                        / GenericTypeExpr
                        / BroadNamepathExpr
                        / ValueExpr
                        / AnyTypeExpr
                        / UnknownTypeExpr
