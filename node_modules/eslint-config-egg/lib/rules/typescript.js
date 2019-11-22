'use strict';

/**
 * all rules https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#supported-rules
 */

module.exports = {
  extends: [ 'plugin:@typescript-eslint/recommended' ],

  rules: {
    'jsdoc/require-param': 'off',
    'jsdoc/require-param-type': 'off',
    'comma-dangle': [ 'error', 'always-multiline' ],
    'spaced-comment': [ 'error', 'always', {
      exceptions: [ '-', '+' ],
      markers: [ '*!', '/' ],
    }],

    /**
     * An empty interface is equivalent to its supertype
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-empty-interface.md
     */
    '@typescript-eslint/no-empty-interface': 'off',

    /**
     * Variables that are declared and not used anywhere in the code are most likely an error due to incomplete refactoring
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-vars.md
     */
    '@typescript-eslint/no-unused-vars': 'off',

    /**
     * Enforce camelCase naming convention
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/camelcase.md
     */
    '@typescript-eslint/camelcase': 'off',

    /**
     * Require explicit return types on functions and class methods
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-function-return-type.md
     */
    '@typescript-eslint/explicit-function-return-type': 'off',

    /**
     * Require explicit accessibility modifiers on class properties and methods (`member-access` from TSLint)
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-member-accessibility.md
     */
    '@typescript-eslint/explicit-member-accessibility': 'off',

    /**
     * Enforce consistent indentation (`indent` from TSLint)
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/indent.md
     */
    '@typescript-eslint/indent': [ 'error', 2 ],

    /**
     * Require that interface names be prefixed with `I` (`interface-name` from TSLint)
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/interface-name-prefix.md
     */
    '@typescript-eslint/interface-name-prefix': 'off',

    /**
     * Require a consistent member declaration order (`member-ordering` from TSLint)
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/member-ordering.md
     */
    '@typescript-eslint/member-ordering': 'off',

    /**
     * Disallow usage of the `any` type (`no-any` from TSLint)
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-explicit-any.md
     */
    '@typescript-eslint/no-explicit-any': 'off',

    /**
     * Disallow the use of custom TypeScript modules and namespaces (`no-namespace` from TSLint)
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-namespace.md
     */
    '@typescript-eslint/no-namespace': 'off',

    /**
     * Disallows non-null assertions using the `!` postfix operator (`no-non-null-assertion` from TSLint)
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-non-null-assertion.md
     */
    '@typescript-eslint/no-non-null-assertion': 'off',

    /**
     * Forbids an object literal to appear in a type assertion expression (`no-object-literal-type-assertion` from TSLint)
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-object-literal-type-assertion.md
     */
    '@typescript-eslint/no-object-literal-type-assertion': 'off',

    /**
     * Disallow the use of parameter properties in class constructors. (`no-parameter-properties` from TSLint)
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-parameter-properties.md
     */
    '@typescript-eslint/no-parameter-properties': 'off',

    /**
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/triple-slash-reference.md
     */
    '@typescript-eslint/triple-slash-reference': 'off',
  },
};
