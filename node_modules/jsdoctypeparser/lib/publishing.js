'use strict';


var format = require('util').format;


function publish(node, opt_publisher) {
  var publisher = opt_publisher || createDefaultPublisher();
  return publisher[node.type](node, function(childNode) {
    return publish(childNode, publisher);
  });
}


function createDefaultPublisher() {
  return {
    NAME: function(nameNode) {
      return nameNode.name;
    },
    MEMBER: function(memberNode, concretePublish) {
      return format('%s.%s%s', concretePublish(memberNode.owner),
                    memberNode.hasEventPrefix ? 'event:' : '',
                    memberNode.name);
    },
    UNION: function(unionNode, concretePublish) {
      return format('%s|%s', concretePublish(unionNode.left),
                    concretePublish(unionNode.right));
    },
    VARIADIC: function(variadicNode, concretePublish) {
      return format('...%s', concretePublish(variadicNode.value));
    },
    RECORD: function(recordNode, concretePublish) {
      var concretePublishedEntries = recordNode.entries.map(concretePublish);
      return format('{%s}', concretePublishedEntries.join(', '));
    },
    RECORD_ENTRY: function(entryNode, concretePublish) {
      if (!entryNode.value) return entryNode.key;
      return format('%s: %s', entryNode.key, concretePublish(entryNode.value));
    },
    GENERIC: function(genericNode, concretePublish) {
      var concretePublishedObjects = genericNode.objects.map(concretePublish);
      return format('%s<%s>', concretePublish(genericNode.subject),
                    concretePublishedObjects.join(', '));
    },
    MODULE: function(moduleNode, concretePublish) {
      return format('module:%s', concretePublish(moduleNode.value));
    },
    FILE_PATH: function(filePathNode) {
      return filePathNode.path;
    },
    OPTIONAL: function(optionalNode, concretePublish) {
      return format('%s=', concretePublish(optionalNode.value));
    },
    NULLABLE: function(nullableNode, concretePublish) {
      return format('?%s', concretePublish(nullableNode.value));
    },
    NOT_NULLABLE: function(notNullableNode, concretePublish) {
      return format('!%s', concretePublish(notNullableNode.value));
    },
    FUNCTION: function(functionNode, concretePublish) {
      var publidshedParams = functionNode.params.map(concretePublish);

      if (functionNode.new) {
        publidshedParams.unshift(format('new: %s',
          concretePublish(functionNode.new)));
      }

      if (functionNode.this) {
        publidshedParams.unshift(format('this: %s',
          concretePublish(functionNode.this)));
      }

      if (functionNode.returns) {
        return format('function(%s): %s', publidshedParams.join(', '),
                           concretePublish(functionNode.returns));
      }

      return format('function(%s)', publidshedParams.join(', '));
    },
    ARROW: function(functionNode, concretePublish) {
      var publishedParams = functionNode.params.map(concretePublish);
      return (functionNode.new ? 'new ' : '') + format('(%s) => %s', publishedParams.join(', '), concretePublish(functionNode.returns));
    },
    NAMED_PARAMETER: function(parameterNode, concretePublish) {
      return parameterNode.name + (parameterNode.typeName ? ': ' + concretePublish(parameterNode.typeName) : '');
    },
    ANY: function() {
      return '*';
    },
    UNKNOWN: function() {
      return '?';
    },
    INNER_MEMBER: function(memberNode, concretePublish) {
      return concretePublish(memberNode.owner) + '~' +
        (memberNode.hasEventPrefix ? 'event:' : '') + memberNode.name;
    },
    INSTANCE_MEMBER: function(memberNode, concretePublish) {
      return concretePublish(memberNode.owner) + '#' +
        (memberNode.hasEventPrefix ? 'event:' : '') + memberNode.name;
    },
    STRING_VALUE: function(stringValueNode) {
      return format('"%s"', stringValueNode.string);
    },
    NUMBER_VALUE: function(numberValueNode) {
      return numberValueNode.number;
    },
    EXTERNAL: function(externalNode, concretePublish) {
      return format('external:%s', concretePublish(externalNode.value));
    },
    PARENTHESIS: function(parenthesizedNode, concretePublish) {
      return format('(%s)', concretePublish(parenthesizedNode.value));
    },
    TYPE_QUERY: function (typeQueryNode, concretePublish) {
      return format('typeof %s', concretePublish(typeQueryNode.name));
    },
    IMPORT: function (importNode, concretePublish) {
      return format('import(%s)', concretePublish(importNode.path));
    },
  };
}


module.exports = {
  publish: publish,
  createDefaultPublisher: createDefaultPublisher,
};
