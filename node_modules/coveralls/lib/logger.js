'use strict';

const logDriver = require('log-driver');
const index = require('..');

module.exports = () => logDriver({ level: getLogLevel() });

function getLogLevel() {
  if (index.options.verbose || Boolean(process.env.NODE_COVERALLS_DEBUG)) {
    return 'debug';
  }

  return 'error';
}
