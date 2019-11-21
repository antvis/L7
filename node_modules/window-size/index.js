/*!
 * window-size <https://github.com/jonschlinkert/window-size>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

var define = require('define-property');
var utils = require('./utils');

/**
 * Expose `windowSize`
 */

module.exports = utils.get();

if (module.exports) {
  /**
   * Expose `windowSize.get` method
   */

  define(module.exports, 'get', utils.get);

  /**
   * Expose methods for unit tests
   */

  define(module.exports, 'env', utils.env);
  define(module.exports, 'tty', utils.tty);
  define(module.exports, 'tput', utils.tput);
  define(module.exports, 'win', utils.win);
}

