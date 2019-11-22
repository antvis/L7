'use strict';

var chai = require('chai');
var expect = chai.expect;

var NodeType = require('../lib/NodeType.js');
var SyntaxType = require('../lib/SyntaxType.js');
var GenericTypeSyntax = SyntaxType.GenericTypeSyntax;
var UnionTypeSyntax = SyntaxType.UnionTypeSyntax;
var VariadicTypeSyntax = SyntaxType.VariadicTypeSyntax;
var OptionalTypeSyntax = SyntaxType.OptionalTypeSyntax;
var NullableTypeSyntax = SyntaxType.NullableTypeSyntax;
var NotNullableTypeSyntax = SyntaxType.NotNullableTypeSyntax;
var Parser = require('../lib/parsing.js');


describe('Parser', function() {
  it('should return a type name node when "TypeName" arrived', function() {
    var typeExprStr = 'TypeName';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createTypeNameNode(typeExprStr);
    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a type name node when "my-type" arrived', function() {
    var typeExprStr = 'my-type';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createTypeNameNode(typeExprStr);
    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a type name node when "$" arrived', function() {
    var typeExprStr = '$';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createTypeNameNode(typeExprStr);
    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a type name node when "_" arrived', function() {
    var typeExprStr = '_';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createTypeNameNode(typeExprStr);
    expect(node).to.deep.equal(expectedNode);
  });


  it('should return an any type node when "*" arrived', function() {
    var typeExprStr = '*';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createAnyTypeNode();
    expect(node).to.deep.equal(expectedNode);
  });


  it('should return an unknown type node when "?" arrived', function() {
    var typeExprStr = '?';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createUnknownTypeNode();
    expect(node).to.deep.equal(expectedNode);
  });


  it('should return an optional unknown type node when "?=" arrived', function() {
    var typeExprStr = '?=';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createOptionalTypeNode(
      createUnknownTypeNode(),
      OptionalTypeSyntax.SUFFIX_EQUALS_SIGN
    );
    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a module name node when "module:path/to/file" arrived', function() {
    var typeExprStr = 'module:path/to/file';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createModuleNameNode(createFilePathNode('path/to/file'));
    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a module name node when "module : path/to/file" arrived', function() {
    var typeExprStr = 'module : path/to/file';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createModuleNameNode(createFilePathNode('path/to/file'));
    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a member node when "(module:path/to/file).member" arrived', function() {
    var typeExprStr = '(module:path/to/file).member';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createMemberTypeNode(
      createParenthesizedNode(
        createModuleNameNode(createFilePathNode('path/to/file'))
      ),
      'member'
    );
    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a member node when "module:path/to/file.member" arrived', function() {
    var typeExprStr = 'module:path/to/file.member';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createModuleNameNode(
      createMemberTypeNode(createFilePathNode('path/to/file'), 'member')
    );
    expect(node).to.deep.equal(expectedNode);
  });

  it('should return a member node when "module:path/to/file.event:member" arrived', function() {
    var typeExprStr = 'module:path/to/file.event:member';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createModuleNameNode(
      createMemberTypeNode(createFilePathNode('path/to/file'), 'member', true)
    );
    expect(node).to.deep.equal(expectedNode);
  });

  it('should return a member type node when "owner.event:Member" arrived', function() {
    var typeExprStr = 'owner.event:Member';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createMemberTypeNode(
      createTypeNameNode('owner'),
      'Member',
      true);

    expect(node).to.deep.equal(expectedNode);
  });

  it('should return a module name node when "external:string" arrived', function() {
    var typeExprStr = 'external:string';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createExternalNameNode(createTypeNameNode('string'));
    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a module name node when "external : String#rot13" arrived', function() {
    var typeExprStr = 'external : String#rot13';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createExternalNameNode(
      createInstanceMemberTypeNode(createTypeNameNode('String'), 'rot13'));
    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a member type node when "owner.Member" arrived', function() {
    var typeExprStr = 'owner.Member';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createMemberTypeNode(
      createTypeNameNode('owner'),
      'Member');

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a member type node when "owner . Member" arrived', function() {
    var typeExprStr = 'owner . Member';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createMemberTypeNode(
      createTypeNameNode('owner'),
      'Member');

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a member type node when "superOwner.owner.Member" arrived', function() {
    var typeExprStr = 'superOwner.owner.Member';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createMemberTypeNode(
        createMemberTypeNode(
          createTypeNameNode('superOwner'), 'owner'),
        'Member');

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a member type node when "superOwner.owner.Member=" arrived', function() {
    var typeExprStr = 'superOwner.owner.Member=';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createOptionalTypeNode(
      createMemberTypeNode(
        createMemberTypeNode(
          createTypeNameNode('superOwner'),
        'owner'),
      'Member'),
      OptionalTypeSyntax.SUFFIX_EQUALS_SIGN
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return an inner member type node when "owner~innerMember" arrived', function() {
    var typeExprStr = 'owner~innerMember';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createInnerMemberTypeNode(
      createTypeNameNode('owner'),
      'innerMember');

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return an inner member type node when "owner ~ innerMember" arrived', function() {
    var typeExprStr = 'owner ~ innerMember';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createInnerMemberTypeNode(
      createTypeNameNode('owner'),
      'innerMember');

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return an inner member type node when "superOwner~owner~innerMember" ' +
     'arrived', function() {
    var typeExprStr = 'superOwner~owner~innerMember';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createInnerMemberTypeNode(
        createInnerMemberTypeNode(
          createTypeNameNode('superOwner'), 'owner'),
        'innerMember');

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return an inner member type node when "superOwner~owner~innerMember=" ' +
     'arrived', function() {
    var typeExprStr = 'superOwner~owner~innerMember=';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createOptionalTypeNode(
      createInnerMemberTypeNode(
        createInnerMemberTypeNode(
          createTypeNameNode('superOwner'),
        'owner'),
      'innerMember'),
      OptionalTypeSyntax.SUFFIX_EQUALS_SIGN
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return an instance member type node when "owner#instanceMember" arrived', function() {
    var typeExprStr = 'owner#instanceMember';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createInstanceMemberTypeNode(
      createTypeNameNode('owner'),
      'instanceMember');

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return an instance member type node when "owner # instanceMember" ' +
     'arrived', function() {
    var typeExprStr = 'owner # instanceMember';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createInstanceMemberTypeNode(
      createTypeNameNode('owner'),
      'instanceMember');

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return an instance member type node when "superOwner#owner#instanceMember" ' +
     'arrived', function() {
    var typeExprStr = 'superOwner#owner#instanceMember';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createInstanceMemberTypeNode(
        createInstanceMemberTypeNode(
          createTypeNameNode('superOwner'), 'owner'),
        'instanceMember');

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return an instance member type node when "superOwner#owner#instanceMember=" ' +
     'arrived', function() {
    var typeExprStr = 'superOwner#owner#instanceMember=';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createOptionalTypeNode(
      createInstanceMemberTypeNode(
        createInstanceMemberTypeNode(
          createTypeNameNode('superOwner'),
        'owner'),
      'instanceMember'),
      OptionalTypeSyntax.SUFFIX_EQUALS_SIGN
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return an union type when "LeftType|RightType" arrived', function() {
    var typeExprStr = 'LeftType|RightType';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createUnionTypeNode(
      createTypeNameNode('LeftType'),
      createTypeNameNode('RightType'),
      UnionTypeSyntax.PIPE
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return an union type when "LeftType|MiddleType|RightType" arrived', function() {
    var typeExprStr = 'LeftType|MiddleType|RightType';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createUnionTypeNode(
      createTypeNameNode('LeftType'),
      createUnionTypeNode(
        createTypeNameNode('MiddleType'),
        createTypeNameNode('RightType'),
        UnionTypeSyntax.PIPE
      ), UnionTypeSyntax.PIPE);

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return an union type when "(LeftType|RightType)" arrived', function() {
    var typeExprStr = '(LeftType|RightType)';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createParenthesizedNode(
      createUnionTypeNode(
        createTypeNameNode('LeftType'),
        createTypeNameNode('RightType')
      )
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return an union type when "( LeftType | RightType )" arrived', function() {
    var typeExprStr = '( LeftType | RightType )';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createParenthesizedNode(
      createUnionTypeNode(
        createTypeNameNode('LeftType'),
        createTypeNameNode('RightType')
      )
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return an union type when "LeftType/RightType" arrived', function() {
    var typeExprStr = 'LeftType/RightType';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createUnionTypeNode(
      createTypeNameNode('LeftType'),
      createTypeNameNode('RightType'),
      UnionTypeSyntax.SLASH
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a record type node when "{}" arrived', function() {
    var typeExprStr = '{}';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createRecordTypeNode([]);

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a record type node when "{key:ValueType}" arrived', function() {
    var typeExprStr = '{key:ValueType}';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createRecordTypeNode([
      createRecordEntryNode('key', createTypeNameNode('ValueType')),
    ]);

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a record type node when "{keyOnly}" arrived', function() {
    var typeExprStr = '{keyOnly}';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createRecordTypeNode([
      createRecordEntryNode('keyOnly', null),
    ]);

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a record type node when "{key1:ValueType1,key2:ValueType2}"' +
     ' arrived', function() {
    var typeExprStr = '{key1:ValueType1,key2:ValueType2}';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createRecordTypeNode([
      createRecordEntryNode('key1', createTypeNameNode('ValueType1')),
      createRecordEntryNode('key2', createTypeNameNode('ValueType2')),
    ]);

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a record type node when "{key:ValueType1,keyOnly}"' +
     ' arrived', function() {
    var typeExprStr = '{key:ValueType1,keyOnly}';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createRecordTypeNode([
      createRecordEntryNode('key', createTypeNameNode('ValueType1')),
      createRecordEntryNode('keyOnly', null),
    ]);

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a record type node when "{ key1 : ValueType1 , key2 : ValueType2 }"' +
     ' arrived', function() {
    var typeExprStr = '{ key1 : ValueType1 , key2 : ValueType2 }';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createRecordTypeNode([
      createRecordEntryNode('key1', createTypeNameNode('ValueType1')),
      createRecordEntryNode('key2', createTypeNameNode('ValueType2')),
    ]);

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a record type node when "{\'quoted-key\':ValueType}"' +
     ' arrived', function() {
    var typeExprStr = '{\'quoted-key\':ValueType}';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createRecordTypeNode([
      createRecordEntryNode('quoted-key', createTypeNameNode('ValueType')),
    ]);

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a generic type node when "Generic<ParamType>" arrived', function() {
    var typeExprStr = 'Generic<ParamType>';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createGenericTypeNode(
      createTypeNameNode('Generic'), [
        createTypeNameNode('ParamType'),
    ], GenericTypeSyntax.ANGLE_BRACKET);

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a generic type node when "Generic<Inner<ParamType>>" arrived', function() {
    var typeExprStr = 'Generic<Inner<ParamType>>';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createGenericTypeNode(
      createTypeNameNode('Generic'), [
        createGenericTypeNode(
          createTypeNameNode('Inner'), [ createTypeNameNode('ParamType') ]
        ),
    ], GenericTypeSyntax.ANGLE_BRACKET);

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a generic type node when "Generic<ParamType1,ParamType2>"' +
     ' arrived', function() {
    var typeExprStr = 'Generic<ParamType1,ParamType2>';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createGenericTypeNode(
      createTypeNameNode('Generic'), [
        createTypeNameNode('ParamType1'),
        createTypeNameNode('ParamType2'),
      ], GenericTypeSyntax.ANGLE_BRACKET);

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a generic type node when "Generic < ParamType1 , ParamType2 >"' +
     ' arrived', function() {
    var typeExprStr = 'Generic < ParamType1, ParamType2 >';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createGenericTypeNode(
      createTypeNameNode('Generic'), [
        createTypeNameNode('ParamType1'),
        createTypeNameNode('ParamType2'),
      ], GenericTypeSyntax.ANGLE_BRACKET);

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a generic type node when "Generic.<ParamType>" arrived', function() {
    var typeExprStr = 'Generic.<ParamType>';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createGenericTypeNode(
      createTypeNameNode('Generic'), [
        createTypeNameNode('ParamType'),
    ], GenericTypeSyntax.ANGLE_BRACKET_WITH_DOT);

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a generic type node when "Generic.<ParamType1,ParamType2>"' +
     ' arrived', function() {
    var typeExprStr = 'Generic.<ParamType1,ParamType2>';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createGenericTypeNode(
      createTypeNameNode('Generic'), [
        createTypeNameNode('ParamType1'),
        createTypeNameNode('ParamType2'),
      ], GenericTypeSyntax.ANGLE_BRACKET_WITH_DOT);

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a generic type node when "Generic .< ParamType1 , ParamType2 >"' +
     ' arrived', function() {
    var typeExprStr = 'Generic .< ParamType1 , ParamType2 >';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createGenericTypeNode(
      createTypeNameNode('Generic'), [
        createTypeNameNode('ParamType1'),
        createTypeNameNode('ParamType2'),
      ], GenericTypeSyntax.ANGLE_BRACKET_WITH_DOT);

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a generic type node when "ParamType[]" arrived', function() {
    var typeExprStr = 'ParamType[]';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createGenericTypeNode(
      createTypeNameNode('Array'), [
        createTypeNameNode('ParamType'),
      ], GenericTypeSyntax.SQUARE_BRACKET);

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a generic type node when "ParamType[][]" arrived', function() {
    var typeExprStr = 'ParamType[][]';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createGenericTypeNode(
      createTypeNameNode('Array'), [
        createGenericTypeNode(
          createTypeNameNode('Array'), [
            createTypeNameNode('ParamType'),
        ], GenericTypeSyntax.SQUARE_BRACKET),
      ], GenericTypeSyntax.SQUARE_BRACKET);

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a generic type node when "ParamType [ ] [ ]" arrived', function() {
    var typeExprStr = 'ParamType [ ] [ ]';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createGenericTypeNode(
      createTypeNameNode('Array'), [
        createGenericTypeNode(
          createTypeNameNode('Array'), [
            createTypeNameNode('ParamType'),
        ], GenericTypeSyntax.SQUARE_BRACKET),
      ], GenericTypeSyntax.SQUARE_BRACKET);

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return an optional type node when "string=" arrived', function() {
    var typeExprStr = 'string=';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createOptionalTypeNode(
      createTypeNameNode('string'),
      OptionalTypeSyntax.SUFFIX_EQUALS_SIGN
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return an optional type node when "=string" arrived (deprecated)', function() {
    var typeExprStr = '=string';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createOptionalTypeNode(
      createTypeNameNode('string'),
      OptionalTypeSyntax.PREFIX_EQUALS_SIGN
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a nullable type node when "?string" arrived', function() {
    var typeExprStr = '?string';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createNullableTypeNode(
      createTypeNameNode('string'),
      NullableTypeSyntax.PREFIX_QUESTION_MARK
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a nullable type node when "string?" arrived (deprecated)', function() {
    var typeExprStr = 'string?';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createNullableTypeNode(
      createTypeNameNode('string'),
      NullableTypeSyntax.SUFFIX_QUESTION_MARK
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return an optional type node when "string =" arrived', function() {
    var typeExprStr = 'string =';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createOptionalTypeNode(
      createTypeNameNode('string'),
      OptionalTypeSyntax.SUFFIX_EQUALS_SIGN
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return an optional type node when "= string" arrived (deprecated)', function() {
    var typeExprStr = '= string';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createOptionalTypeNode(
      createTypeNameNode('string'),
      OptionalTypeSyntax.PREFIX_EQUALS_SIGN
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a nullable type node when "? string" arrived', function() {
    var typeExprStr = '? string';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createNullableTypeNode(
      createTypeNameNode('string'),
      NullableTypeSyntax.PREFIX_QUESTION_MARK
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a nullable type node when "string ?" arrived (deprecated)', function() {
    var typeExprStr = 'string ?';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createNullableTypeNode(
      createTypeNameNode('string'),
      NullableTypeSyntax.SUFFIX_QUESTION_MARK
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return an optional type node when "?string=" arrived', function() {
    var typeExprStr = '?string=';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createOptionalTypeNode(
      createNullableTypeNode(
        createTypeNameNode('string'),
        NullableTypeSyntax.PREFIX_QUESTION_MARK
      ),
      OptionalTypeSyntax.SUFFIX_EQUALS_SIGN
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return an optional type node when "string?=" arrived', function() {
    var typeExprStr = 'string?=';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createOptionalTypeNode(
      createNullableTypeNode(
        createTypeNameNode('string'),
        NullableTypeSyntax.SUFFIX_QUESTION_MARK
      ),
      OptionalTypeSyntax.SUFFIX_EQUALS_SIGN
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should throw an error when "?!string" arrived', function() {
    var typeExprStr = '?!string';

    expect(function() {
      Parser.parse(typeExprStr);
    }).to.throw(Parser.SyntaxError);
  });


  it('should throw an error when "!?string" arrived', function() {
    var typeExprStr = '!?string';

    expect(function() {
      Parser.parse(typeExprStr);
    }).to.throw(Parser.SyntaxError);
  });


  it('should return a variadic type node when "...PrefixVariadic" arrived', function() {
    var typeExprStr = '...PrefixVariadic';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createVariadicTypeNode(
      createTypeNameNode('PrefixVariadic'),
      VariadicTypeSyntax.PREFIX_DOTS
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a variadic type node when "SuffixVariadic..." arrived', function() {
    var typeExprStr = 'SuffixVariadic...';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createVariadicTypeNode(
      createTypeNameNode('SuffixVariadic'),
      VariadicTypeSyntax.SUFFIX_DOTS
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a variadic type node when "..." arrived', function() {
    var typeExprStr = '...';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createVariadicTypeNode(
      null,
      VariadicTypeSyntax.ONLY_DOTS
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a variadic type node when "...!Object" arrived', function() {
    var typeExprStr = '...!Object';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createVariadicTypeNode(
      createNotNullableTypeNode(
        createTypeNameNode('Object'),
        NotNullableTypeSyntax.PREFIX_BANG
      ),
      VariadicTypeSyntax.PREFIX_DOTS
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a variadic type node when "...?" arrived', function() {
    var typeExprStr = '...?';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createVariadicTypeNode(
      createUnknownTypeNode(),
      VariadicTypeSyntax.PREFIX_DOTS
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a not nullable type node when "!Object" arrived', function() {
    var typeExprStr = '!Object';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createNotNullableTypeNode(
      createTypeNameNode('Object'),
      NotNullableTypeSyntax.PREFIX_BANG
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a not nullable type node when "Object!" arrived', function() {
    var typeExprStr = 'Object!';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createNotNullableTypeNode(
      createTypeNameNode('Object'),
      NotNullableTypeSyntax.SUFFIX_BANG
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a not nullable type node when "! Object" arrived', function() {
    var typeExprStr = '! Object';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createNotNullableTypeNode(
      createTypeNameNode('Object'),
      NotNullableTypeSyntax.PREFIX_BANG
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a not nullable type node when "Object !" arrived', function() {
    var typeExprStr = 'Object !';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createNotNullableTypeNode(
      createTypeNameNode('Object'),
      NotNullableTypeSyntax.SUFFIX_BANG
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a function type node when "function()" arrived', function() {
    var typeExprStr = 'function()';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createFunctionTypeNode(
      [], null,
      { 'this': null, 'new': null }
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a function type node with a param when "function(Param)" arrived', function() {
    var typeExprStr = 'function(Param)';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createFunctionTypeNode(
      [ createTypeNameNode('Param') ], null,
      { 'this': null, 'new': null }
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a function type node with several params when "function(Param1,Param2)"' +
     ' arrived', function() {
    var typeExprStr = 'function(Param1,Param2)';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createFunctionTypeNode(
      [ createTypeNameNode('Param1'), createTypeNameNode('Param2') ], null,
      { 'this': null, 'new': null }
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a function type node with variadic params when "function(...VariadicParam)"' +
     ' arrived', function() {
    var typeExprStr = 'function(...VariadicParam)';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createFunctionTypeNode(
      [
        createVariadicTypeNode(
          createTypeNameNode('VariadicParam'),
          VariadicTypeSyntax.PREFIX_DOTS
        ),
      ],
      null, { 'this': null, 'new': null }
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a function type node with variadic params when "function(Param,...VariadicParam)"' +
     ' arrived', function() {
    var typeExprStr = 'function(Param,...VariadicParam)';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createFunctionTypeNode(
      [
        createTypeNameNode('Param'),
        createVariadicTypeNode(
          createTypeNameNode('VariadicParam'),
          VariadicTypeSyntax.PREFIX_DOTS
        ),
      ],
      null, { 'this': null, 'new': null }
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should throw an error when "function(...VariadicParam, UnexpectedLastParam)"' +
     ' arrived', function() {
    var typeExprStr = 'function(...VariadicParam, UnexpectedLastParam)';

    expect(function() {
      Parser.parse(typeExprStr);
    }).to.throw(Parser.SyntaxError);
  });


  it('should return a function type node with returns when "function():Returned"' +
     ' arrived', function() {
    var typeExprStr = 'function():Returned';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createFunctionTypeNode(
      [], createTypeNameNode('Returned'),
      { 'this': null, 'new': null }
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a function type node with a context type when "function(this:ThisObject)"' +
     ' arrived', function() {
    var typeExprStr = 'function(this:ThisObject)';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createFunctionTypeNode(
      [], null,
      { 'this': createTypeNameNode('ThisObject'), 'new': null }
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a function type node with a context type when ' +
     '"function(this:ThisObject, param1)" arrived', function() {
    var typeExprStr = 'function(this:ThisObject, param1)';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createFunctionTypeNode(
      [createTypeNameNode('param1')],
      null,
      { 'this': createTypeNameNode('ThisObject'), 'new': null }
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a function type node as a constructor when "function(new:NewObject)"' +
     ' arrived', function() {
    var typeExprStr = 'function(new:NewObject)';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createFunctionTypeNode(
      [], null,
      { 'this': null, 'new': createTypeNameNode('NewObject') }
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a function type node as a constructor when ' +
     '"function(new:NewObject, param1)" arrived', function() {
    var typeExprStr = 'function(new:NewObject, param1)';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createFunctionTypeNode(
      [createTypeNameNode('param1')],
      null,
      { 'this': null, 'new': createTypeNameNode('NewObject') }
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should throw an error when "function(new:NewObject, this:ThisObject)" ' +
     'arrived', function() {
    var typeExprStr = 'function(new:NewObject, this:ThisObject)';

    expect(function() {
      Parser.parse(typeExprStr);
    }).to.throw(Parser.SyntaxError);
  });


  it('should throw an error when "function(this:ThisObject, new:NewObject)" ' +
     'arrived', function() {
    var typeExprStr = 'function(this:ThisObject, new:NewObject)';

    expect(function() {
      Parser.parse(typeExprStr);
    }).to.throw(Parser.SyntaxError);
  });


  it('should return a function type node when "function( Param1 , Param2 ) : Returned"' +
     ' arrived', function() {
    var typeExprStr = 'function( Param1 , Param2 ) : Returned';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createFunctionTypeNode(
      [ createTypeNameNode('Param1'), createTypeNameNode('Param2') ],
      createTypeNameNode('Returned'),
      { 'this': null, 'new': null }
    );

    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a number value type node when "0123456789" arrived', function() {
    var typeExprStr = '0123456789';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createNumberValueNode(typeExprStr);
    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a number value type node when "0.0" arrived', function() {
    var typeExprStr = '0.0';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createNumberValueNode(typeExprStr);
    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a number value type node when "-0" arrived', function() {
    var typeExprStr = '-0';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createNumberValueNode(typeExprStr);
    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a number value type node when "0b01" arrived', function() {
    var typeExprStr = '0b01';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createNumberValueNode(typeExprStr);
    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a number value type node when "0o01234567" arrived', function() {
    var typeExprStr = '0o01234567';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createNumberValueNode(typeExprStr);
    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a number value type node when "0x0123456789abcdef" arrived', function() {
    var typeExprStr = '0x0123456789abcdef';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createNumberValueNode(typeExprStr);
    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a string value type node when \'""\' arrived', function() {
    var typeExprStr = '""';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createStringValueNode('');
    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a string value type node when \'"string"\' arrived', function() {
    var typeExprStr = '"string"';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createStringValueNode('string');
    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a string value type node when \'"マルチバイト"\' arrived', function() {
    var typeExprStr = '"マルチバイト"';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createStringValueNode('マルチバイト');
    expect(node).to.deep.equal(expectedNode);
  });


  it('should return a string value type node when \'"\\n\\"\\t"\' arrived', function() {
    var typeExprStr = '"\\n\\"\\t"';
    var node = Parser.parse(typeExprStr);

    var expectedNode = createStringValueNode('\\n"\\t');
    expect(node).to.deep.equal(expectedNode);
  });


  it('should throw a syntax error when "" arrived', function() {
    var typeExprStr = '';

    expect(function() {
      Parser.parse(typeExprStr);
    }).to.throw(Parser.SyntaxError);
  });


  it('should throw a syntax error when "Invalid type" arrived', function() {
    var typeExprStr = 'Invalid type';

    expect(function() {
      Parser.parse(typeExprStr);
    }).to.throw(Parser.SyntaxError);
  });


  it('should throw a syntax error when "Promise*Error" arrived', function() {
    var typeExprStr = 'Promise*Error';

    expect(function() {
      Parser.parse(typeExprStr);
    }).to.throw(Parser.SyntaxError);
  });


  it('should throw a syntax error when "(unclosedParenthesis, " arrived', function() {
    var typeExprStr = '(unclosedParenthesis, ';

    expect(function() {
      Parser.parse(typeExprStr);
    }).to.throw(Parser.SyntaxError);
  });


  describe('operator precedence', function() {
    context('when "Foo|function():Returned?" arrived', function() {
      it('should parse as "Foo|((function():Returned)?)"', function() {
        var typeExprStr = 'Foo|function():Returned?';
        var node = Parser.parse(typeExprStr);

        var expectedNode = createUnionTypeNode(
          createTypeNameNode('Foo'),
          createNullableTypeNode(
            createFunctionTypeNode(
              [],
              createTypeNameNode('Returned'),
            { 'this': null, 'new': null }
            ),
            NullableTypeSyntax.SUFFIX_QUESTION_MARK
          ),
          UnionTypeSyntax.PIPE
        );

        expect(node).to.deep.equal(expectedNode);
      });
    });
  });
});


function createTypeNameNode(typeName) {
  return {
    type: NodeType.NAME,
    name: typeName,
  };
}

function createAnyTypeNode() {
  return {
    type: NodeType.ANY,
  };
}

function createUnknownTypeNode() {
  return {
    type: NodeType.UNKNOWN,
  };
}

function createModuleNameNode(value) {
  return {
    type: NodeType.MODULE,
    value: value,
  };
}

function createExternalNameNode(value) {
  return {
    type: NodeType.EXTERNAL,
    value: value,
  };
}

function createOptionalTypeNode(optionalTypeExpr, syntax) {
  return {
    type: NodeType.OPTIONAL,
    value: optionalTypeExpr,
    meta: { syntax: syntax },
  };
}

function createNullableTypeNode(nullableTypeExpr, syntax) {
  return {
    type: NodeType.NULLABLE,
    value: nullableTypeExpr,
    meta: { syntax: syntax },
  };
}

function createNotNullableTypeNode(nullableTypeExpr, syntax) {
  return {
    type: NodeType.NOT_NULLABLE,
    value: nullableTypeExpr,
    meta: { syntax: syntax },
  };
}

function createMemberTypeNode(ownerTypeExpr, memberTypeName, hasEventPrefix) {
  return {
    type: NodeType.MEMBER,
    owner: ownerTypeExpr,
    name: memberTypeName,
    hasEventPrefix: hasEventPrefix || false,
  };
}

function createInnerMemberTypeNode(ownerTypeExpr, memberTypeName, hasEventPrefix) {
  return {
    type: NodeType.INNER_MEMBER,
    owner: ownerTypeExpr,
    name: memberTypeName,
    hasEventPrefix: hasEventPrefix || false,
  };
}

function createInstanceMemberTypeNode(ownerTypeExpr, memberTypeName, hasEventPrefix) {
  return {
    type: NodeType.INSTANCE_MEMBER,
    owner: ownerTypeExpr,
    name: memberTypeName,
    hasEventPrefix: hasEventPrefix || false,
  };
}

function createUnionTypeNode(leftTypeExpr, rightTypeExpr, syntax) {
  return {
    type: NodeType.UNION,
    left: leftTypeExpr,
    right: rightTypeExpr,
    meta: { syntax: syntax || UnionTypeSyntax.PIPE },
  };
}

function createVariadicTypeNode(variadicTypeExpr, syntax) {
  return {
    type: NodeType.VARIADIC,
    value: variadicTypeExpr,
    meta: { syntax: syntax },
  };
}

function createRecordTypeNode(recordEntries) {
  return {
    type: NodeType.RECORD,
    entries: recordEntries,
  };
}

function createRecordEntryNode(key, valueTypeExpr) {
  return {
    type: NodeType.RECORD_ENTRY,
    key: key,
    value: valueTypeExpr,
  };
}

function createGenericTypeNode(genericTypeName, paramExprs, syntaxType) {
  return {
    type: NodeType.GENERIC,
    subject: genericTypeName,
    objects: paramExprs,
    meta: { syntax: syntaxType || GenericTypeSyntax.ANGLE_BRACKET },
  };
}

function createFunctionTypeNode(paramNodes, returnedNode, modifierMap) {
  return {
    type: NodeType.FUNCTION,
    params: paramNodes,
    returns: returnedNode,
    this: modifierMap.this,
    new: modifierMap.new,
  };
}

function createNumberValueNode(numberLiteral) {
  return {
    type: NodeType.NUMBER_VALUE,
    number: numberLiteral,
  };
}

function createStringValueNode(stringLiteral) {
  return {
    type: NodeType.STRING_VALUE,
    string: stringLiteral,
  };
}

function createFilePathNode(filePath) {
  return {
    type: NodeType.FILE_PATH,
    path: filePath,
  };
}

function createParenthesizedNode(value) {
  return {
    type: NodeType.PARENTHESIS,
    value: value,
  };
}
