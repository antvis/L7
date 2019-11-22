'use strict';

const path = require('path');
const utils = require('../utils');
const VALID_KEYS = [ 'enable', 'package', 'path', 'env' ];

module.exports = {
  meta: {
    docs: {
      description: 'Disallow unexpected plugin keys in config/plugin.*.js',
      category: 'Possible Errors',
      recommended: true,
      url: 'https://github.com/eggjs/eslint-plugin-eggache#no-unexpected-plugin-keys',
    },
    messages: {
      unexpectedKey: 'Unexpected key: {{ key }}',
    },
  },
  create(context) {
    // only `config/plugin.*.js`
    if (!isPlugin(context)) return {};

    return {
      ExpressionStatement(node) {
        // only consider the root scope
        if (!node.parent || node.parent.type !== 'Program') return;
        if (node.expression.type !== 'AssignmentExpression') return;
        const { left, right } = node.expression;

        // only conside object, cause `exports.view = false` always valid.
        if (utils.isExports(left) && right.type === 'ObjectExpression') {
          checkNode(context, right);
        }

        if (utils.isModule(left) && right.type === 'ObjectExpression') {
          for (const item of right.properties) {
            if (item.value.type === 'ObjectExpression') {
              checkNode(context, item.value);
            }
          }
        }
      },
    };
  },
};

function checkNode(context, node) {
  for (const testNode of node.properties) {
    if (!VALID_KEYS.includes(testNode.key.name)) {
      context.report({
        node: testNode,
        messageId: 'unexpectedKey',
        data: {
          key: testNode.key.name,
        },
      });
    }
  }
}

function isPlugin(context) {
  const filePath = context.getFilename();
  if (filePath === '<input>') return true;
  const baseName = path.basename(filePath);
  const dirname = path.basename(path.dirname(filePath));
  return dirname === 'config' && baseName.startsWith('plugin.');
}
