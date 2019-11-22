'use strict';

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [ '@typescript-eslint' ],
  extends: [
    './index.js',
    './lib/rules/typescript.js',
  ],
};
