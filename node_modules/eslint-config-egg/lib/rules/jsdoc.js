'use strict';

module.exports = {
  plugins: [ 'jsdoc' ],
  settings: {
    jsdoc: { tagNamePreference: { returns: 'return' } },
  },
  rules: {
    /**
     * Ensures that (JavaScript) examples within JSDoc adhere to ESLint rules.
     * @see https://github.com/gajus/eslint-plugin-jsdoc#check-examples
     */
    'jsdoc/check-examples': 'off',

    /**
     * Ensures that parameter names in JSDoc match those in the function declaration.
     * @see https://github.com/gajus/eslint-plugin-jsdoc#check-param-names
     */
    'jsdoc/check-param-names': 1,

    /**
     * Reports invalid block tag names.
     * @see https://github.com/gajus/eslint-plugin-jsdoc#check-tag-names
     */
    'jsdoc/check-tag-names': 1,

    /**
     * Reports invalid types.
     * @see https://github.com/gajus/eslint-plugin-jsdoc#check-types
     */
    'jsdoc/check-types': 'off',

    /**
     * Enforces a consistent padding of the block description.
     * @see https://github.com/gajus/eslint-plugin-jsdoc#newline-after-description
     */
    'jsdoc/newline-after-description': 'off',

    /**
     * Checks that types in jsdoc comments are defined. This can be used to check unimported types.
     * @see https://github.com/gajus/eslint-plugin-jsdoc#no-undefined-types
     */
    'jsdoc/no-undefined-types': 'off',

    /**
     * Requires that all functions have a description.
     * @see https://github.com/gajus/eslint-plugin-jsdoc#require-description
     */
    'jsdoc/require-description': 'off',

    /**
     * Requires that block description and tag description are written in complete sentences
     * @see https://github.com/gajus/eslint-plugin-jsdoc#require-description-complete-sentence
     */
    'jsdoc/require-description-complete-sentence': 'off',

    /**
     * Requires that all functions have examples.
     * @see https://github.com/gajus/eslint-plugin-jsdoc#require-example
     */
    'jsdoc/require-example': 'off',

    /**
     * Requires a hyphen before the @param description.
     * @see https://github.com/gajus/eslint-plugin-jsdoc#require-hyphen-before-param-description
     */
    'jsdoc/require-hyphen-before-param-description': 'off',

    /**
     * Requires that all function parameters are documented.
     * @see https://github.com/gajus/eslint-plugin-jsdoc#require-param
     */
    'jsdoc/require-param': 1,

    /**
     * Requires that @param tag has description value.
     * @see https://github.com/gajus/eslint-plugin-jsdoc#require-param-description
     */
    'jsdoc/require-param-description': 1,

    /**
     * Requires that all function parameters have name.
     * @see https://github.com/gajus/eslint-plugin-jsdoc#require-param-name
     */
    'jsdoc/require-param-name': 1,

    /**
     * Requires that @param tag has type value.
     * @see https://github.com/gajus/eslint-plugin-jsdoc#require-param-type
     */
    'jsdoc/require-param-type': 1,

    /**
     * Requires returns are documented.
     * @see https://github.com/gajus/eslint-plugin-jsdoc#require-returns
     */
    'jsdoc/require-returns': 'off',

    /**
     * Checks if the return expression exists in function body and in the comment.
     * @see https://github.com/gajus/eslint-plugin-jsdoc#require-returns-check
     */
    'jsdoc/require-returns-check': 1,

    /**
     * Requires that @returns tag has description value.
     * @see https://github.com/gajus/eslint-plugin-jsdoc#require-returns-description
     */
    'jsdoc/require-returns-description': 1,

    /**
     * Requires that @returns tag has type value.
     * @see https://github.com/gajus/eslint-plugin-jsdoc#require-returns-type
     */
    'jsdoc/require-returns-type': 1,

    /**
     * Requires all types to be valid JSDoc or Closure compiler types without syntax errors.
     * @see https://github.com/gajus/eslint-plugin-jsdoc#valid-types
     */
    'jsdoc/valid-types': 'off',
  },
};
