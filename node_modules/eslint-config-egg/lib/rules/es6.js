/**
 * ES6
 */

'use strict';

module.exports = {
  env: {
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 6,
  },
  rules: {
    /**
     * This rule allows the use of braces around arrow function body, even if they can be omitted
     * @see http://eslint.org/docs/rules/arrow-body-style
     * @since 3.0.0
     * @example
     *
     * ```js
     * // correct
     * let foo = () => {
     *   return 0;
     * };
     *
     * let foo = () => {
     *   return {
     *     bar: {
     *       foo: 1,
     *       bar: 2,
     *     }
     *   };
     * };
     *
     * let foo = () => 0;
     *
     * let foo = () => ({
     *   bar: {
     *     foo: 1,
     *     bar: 2,
     *   }
     * });
     ** ```
     */
    'arrow-body-style': 'off',

    /**
     * This rule disallows the use of parens when they are no required
     * @see http://eslint.org/docs/rules/arrow-parens
     */
    'arrow-parens': [ 'error', 'as-needed' ],

    /**
     * This rule normalize style of spacing before and after an arrow function's arrow(`=>`)
     * @see http://eslint.org/docs/rules/arrow-spacing
     */
    'arrow-spacing': [ 'error', { before: true, after: true }],

    /**
     * It doesn't check whether or not there is a valid `super()` call
     * @see http://eslint.org/docs/rules/constructor-super
     */
    'constructor-super': 'off',

    /**
     * This rule enforces spacing after the `*` of generator functions, but omitting before that
     * @see http://eslint.org/docs/rules/generator-star-spacing
     * @since 3.0.0
     * @example
     *
     * ```js
     * function* generator() {
     *   yield '44';
     *   yield '55';
     * }
     * ```
     */
    'generator-star-spacing': [ 'error', { before: false, after: true }],

    /**
     * This rule disallows modifying variables of class declarations
     * @see http://eslint.org/docs/rules/no-class-assign
     */
    'no-class-assign': 'error',

    /**
     * Disallow arrow functions where they could be confused with comparisons
     * @see http://eslint.org/docs/rules/no-confusing-arrow
     * @example
     *
     * ```js
     * var x = a => 1 ? 2 : 3; // incorrect
     * var x = a => (1 ? 2 : 3); // correct
     * ````
     */
    'no-confusing-arrow': [ 'error', {
      allowParens: true,
    }],

    /**
     * Disallow modifying variables that are declared using `const`
     * @see http://eslint.org/docs/rules/no-const-assign
     */
    'no-const-assign': 'error',

    /**
     * Disallow duplicate name in class members
     * @see http://eslint.org/docs/rules/no-dupe-class-members
     */
    'no-dupe-class-members': 'error',

    /**
     * allow Symbol Constructor
     * @see http://eslint.org/docs/rules/no-new-symbol
     */
    'no-new-symbol': 'off',

    /**
     * Disallow use of this/super before calling super() in constructors
     * @see http://eslint.org/docs/rules/no-this-before-super
     * @since 3.0.0
     */
    'no-this-before-super': 'error',

    /**
     * Disallow unnecessary computed property keys on objects
     * @see http://eslint.org/docs/rules/no-useless-computed-key
     * @example
     *
     * ```js
     * foo = { ['a' + 'b']: 'foo' }; // correct
     * foo = { ['a']: 'bar' }; // incorrect
     * ```
     */
    'no-useless-computed-key': 'error',

    /**
     * Disallow unnecessary constructor
     * @see http://eslint.org/docs/rules/no-useless-constructor
     */
    'no-useless-constructor': 'error',

    /**
     * require `let` or `const` instead of `var`
     * @see http://eslint.org/docs/rules/no-var
     */
    'no-var': 'error',

    /**
     * Require Object Literal Shorthand Syntax
     * @see http://eslint.org/docs/rules/object-shorthand
     * @since 3.0.0
     * @example
     *
     * ```js
     * // correct
     * // properties
     * const foo = { x, y, z };
     *
     * // methods
     * const foo = {
     *   a() {},
     *   b() {}
     * };
     *
     * const bar = {
     *  ConstructorFunction: function() {}
     * };
     *
     * // incorrect
     * const foo = {
     *  'a-b'() {}
     * };
     * ```
     */
    'object-shorthand': [ 'error', 'always', {
      avoidQuotes: true,
      ignoreConstructors: false,
    }],

    /**
     * If a variable is never reassigned, using the `const` declaration is better
     * @see http://eslint.org/docs/rules/prefer-const
     * @since 3.0.0
     * @example
     *
     * 1. Specially, if all variables in destructuring should be `const`,
     * this rule warns the variables
     *
     * ```js
     * // incorrect
     * let { a, b } = obj;
     * console.log(a, b);
     *
     * // correct
     * let { a, b } = obj;
     * a = a + 1;
     * console.log(a, b);
     * ```
     */
    'prefer-const': [ 'error', {
      destructuring: 'all',
      ignoreReadBeforeAssign: true,
    }],

    /**
     * This rule doesn't prefer using Reflect methods where applicable
     * @see http://eslint.org/docs/rules/prefer-reflect
     */
    'prefer-reflect': 'off',

    /**
     * This rule doesn't prefer using the rest parameters instead of `arguments`
     * @see http://eslint.org/docs/rules/prefer-rest-params
     * @since 3.0.0
     */
    'prefer-rest-params': 'off',

    /**
     * This rule doesn't prefer using the spread operator instead of `.apply()`
     * @see http://eslint.org/docs/rules/prefer-spread
     */
    'prefer-spread': 'off',

    /**
     * Suggest using template syntax instead of string concat
     * @see http://eslint.org/docs/rules/prefer-template
     */
    'prefer-template': 'off',

    /**
     * This rule doesn't require a valid `yield` in generator functions
     * @see http://eslint.org/docs/rules/require-yield
     */
    'require-yield': 'off',

    /**
     * This rule disallows usage of spacing in template strings
     * @see http://eslint.org/docs/rules/template-curly-spacing
     * @example
     *
     * ```js
     * // incorrect
     * `${ bar }`;
     * `hello, ${ people.name}!`;
     * `hello, ${people.name }!`;
     *
     * // correct
     * `${bar}`;
     * `hello, ${people.name}!`;
     *
     * // specially, this is correct
     * `${
     *   bar
     * }`;
     * ```
     */
    'template-curly-spacing': 'error',

    /**
     * Enforce spacing after the `*` in `yield*` expressions
     * @see http://eslint.org/docs/rules/yield-star-spacing
     */
    'yield-star-spacing': [ 'error', { before: false, after: true }],

    /**
     * only pass instances of the built-in Error object to the reject() function
     * @see https://eslint.org/docs/rules/prefer-promise-reject-errors
     */
    'prefer-promise-reject-errors': 'error',
  },
};
