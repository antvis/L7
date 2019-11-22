/*
 * x-path
 * https://github.com/node-x-extras/x-path"
 *
 * Copyright (c) 2015 Node X Extras
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path-extra'),
  fs = require('fs');

path.isAbsolutePath = function(filePath) {
  return process.platform === 'win32' ? /[\w]:[\\\/]/.test(filePath) : filePath[0] === '/';
};

path.isRelativePath = function(filePath) {
  return /^\.{1,2}[\\\/]/.test(filePath);
};

path.isRootDirectory = function(filePath) {
  return process.platform === 'win32' ? /^[\w]:[\\\/]?$/.test(filePath) : filePath === '/';
};

path.unifyPathSeparate = function(filePath) {
  return filePath.replace(/[\\\/]/g, path.sep);
};

path.normalizePathSeparate = function(filePath, sep) {
  return filePath.replace(/[\\\/]/g, sep || '/');
};

function statAsync(isType, filePath, cb) {
  fs.stat(filePath, function (err, stat) {
    var exists;
    err = err && ['ENOENT', 'ENOTDIR'].indexOf(err.code) < 0 ? err : null;
    if (!err) { exists = stat ? stat[isType]() : false; }
    cb(err, exists);
  });
}
function statSync(isType, filePath, cb) {
  var stat;
  try {
    stat = fs.statSync(filePath);
  } catch (e) {
    if (['ENOENT', 'ENOTDIR'].indexOf(e.code) < 0) { throw e; }
    return false;
  }
  return stat[isType]();
}

path.isDirectory = function(filePath, cb) {
  return statAsync('isDirectory', filePath, cb)
};
path.isFile = function(filePath, cb) {
  return statAsync('isFile', filePath, cb)
};
path.isDirectorySync = function(filePath, cb) {
  return statSync('isDirectory', filePath, cb)
};
path.isFileSync = function(filePath, cb) {
  return statSync('isFile', filePath, cb)
};

module.exports = path;
