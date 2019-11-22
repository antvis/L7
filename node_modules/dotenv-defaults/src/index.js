const dotenv = require('dotenv')

/**
 * Merges two objects.
 * @param {Object} apply - The overwriter
 * @param {Object} defaults - The defaults to be overwritten
 * @returns {Object} The merged results.
 */
const merge = (apply = {}, defaults = {}) => Object.assign({}, defaults, apply)

/**
 * Parses objects like before, but with defaults!
 * @param {String} src - The original src.
 * @param {String} [defaultSrc=''] - The new-and-improved default source.
 * @returns {Object} The parsed results.
 */
const parse = (src, defaultSrc = '') => {
  const parsedSrc = dotenv.parse(src)
  const parsedDefault = dotenv.parse(defaultSrc)

  return merge(parsedSrc, parsedDefault)
}

/**
 * Runs the configurations and applies it to process.env.
 * @param {Object} [options={}] - The options to determnie how this goes
 * @returns {Object} The parsed results.
 */
const config = (options = {}) => {
  const src = dotenv.config(options)
  // we run this second so it doesn't override things set from src
  const defaults = dotenv.config(Object.assign({}, options, {
    path: options.defaults || '.env.defaults'
  }))

  return {
    parsed: merge(src.parsed, defaults.parsed)
  }
}

const load = config

module.exports = {
  parse,
  config,
  load
}
