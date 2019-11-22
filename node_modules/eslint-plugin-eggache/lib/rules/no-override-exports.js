'use strict';

const path = require('path');
const utils = require('../utils');

module.exports = {
  meta: {
    docs: {
      description: 'Disallow override exports',
      category: 'Possible Errors',
      recommended: true,
      url: 'https://github.com/eggjs/eslint-plugin-eggache#no-override-exports',
    },
    schema: [
      {
        // if true, check all file, otherwise only check `config/config.*.js` or config/plugin.*.js`
        type: 'boolean',
      },
    ],
    messages: {
      overrideExports: 'Don\'t overide `exports`',
      overrideModule: 'Don\'t overide `module.exports`',
    },
  },
  create(context) {
    let hasExports = false;
    let hasModule = false;
    const shouldCheckAll = context.options[0];
    // if `!shouldCheckAll`, then only check `<input>` or `config/config.*.js` or `config/plugin.*.js`
    if (!shouldCheckAll && !isConfig(context)) return {};

    return {
      ExpressionStatement(node) {
        // only consider the root scope
        if (!node.parent || node.parent.type !== 'Program') return;
        if (node.expression.type !== 'AssignmentExpression') return;
        const testNode = node.expression.left;
        if (utils.isExports(testNode)) {
          if (hasModule) {
            context.report({ node, messageId: 'overrideExports' });
          }
          hasExports = true;
        } else if (utils.isModule(testNode)) {
          if (hasExports) {
            context.report({ node, messageId: 'overrideExports' });
          }
          if (hasModule) {
            context.report({ node, messageId: 'overrideModule' });
          }
          hasModule = true;
        }
      },
    };
  },
};

function isConfig(context) {
  const filePath = context.getFilename();
  if (filePath === '<input>') return true;
  const baseName = path.basename(filePath);
  const dirname = path.basename(path.dirname(filePath));
  return dirname === 'config' && (baseName.startsWith('config.') || baseName.startsWith('plugin.'));
}
