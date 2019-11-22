'use strict';

module.exports = {
  extends: [
    './rules/best-practices',
    './rules/strict',
    './rules/variables',
    './rules/style',
    './rules/node',
    './rules/errors',
    './rules/jsdoc',
  ].map(require.resolve),
  env: {
    amd: false,
    jasmine: false,
    node: true,
    mocha: true,
    builtin: true,
    es6: false,
  },
  globals: {},
  parserOptions: {
    ecmaVersion: 5,
    sourceType: 'script',
  },
};
