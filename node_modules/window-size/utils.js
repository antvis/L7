/*!
 * window-size <https://github.com/jonschlinkert/window-size>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

var os = require('os');
var isNumber = require('is-number');
var cp = require('child_process');

function windowSize(options) {
  options = options || {};
  return streamSize(options, 'stdout') ||
    streamSize(options, 'stderr') ||
    envSize() ||
    ttySize(options);
}

function streamSize(options, name) {
  var stream = (process && process[name]) || options[name];
  var size;

  if (!stream) return;
  if (typeof stream.getWindowSize === 'function') {
    size = stream.getWindowSize();
    if (isSize(size)) {
      return {
        width: size[0],
        height: size[1],
        type: name
      };
    }
  }

  size = [stream.columns, stream.rows];
  if (isSize(size)) {
    return {
      width: Number(size[0]),
      height: Number(size[1]),
      type: name
    };
  }
}

function envSize() {
  if (process && process.env) {
    var size = [process.env.COLUMNS, process.env.ROWS];
    if (isSize(size)) {
      return {
        width: Number(size[0]),
        height: Number(size[1]),
        type: 'process.env'
      };
    }
  }
}

function ttySize(options, stdout) {
  var tty = options.tty || require('tty');
  if (tty && typeof tty.getWindowSize === 'function') {
    var size = tty.getWindowSize(stdout);
    if (isSize(size)) {
      return {
        width: Number(size[1]),
        height: Number(size[0]),
        type: 'tty'
      };
    }
  }
}

function winSize() {
  if (os.release().startsWith('10')) {
    var cmd = 'wmic path Win32_VideoController get CurrentHorizontalResolution,CurrentVerticalResolution';
    var numberPattern = /\d+/g;
    var code = cp.execSync(cmd).toString();
    var size = code.match(numberPattern);
    if (isSize(size)) {
      return {
        width: Number(size[0]),
        height: Number(size[1]),
        type: 'windows'
      };
    }
  }
}

function tputSize() {
  try {
    var buf = cp.execSync('tput cols && tput lines', {stdio: ['ignore', 'pipe', process.stderr]});
    var size = buf.toString().trim().split('\n');
    if (isSize(size)) {
      return {
        width: Number(size[0]),
        height: Number(size[1]),
        type: 'tput'
      };
    }
  } catch (err) {}
}

/**
 * Returns true if the given size array has
 * valid height and width values.
 */

function isSize(size) {
  return Array.isArray(size) && isNumber(size[0]) && isNumber(size[1]);
}

/**
 * Expose `windowSize`
 */

module.exports = {
  get: windowSize,
  env: envSize,
  tty: ttySize,
  tput: tputSize,
  win: winSize
};
