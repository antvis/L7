'use strict';

const os = require('os');

module.exports = {
  rules: {
    /**
     * enforce spaces inside of brackets
     * @see http://eslint.org/docs/rules/array-bracket-spacing
     * @since 3.0.0
     */
    'array-bracket-spacing': [ 'error', 'always', {
      objectsInArrays: false,
      arraysInArrays: false,
    }],

    /**
     * enforce spaces inside of single line blocks
     * @see http://eslint.org/docs/rules/block-spacing
     */
    'block-spacing': [ 'error', 'always' ],

    /**
     * @see http://eslint.org/docs/rules/brace-style
     * @since 3.0.0
     * @example
     *
     * ```js
     * // correct
     * if (foo) {
     *   bar();
     * }
     *
     * foo: { type: Array, default() { return []; } }
     *
     * if (foo) bar();
     *
     * if (foo) { bar(); }
     *
     * // incorrect
     *
     * if (foo) {
     *   bar();
     * }
     * else {
     *   baz();
     * }
     * ```
     */
    'brace-style': [ 'error', '1tbs', { allowSingleLine: true }],

    /**
     * not require camel case names
     * @see http://eslint.org/docs/rules/camelcase
     */
    camelcase: 'off',

    /**
     * enforce spacing before and after comma
     * @see http://eslint.org/docs/rules/comma-spacing
     */
    'comma-spacing': [ 'error', { before: false, after: true }],

    /**
     * enforce one true comma style
     * @see http://eslint.org/docs/rules/comma-style
     * @since 3.0.0
     * @example
     *
     * ```js
     * // incorrect
     * var foo = 1
     * ,
     * bar = 2;
     *
     * var foo = 1
     * , bar = 2;
     *
     * var foo = ["apples"
     * , "oranges"];
     *
     * function bar() {
     *   return {
     *     "a": 1
     *     ,"b:": 'error
     *   };
     * }
     * ```
     */
    'comma-style': [ 'error', 'last' ],

    /**
     * allow padding inside computed properties
     * @see http://eslint.org/docs/rules/computed-property-spacing
     */
    'computed-property-spacing': 'off',

    /**
     * not enforces consistent naming when capturing the current execution context
     * @see http://eslint.org/docs/rules/consistent-this
     */
    'consistent-this': 'off',

    /**
     * enforce newline at the end of file, with no multiple empty lines
     * @see http://eslint.org/docs/rules/eol-last
     */
    'eol-last': 'error',

    /**
     * not require function expressions to have a name
     * @see http://eslint.org/docs/rules/func-names
     */
    'func-names': 'off',

    /**
     * not enforces use of function declarations or expressions
     * @see http://eslint.org/docs/rules/func-style
     */
    'func-style': 'off',

    /**
     * Blacklist certain identifiers to prevent them being used
     * @see http://eslint.org/docs/rules/id-blacklist
     */
    'id-blacklist': 'off',

    /**
     * not enforces minimum and maximum identifier lengths
     * (variable names, property names etc.)
     * @see http://eslint.org/docs/rules/id-length
     */
    'id-length': 'off',

    /**
     * not require identifiers to match the provided regular expression
     * @see http://eslint.org/docs/rules/id-match
     */
    'id-match': 'off',

    /**
     * this option sets a specific tab width for your code
     * @see http://eslint.org/docs/rules/indent
     */
    indent: [ 'error', 2, { SwitchCase: 1, VariableDeclarator: 1 }],

    /**
     * enforces spacing between keys and values in object literal properties
     * @see http://eslint.org/docs/rules/key-spacing
     */
    'key-spacing': [ 'error', { beforeColon: false, afterColon: true }],

    /**
     * require a space before & after certain keywords
     * @see http://eslint.org/docs/rules/keyword-spacing
     */
    'keyword-spacing': [ 'error', {
      before: true,
      after: true,
      overrides: {
        return: { after: true },
        throw: { after: true },
        case: { after: true },
      },
    }],

    /**
     * enforces the usage of Unix line endings: \n for LF
     * @see http://eslint.org/docs/rules/linebreak-style
     */
    'linebreak-style': [ (os.platform() === 'win32' ? 'off' : 'error'), 'unix' ],

    /**
     * not enforces empty lines around comments
     * @see http://eslint.org/docs/rules/lines-around-comment
     */
    'lines-around-comment': 'off',

    /**
     * specify the maximum depth that blocks can be nested
     * @see http://eslint.org/docs/rules/max-depth
     */
    'max-depth': 'off',

    /**
     * not specify the maximum length of a line in your program
     * @see http://eslint.org/docs/rules/max-len
     * @since 3.0.0
     */
    'max-len': 'off',

    /**
     * not specify the maximum depth callbacks can be nested
     * @see http://eslint.org/docs/rules/max-nested-callbacks
     */
    'max-nested-callbacks': 'off',

    /**
     * limits the number of parameters that can be used in the function declaration.
     * @see http://eslint.org/docs/rules/max-params
     */
    'max-params': 'off',

    /**
     * specify the maximum number of statement allowed in a function
     * @see http://eslint.org/docs/rules/max-statements
     */
    'max-statements': 'off',

    /**
     * restrict the number of statements per line
     * @see http://eslint.org/docs/rules/max-statements-per-line
     * @since 3.0.0
     */
    'max-statements-per-line': 'off',

    /**
     * not require a capital letter for constructors
     * @see http://eslint.org/docs/rules/new-cap
     */
    'new-cap': 'off',

    /**
     * disallow the omission of parentheses when invoking a constructor with no arguments
     * @see http://eslint.org/docs/rules/new-parens
     */
    'new-parens': 'error',

    /**
     * allow an empty newline after var statement
     * @see http://eslint.org/docs/rules/newline-after-var
     */
    'newline-after-var': 'off',

    /**
     * @see http://eslint.org/docs/rules/newline-before-return
     */
    'newline-before-return': 'off',

    /**
     * enforces new line after each method call in the chain to make it
     * more readable and easy to maintain
     */
    'newline-per-chained-call': [ 'error', { ignoreChainWithDepth: 3 }],

    /**
     * disallow use of the Array constructor
     * @see http://eslint.org/docs/rules/no-array-constructor
     */
    'no-array-constructor': 'error',

    /**
     * disallow use of bitwise operators
     * @see http://eslint.org/docs/rules/no-bitwise
     */
    'no-bitwise': 'error',

    /**
     * allow use of the continue statement
     * @see http://eslint.org/docs/rules/no-continue
     */
    'no-continue': 'off',

    /**
     * allow comments inline after code
     * @see http://eslint.org/docs/rules/no-inline-comments
     */
    'no-inline-comments': 'off',

    /**
     * allow if as the only statement in an else block
     * @see http://eslint.org/docs/rules/no-lonely-if
     */
    'no-lonely-if': 'off',

    /**
     * disallow mixed spaces and tabs for indentation
     * @see http://eslint.org/docs/rules/no-mixed-spaces-and-tabs
     */
    'no-mixed-spaces-and-tabs': [ 'error', false ],

    /**
     * disallow multiple empty lines and only one newline at the end
     * @see http://eslint.org/docs/rules/no-multiple-empty-lines
     * @since 3.0.0
     */
    'no-multiple-empty-lines': [ 'error', { max: 2, maxEOF: 1 }],

    /**
     * allow negated conditions
     * @see http://eslint.org/docs/rules/no-negated-condition
     */
    'no-negated-condition': 'off',

    /**
     * disallow negating the left operand in `in` expressions
     * @see http://eslint.org/docs/rules/no-negated-in-lhs
     */
    'no-negated-in-lhs': 'error',

    /**
     * allow nested ternary expressions
     * @see http://eslint.org/docs/rules/no-nested-ternary
     */
    'no-nested-ternary': 'off',

    /**
     * disallow use of the Object constructor
     * @see http://eslint.org/docs/rules/no-new-object
     */
    'no-new-object': 'error',

    /**
     * allow use of unary operators, ++ and --
     * @see http://eslint.org/docs/rules/no-plusplus
     */
    'no-plusplus': 'off',

    /**
     * disallow certain syntax forms
     * @see http://eslint.org/docs/rules/no-restricted-syntax
     */
    'no-restricted-syntax': [
      2,
      'WithStatement',
    ],

    /**
     * disallow space between function identifier and application
     * @see http://eslint.org/docs/rules/no-spaced-func
     */
    'no-spaced-func': 'error',

    /**
     * allow the use of ternary operators
     * @see http://eslint.org/docs/rules/no-ternary
     */
    'no-ternary': 'off',

    /**
     * disallow trailing whitespace at the end of lines
     * @see http://eslint.org/docs/rules/no-trailing-spaces
     */
    'no-trailing-spaces': 'error',

    /**
     * allow dangling underscores in identifiers
     * @see http://eslint.org/docs/rules/no-underscore-dangle
     */
    'no-underscore-dangle': 'off',

    /**
     * allow the use of Boolean literals in conditional expressions
     * also, prefer `a || b` over `a ? a : b`
     * @see http://eslint.org/docs/rules/no-unneeded-ternary
     */
    'no-unneeded-ternary': 'error',

    /**
     * disallow whitespace before properties
     * @see http://eslint.org/docs/rules/no-whitespace-before-property
     */
    'no-whitespace-before-property': 'error',

    /**
     * require padding inside curly braces
     * @see http://eslint.org/docs/rules/object-curly-spacing
     * @since 3.0.0
     * @example
     *
     * ```js
     * // incorrect
     * var obj = {'foo': 'bar'};
     * var obj = {'foo': 'bar' };
     * var obj = { baz: {'foo': 'qux'}, bar};
     * var obj = {baz: { 'foo': 'qux' }, bar};
     * var obj = {'foo': 'bar'
     * };
     * ```
     */
    'object-curly-spacing': [ 'error', 'always' ],

    /**
     * not enforce "same line" or "multiple line" on object properties.
     * @see http://eslint.org/docs/rules/object-property-newline
     */
    'object-property-newline': 'off',

    /**
     * allow just one var statement per function
     * @see http://eslint.org/docs/rules/one-var
     */
    'one-var': 'off',

    /**
     * require a newline around variable declaration
     * @see http://eslint.org/docs/rules/one-var-declaration-per-line
     * @since 3.0.0
     */
    'one-var-declaration-per-line': [ 'error', 'always' ],

    /**
     * not require assignment operator shorthand where possible or prohibit it entirely
     * @see http://eslint.org/docs/rules/operator-assignment
     */
    'operator-assignment': 'off',

    /**
     * not enforce operators to be placed before or after line breaks
     * @see http://eslint.org/docs/rules/operator-linebreak
     */
    'operator-linebreak': 'off',

    /**
     * allow padding within blocks
     * @see http://eslint.org/docs/rules/padded-blocks
     */
    'padded-blocks': 'off',

    /**
     * not require quotes around object literal property names
     * @see http://eslint.org/docs/rules/quote-props
     */
    'quote-props': [ 'error', 'as-needed', { keywords: false }],

    /**
     * specify whether double or single quotes should be used
     * @see http://eslint.org/docs/rules/quotes
     */
    quotes: [ 'error', 'single', { avoidEscape: true }],

    /**
     * do not require jsdoc
     * @see http://eslint.org/docs/rules/require-jsdoc
     */
    'require-jsdoc': 'off',

    /**
     * disallow use of semicolons instead of ASI
     * @see http://eslint.org/docs/rules/semi
     */
    semi: [ 'error', 'always' ],

    /**
     * enforce spacing before and after semicolons
     * @see http://eslint.org/docs/rules/semi-spacing
     */
    'semi-spacing': [ 'error', { before: false, after: true }],

    /**
     * not sort variables within the same declaration block
     * @see http://eslint.org/docs/rules/sort-vars
     */
    'sort-vars': 'off',

    /**
     * disallow space before blocks
     * @see http://eslint.org/docs/rules/space-before-blocks
     */
    'space-before-blocks': 'error',

    /**
     * require or disallow space before function opening parenthesis
     * @see http://eslint.org/docs/rules/space-before-function-paren
     */
    'space-before-function-paren': [ 'error', {
      anonymous: 'never',
      named: 'never',
    }],

    /**
     * require or disallow spaces inside parentheses
     * @see http://eslint.org/docs/rules/space-in-parens
     */
    'space-in-parens': [ 'error', 'never' ],

    /**
     * require spaces around operators
     * @see http://eslint.org/docs/rules/space-infix-ops
     */
    'space-infix-ops': 'error',

    /**
     * Require spaces before/after unary operators
     * @see http://eslint.org/docs/rules/space-unary-ops
     */
    'space-unary-ops': [ 'error', {
      words: true,
      nonwords: false,
    }],

    /**
     * require or disallow a space immediately following the // or /* in a comment
     * @see http://eslint.org/docs/rules/spaced-comment
     */
    'spaced-comment': [ 'error', 'always', {
      exceptions: [ '-', '+' ],
      markers: [ '*!' ],
    }],

    /**
     * not require regex literals to be wrapped in parentheses
     * @see http://eslint.org/docs/rules/wrap-regex
     */
    'wrap-regex': 'off',

    /**
     * unnecessary escape usage
     * @see http://eslint.org/docs/rules/no-useless-escape
     */
    'no-useless-escape': 'off',
  },
};
