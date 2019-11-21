'use strict';

module.exports = {
  rules: {
    /**
     * require trailing commas in multiline object literals
     * @see http://eslint.org/docs/rules/comma-dangle
     * @see http://blog.hotoo.me/post/trailing-commas
     */
    'comma-dangle': [ 'error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'never',
    }],

    /**
     * @see http://eslint.org/docs/rules/no-cond-assign
     * @example
     *
     * ```js
     * // Incorrect
     * function setHeight(someNode) {
     *   do {
     *       someNode.height = '100px';
     *   } while (someNode = someNode.parentNode);
     * }
     *
     * // correct
     * function setHeight(someNode) {
     *   do {
     *       someNode.height = '100px';
     *   } while ((someNode = someNode.parentNode));
     * }
     * ```
     */
    'no-cond-assign': [ 'error', 'except-parens' ],

    /**
     * This rule warns the usage of `console`
     * @see http://eslint.org/docs/rules/no-console
     */
    'no-console': 'off',

    /**
     * disallow use of constant expressions in conditions
     * @see http://eslint.org/docs/rules/no-constant-condition
     */
    'no-constant-condition': 'error',

    /**
     * disallow control characters in regular expressions
     * @see http://eslint.org/docs/rules/no-control-regex
     */
    'no-control-regex': 'error',

    /**
     * disallow use of debugger
     * @see http://eslint.org/docs/rules/no-debugger
     */
    'no-debugger': 'error',

    /**
     * disallow duplicate arguments in functions
     * @see http://eslint.org/docs/rules/no-dupe-args
     */
    'no-dupe-args': 'error',

    /**
     * disallow duplicate keys when creating object literals
     * @see http://eslint.org/docs/rules/no-dupe-keys
     */
    'no-dupe-keys': 'error',

    /**
     * disallow a duplicate case label.
     * @see http://eslint.org/docs/rules/no-duplicate-case
     */
    'no-duplicate-case': 'error',

    /**
     * disallow empty statements
     * @see http://eslint.org/docs/rules/no-empty
     */
    'no-empty': 'error',

    /**
     * disallow the use of empty character classes in regular expressions
     * @see http://eslint.org/docs/rules/no-empty-character-class
     */
    'no-empty-character-class': 'error',

    /**
     * disallow assigning to the exception in a catch block
     * @see http://eslint.org/docs/rules/no-ex-assign
     */
    'no-ex-assign': 'error',

    /**
     * disallow double-negation boolean casts in a boolean context
     * @see http://eslint.org/docs/rules/no-extra-boolean-cast
     */
    'no-extra-boolean-cast': 'error',

    /**
     * disallow unnecessary parentheses
     *
     * @example
     *
     * // allow
     * module.export = app => (
     *   // some js docs
     *   class Test extends app.Proxy {
     *
     *   }
     * );
     *
     * @see http://eslint.org/docs/rules/no-extra-parens
     */
    'no-extra-parens': [ 'error', 'functions' ],

    /**
     * disallow unnecessary semicolons
     * @see http://eslint.org/docs/rules/no-extra-semi
     */
    'no-extra-semi': 'error',

    /**
     * disallow overwriting functions written as function declarations
     * @see http://eslint.org/docs/rules/no-func-assign
     */
    'no-func-assign': 'error',

    /**
     * disallow function declarations in nested blocks
     * @see http://eslint.org/docs/rules/no-inner-declarations
     */
    'no-inner-declarations': [ 'error', 'functions' ],

    /**
     * disallow invalid regular expression strings in the RegExp constructor
     * @see http://eslint.org/docs/rules/no-invalid-regexp
     */
    'no-invalid-regexp': 'error',

    /**
     * disallow irregular whitespace outside of strings and comments
     * @see http://eslint.org/docs/rules/no-irregular-whitespace
     */
    'no-irregular-whitespace': 'error',

    /**
     * disallow negation of the left operand of an in expression
     * @see http://eslint.org/docs/rules/no-negated-in-lhs
     */
    'no-negated-in-lhs': 'error',

    /**
     * disallow the use of object properties of the global object (Math and JSON) as functions
     * @see http://eslint.org/docs/rules/no-obj-calls
     */
    'no-obj-calls': 'error',

    /**
     * disallow multiple spaces in a regular expression literal
     * @see http://eslint.org/docs/rules/no-regex-spaces
     */
    'no-regex-spaces': 'error',

    /**
     * disallow sparse arrays
     * @see http://eslint.org/docs/rules/no-sparse-arrays
     */
    'no-sparse-arrays': 'error',

    /**
     * Avoid code that looks like two expressions but is actually one
     * @see http://eslint.org/docs/rules/no-unexpected-multiline
     */
    'no-unexpected-multiline': 'off',

    /**
     * disallow unreachable statements after a return, throw, continue, or break statement
     * @see http://eslint.org/docs/rules/no-unreachable
     */
    'no-unreachable': 'error',

    /**
     * disallow return/throw/break/continue inside finally blocks
     * @see http://eslint.org/docs/rules/no-unsafe-finally
     */
    'no-unsafe-finally': 'error',

    /**
     * disallow comparisons with the value NaN
     * @see http://eslint.org/docs/rules/use-isnan
     */
    'use-isnan': 'error',

    /**
     * This rule has deprecated https://eslint.org/blog/2018/11/jsdoc-end-of-life
     * ensure JSDoc comments are valid
     * @see http://eslint.org/docs/rules/valid-jsdoc
     */
    'valid-jsdoc': 'off',

    /**
     * Doesn't enforce comparing typeof expressions against valid strings
     * @see http://eslint.org/docs/rules/valid-typeof
     */
    'valid-typeof': 'off',
  },
};
