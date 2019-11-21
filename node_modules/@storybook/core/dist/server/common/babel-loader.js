"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../config/utils");

var _default = options => ({
  test: /\.(mjs|jsx?)$/,
  use: [{
    loader: 'babel-loader',
    options
  }],
  include: _utils.includePaths,
  exclude: _utils.excludePaths
});

exports.default = _default;