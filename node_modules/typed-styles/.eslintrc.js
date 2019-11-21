'use strict'

module.exports = {
  extends: [
    'airbnb-base',
    'plugin:flowtype/recommended',
  ],

  rules: {
    'no-unused-expressions': 'off',
    'no-multi-assign': 'off',
    semi: ['error', 'never'],
    'object-curly-spacing': ['error', 'never'],

    'import/no-extraneous-dependencies': ['error', {optionalDependencies: true}],

    'flowtype/no-unused-expressions': 'error',
    'flowtype/generic-spacing': 'off',
    'flowtype/no-types-missing-file-annotation': 'off',
  },

  plugins: ['flowtype'],
}
