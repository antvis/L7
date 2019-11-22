'use strict';

exports.isExports = function(node) {
  // exports.view = '';
  // exports['view'] = '';
  return node.object.type === 'Identifier' && node.object.name === 'exports';
};

exports.isModule = function(node) {
  // module.exports = {};
  // module.exports = () => {};
  if (node.object.type === 'Identifier') {
    return node.object.name === 'module' && node.property.type === 'Identifier' && node.property.name === 'exports';
  }

  // module.exports.test = {};
  if (node.object.type === 'MemberExpression') {
    const realNode = node.object;
    return realNode.object.name === 'module' && realNode.property.type === 'Identifier' && realNode.property.name === 'exports';
  }
};
