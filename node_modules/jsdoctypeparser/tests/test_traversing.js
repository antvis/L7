'use strict';

var chai = require('chai');
var expect = chai.expect;
var NodeType = require('../lib/NodeType.js');
var traverse = require('../lib/traversing.js').traverse;


describe('traversing', function() {
  var testCases = {
    'should visit a name node': {
      given: createNameNode('name'),
      then: [
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
      ],
    },

    'should visit a member node': {
      given: createMemberNode('child', createNameNode('owner')),
      then: [
        ['enter', NodeType.MEMBER],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['leave', NodeType.MEMBER],
      ],
    },

    'should visit a nested member node': {
      given: createMemberNode('superchild', createMemberNode('child', createNameNode('owner'))),
      then: [
        ['enter', NodeType.MEMBER],
        ['enter', NodeType.MEMBER],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['leave', NodeType.MEMBER],
        ['leave', NodeType.MEMBER],
      ],
    },

    'should visit an union node': {
      given: createUnionNode(createNameNode('left'), createNameNode('right')),
      then: [
        ['enter', NodeType.UNION],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['leave', NodeType.UNION],
      ],
    },

    'should visit a type query node': {
      given: createTypeQueryNode(createNameNode('t')),
      then: [
        ['enter', NodeType.TYPE_QUERY],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['leave', NodeType.TYPE_QUERY],
      ],
    },

    'should visit an import type node': {
      given: createImportNode(createStringLiteral('jquery')),
      then: [
        ['enter', NodeType.IMPORT],
        ['enter', NodeType.STRING_VALUE],
        ['leave', NodeType.STRING_VALUE],
        ['leave', NodeType.IMPORT],
      ],
    },

    'should visit a nested union node': {
      given: createUnionNode(
        createUnionNode(
          createNameNode('left'),
          createNameNode('middle')
        ),
        createNameNode('right')
      ),
      then: [
        ['enter', NodeType.UNION],
        ['enter', NodeType.UNION],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['leave', NodeType.UNION],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['leave', NodeType.UNION],
      ],
    },

    'should visit a variadic node': {
      given: { type: NodeType.VARIADIC, value: createNameNode('variadic') },
      then: [
        ['enter', NodeType.VARIADIC],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['leave', NodeType.VARIADIC],
      ],
    },

    'should visit a record node that is empty': {
      given: {
        type: NodeType.RECORD,
        entries: [],
      },
      then: [
        ['enter', NodeType.RECORD],
        ['leave', NodeType.RECORD],
      ],
    },

    'should visit a record node that has multiple entries': {
      given: {
        type: NodeType.RECORD,
        entries: [
          createRecordEntry('key1', createNameNode('key1')),
          createRecordEntry('key2', createNameNode('key2')),
        ],
      },
      then: [
        ['enter', NodeType.RECORD],
        ['enter', NodeType.RECORD_ENTRY],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['leave', NodeType.RECORD_ENTRY],
        ['enter', NodeType.RECORD_ENTRY],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['leave', NodeType.RECORD_ENTRY],
        ['leave', NodeType.RECORD],
      ],
    },

    'should visit a generic node that is empty': {
      given: {
        type: NodeType.GENERIC,
        subject: createNameNode('subject'),
        objects: [],
      },
      then: [
        ['enter', NodeType.GENERIC],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['leave', NodeType.GENERIC],
      ],
    },

    'should visit a generic node that has multiple objects': {
      given: {
        type: NodeType.GENERIC,
        subject: createNameNode('subject'),
        objects: [
          createNameNode('object1'),
          createNameNode('object2'),
        ],
      },
      then: [
        ['enter', NodeType.GENERIC],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['leave', NodeType.GENERIC],
      ],
    },

    'should visit a module node': {
      given: {
        type: NodeType.MODULE,
        value: createFilePathNode('module'),
      },
      then: [
        ['enter', NodeType.MODULE],
        ['enter', NodeType.FILE_PATH],
        ['leave', NodeType.FILE_PATH],
        ['leave', NodeType.MODULE],
      ],
    },

    'should visit an optional node': {
      given: {
        type: NodeType.OPTIONAL,
        value: createNameNode('optional'),
      },
      then: [
        ['enter', NodeType.OPTIONAL],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['leave', NodeType.OPTIONAL],
      ],
    },

    'should visit a nullable node': {
      given: {
        type: NodeType.NULLABLE,
        value: createNameNode('nullable'),
      },
      then: [
        ['enter', NodeType.NULLABLE],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['leave', NodeType.NULLABLE],
      ],
    },

    'should visit a non-nullable node': {
      given: {
        type: NodeType.NOT_NULLABLE,
        value: createNameNode('not_nullable'),
      },
      then: [
        ['enter', NodeType.NOT_NULLABLE],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['leave', NodeType.NOT_NULLABLE],
      ],
    },

    'should visit a function node that has no params and no returns': {
      given: {
        type: NodeType.FUNCTION,
        params: [],
        returns: null,
        this: null,
        new: null,
      },
      then: [
        ['enter', NodeType.FUNCTION],
        ['leave', NodeType.FUNCTION],
      ],
    },

    'should visit a function node that has few params and a returns and "this" and "new"': {
      given: {
        type: NodeType.FUNCTION,
        params: [
          createNameNode('param1'),
          createNameNode('param2'),
        ],
        returns: createNameNode('return'),
        this: createNameNode('this'),
        new: createNameNode('new'),
      },
      then: [
        ['enter', NodeType.FUNCTION],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['leave', NodeType.FUNCTION],
      ],
    },

    'should visit an arrow function that has two params and a returns': {
      given: {
        type: NodeType.ARROW,
        params: [
          { type: NodeType.NAMED_PARAMETER, name: 'param1', typeName: createNameNode('type1') },
          { type: NodeType.NAMED_PARAMETER, name: 'param2', typeName: createNameNode('type2') },
        ],
        returns: createNameNode('return'),
      },
      then: [
        ['enter', NodeType.ARROW],
        ['enter', NodeType.NAMED_PARAMETER],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['leave', NodeType.NAMED_PARAMETER],
        ['enter', NodeType.NAMED_PARAMETER],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['leave', NodeType.NAMED_PARAMETER],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['leave', NodeType.ARROW],
      ],
    },

    'should visit an arrow function that has one variadic param and a returns': {
      given: {
        type: NodeType.ARROW,
        params: [
          {
            type: NodeType.VARIADIC,
            value: {
              type: NodeType.NAMED_PARAMETER,
              name: 'param1',
              typeName: createNameNode('type1'),
            },
          },
        ],
        returns: createNameNode('return'),
      },
      then: [
        ['enter', NodeType.ARROW],
        ['enter', NodeType.VARIADIC],
        ['enter', NodeType.NAMED_PARAMETER],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['leave', NodeType.NAMED_PARAMETER],
        ['leave', NodeType.VARIADIC],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['leave', NodeType.ARROW],
      ],
    },

    'should visit an any node': {
      given: {
        type: NodeType.ANY,
      },
      then: [
        ['enter', NodeType.ANY],
        ['leave', NodeType.ANY],
      ],
    },

    'should visit an unknown node': {
      given: {
        type: NodeType.UNKNOWN,
      },
      then: [
        ['enter', NodeType.UNKNOWN],
        ['leave', NodeType.UNKNOWN],
      ],
    },

    'should visit an inner member node': {
      given: createInnerMemberNode('child', createNameNode('owner')),
      then: [
        ['enter', NodeType.INNER_MEMBER],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['leave', NodeType.INNER_MEMBER],
      ],
    },

    'should visit a nested inner member node': {
      given: createInnerMemberNode('superchild',
        createInnerMemberNode('child', createNameNode('owner'))),
      then: [
        ['enter', NodeType.INNER_MEMBER],
        ['enter', NodeType.INNER_MEMBER],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['leave', NodeType.INNER_MEMBER],
        ['leave', NodeType.INNER_MEMBER],
      ],
    },

    'should visit an instance member node': {
      given: createInstanceMemberNode('child', createNameNode('owner')),
      then: [
        ['enter', NodeType.INSTANCE_MEMBER],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['leave', NodeType.INSTANCE_MEMBER],
      ],
    },

    'should visit a nested instance member node': {
      given: createInstanceMemberNode('superchild',
        createInstanceMemberNode('child', createNameNode('owner'))),
      then: [
        ['enter', NodeType.INSTANCE_MEMBER],
        ['enter', NodeType.INSTANCE_MEMBER],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['leave', NodeType.INSTANCE_MEMBER],
        ['leave', NodeType.INSTANCE_MEMBER],
      ],
    },

    'should visit a string value node': {
      given: { type: NodeType.STRING_VALUE, value: 'stringValue' },
      then: [
        ['enter', NodeType.STRING_VALUE],
        ['leave', NodeType.STRING_VALUE],
      ],
    },

    'should visit a number value node': {
      given: { type: NodeType.NUMBER_VALUE, value: 'numberValue' },
      then: [
        ['enter', NodeType.NUMBER_VALUE],
        ['leave', NodeType.NUMBER_VALUE],
      ],
    },

    'should visit an external node': {
      given: { type: NodeType.EXTERNAL, value: createNameNode('external') },
      then: [
        ['enter', NodeType.EXTERNAL],
        ['enter', NodeType.NAME],
        ['leave', NodeType.NAME],
        ['leave', NodeType.EXTERNAL],
      ],
    },
  };

  Object.keys(testCases).forEach(function(testCaseName) {
    var testCaseInfo = testCases[testCaseName];

    it(testCaseName, function() {
      var visitedOrder = [];
      var onEnterSpy = createEventSpy('enter', visitedOrder);
      var onLeaveSpy = createEventSpy('leave', visitedOrder);

      traverse(testCaseInfo.given, onEnterSpy, onLeaveSpy);

      expect(visitedOrder).to.deep.equal(testCaseInfo.then);
    });
  });
});


function createNameNode(name) {
  return {
    type: NodeType.NAME,
    name: name,
  };
}

function createMemberNode(name, owner) {
  return {
    type: NodeType.MEMBER,
    owner: owner,
    name: name,
  };
}

function createUnionNode(left, right) {
  return {
    type: NodeType.UNION,
    left: left,
    right: right,
  };
}

function createTypeQueryNode(name) {
  return {
    type: NodeType.TYPE_QUERY,
    name: name,
  }
}

function createImportNode(path) {
  return {
    type: NodeType.IMPORT,
    path: path,
  }
}

function createStringLiteral(string) {
  return {
    type: NodeType.STRING_VALUE,
    string: string,
  }
}

function createRecordEntry(key, node) {
  return {
    type: NodeType.RECORD_ENTRY,
    key: key,
    value: node,
  };
}

function createInnerMemberNode(name, owner) {
  return {
    type: NodeType.INNER_MEMBER,
    owner: owner,
    name: name,
  };
}

function createInstanceMemberNode(name, owner) {
  return {
    type: NodeType.INSTANCE_MEMBER,
    owner: owner,
    name: name,
  };
}

function createEventSpy(eventName, result) {
  return function(node) {
    result.push([eventName, node.type]);
  };
}

function createFilePathNode(filePath) {
  return {
    type: NodeType.FILE_PATH,
    path: filePath,
  };
}

function create() {
}
