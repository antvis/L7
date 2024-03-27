/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-declaration-block-no-ignored-properties'],
  rules: {
    'no-descending-specificity': null,
    'function-url-quotes': 'always',
    'selector-attribute-quotes': 'always',
    'selector-class-pattern': null,
    'font-family-no-missing-generic-family-keyword': null, // iconfont
    'plugin/declaration-block-no-ignored-properties': true,
    'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }],
    'selector-type-no-unknown': null,
    'value-keyword-case': ['lower', { ignoreProperties: ['composes'] }],
  },
  overrides: [
    {
      files: ['*.less', '**/*.less'],
      customSyntax: 'postcss-less',
    },
  ],
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts'],
};
