"use strict";

require("core-js/modules/es.array.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function createProdPresets() {
  return [[require.resolve('babel-preset-minify'), {
    builtIns: false,
    mangle: false
  }]];
}

var _default = ({
  configType
}) => {
  const isProd = configType === 'PRODUCTION';
  const prodPresets = isProd ? createProdPresets() : [];
  return {
    presets: [[require.resolve('@babel/preset-env'), {
      shippedProposals: true,
      useBuiltIns: 'usage',
      corejs: '3'
    }], ...prodPresets],
    plugins: [require.resolve('@babel/plugin-proposal-object-rest-spread'), require.resolve('@babel/plugin-proposal-class-properties'), require.resolve('@babel/plugin-syntax-dynamic-import'), [require.resolve('babel-plugin-emotion'), {
      sourceMap: true,
      autoLabel: true
    }], require.resolve('babel-plugin-macros')]
  };
};

exports.default = _default;