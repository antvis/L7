'use strict';

module.exports = {
  rules: {
    /**
     * Doesn't enforce variable initializations
     * @see http://eslint.org/docs/rules/init-declarations
     */
    'init-declarations': 'off',

    /**
     * allow the catch clause parameter name being the same as a variable in the outer scope
     * @see http://eslint.org/docs/rules/no-catch-shadow
     * @since 3.0.0
     */
    'no-catch-shadow': 'off',

    /**
     * disallow deletion of variables
     * @see http://eslint.org/docs/rules/no-delete-var
     */
    'no-delete-var': 'error',

    /**
     * disallow labels that share a name with a variable
     * @see http://eslint.org/docs/rules/no-label-var
     */
    'no-label-var': 'error',

    /**
     * disallow specific globals
     * @see http://eslint.org/docs/rules/no-restricted-globals
     * @since 3.0.0
     */
    'no-restricted-globals': 'off',

    /**
     * allow declaration of variables already declared in the outer scope
     * @see http://eslint.org/docs/rules/no-shadow
     */
    'no-shadow': 'off',

    /**
     * disallow shadowing of names such as arguments
     * @see http://eslint.org/docs/rules/no-shadow-restricted-names
     */
    'no-shadow-restricted-names': 'error',

    /**
     * disallow use of undeclared variables unless mentioned in a `global` block
     * @see http://eslint.org/docs/rules/no-undef
     */
    'no-undef': 'error',

    /**
     * disallow use of undefined when initializing variables
     * @see http://eslint.org/docs/rules/no-undef-init
     */
    'no-undef-init': 'error',

    /**
     * disallow use of undefined variable
     * @see http://eslint.org/docs/rules/no-undefined
     */
    'no-undefined': 'off',

    /**
     * disallow declaration of variables that are not used in the code
     * @see http://eslint.org/docs/rules/no-unused-vars
     * @since 3.0.0
     */
    'no-unused-vars': [ 'error', { vars: 'local', args: 'after-used' }],

    /**
     * disallow use of variables before they are defined
     * @see http://eslint.org/docs/rules/no-use-before-define
     */
    'no-use-before-define': [ 'error', 'nofunc' ],

    /**
     * require let or const instead of var
     * @see http://eslint.org/docs/rules/no-var
     */
    'no-var': 'off',
  },
};
