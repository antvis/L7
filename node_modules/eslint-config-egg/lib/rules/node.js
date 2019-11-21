'use strict';

module.exports = {
  env: {
    node: true,
  },

  rules: {
    /**
     * not enforce return after a callback
     * @see http://eslint.org/docs/rules/callback-return
     */
    'callback-return': 'off',

    /**
     * not require all requires be top-level
     * @see http://eslint.org/docs/rules/global-require
     */
    'global-require': 'off',

    /**
     * not enforces error handling in callbacks (node environment)
     * @see http://eslint.org/docs/rules/handle-callback-err
     */
    'handle-callback-err': 'off',

    /**
     * allow mixing regular variable and require declarations
     * @see http://eslint.org/docs/rules/no-mixed-requires
     */
    'no-mixed-requires': 'off',

    /**
     * allow use of new operator with the require function
     * @see http://eslint.org/docs/rules/no-new-require
     */
    'no-new-require': 'off',

    /**
     * allow string concatenation with __dirname and __filename
     * @see http://eslint.org/docs/rules/no-path-concat
     */
    'no-path-concat': 'off',

    /**
     * allow use of process.env
     * @see http://eslint.org/docs/rules/no-process-env
     */
    'no-process-env': 'off',

    /**
     * allow process.exit()
     * @see http://eslint.org/docs/rules/no-process-exit
     */
    'no-process-exit': 'off',

    /**
     * not restrict usage of specified node modules
     * @see http://eslint.org/docs/rules/no-restricted-modules
     */
    'no-restricted-modules': 'off',

    /**
     * allow use of synchronous methods
     * @see http://eslint.org/docs/rules/no-sync
     */
    'no-sync': 'off',
  },
};
