'use strict';

module.exports = {
  rules: {
    'no-override-exports': require('./lib/rules/no-override-exports'),
    'no-unexpected-plugin-keys': require('./lib/rules/no-unexpected-plugin-keys'),
  },
  configs: {
    recommended: {
      plugins: [ 'eggache' ],
      rules: {
        'eggache/no-override-exports': 'error',
        'eggache/no-unexpected-plugin-keys': 'error',
      },
    },
  },
};
