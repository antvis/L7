/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/

const { getOptions } = require('loader-utils');
const validateOptions = require('schema-utils');

const schema = require('./options');

module.exports = function rawLoader(source) {
  const options = getOptions(this) || {};

  validateOptions(schema, options, 'Raw Loader');

  const json = JSON.stringify(source)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
  return `module.exports = ${json}`;
};
