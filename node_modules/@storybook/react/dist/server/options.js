"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const packageJson = require('../../package.json');

var _default = {
  packageJson,
  frameworkPresets: [require.resolve('./framework-preset-react.js'), require.resolve('./framework-preset-cra.js'), require.resolve('./framework-preset-react-docgen.js')]
};
exports.default = _default;