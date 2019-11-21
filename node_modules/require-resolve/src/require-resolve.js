/*
 * require-resolve
 * https://github.com/qiu8310/require-resolve"
 *
 * Copyright (c) 2015 Zhonglei Qiu
 * Licensed under the MIT license.
 */

'use strict';

var path = require('x-path'),
  locate = require('./lib/locate'),
  getPkg = locate.getPkg,
  getModuleDir = locate.getModuleDir;

var EXTENSIONS = ['.js', '.json'],
  MAIN = 'index',
  sep = '/';

function resolveDir(dir) {
  var file, main, isDir, pkg = getPkg(dir);

  main = pkg && pkg.root === dir && pkg.main || MAIN;

  isDir = main === '.' || main === './' || /(?:\/\.{0,2})$/.test(main);
  file = path.resolve(dir, main, isDir ? MAIN : '');
  return resolveFile(file);
}

function resolveFile(file) {
  var i, exts = [''].concat(EXTENSIONS);
  for (i = 0; i < exts.length; i++) {
    if (path.isFileSync(file + exts[i])) {
      return file + exts[i];
    }
  }
  return null;
}

function resolve(filePath, isDir) {
  if (isDir) {
    return resolveDir(filePath);
  } else {
    var result = resolveFile(filePath);
    if (!result) {
      result = resolveDir(filePath);
    }
    return result;
  }
}

module.exports = function(requiredPath, refFile) {

  requiredPath = path.normalizePathSeparate(requiredPath, sep);
  refFile = path.normalizePathSeparate(refFile || process.cwd(), sep);

  var isDir = /(?:\/\.{0,2})$/.test(requiredPath),
    refDir = path.dirname(refFile),
    result;

  if (path.isAbsolutePath(requiredPath)) {
    result = resolve(requiredPath, isDir);

  } else if (path.isRelativePath(requiredPath)) {
    result = resolve(path.resolve(refDir, requiredPath), isDir);

  } else {
    var moduleName, modulePath, moduleDir,
      parts = requiredPath.split(sep);

    moduleName = parts.shift();
    modulePath = parts.join(sep);
    moduleDir = getModuleDir(refDir, moduleName);

    if (moduleDir) {
      result = resolve(path.join(moduleDir, modulePath), isDir);
    }
  }

  return result ? {src: result, pkg: getPkg(path.dirname(result))} : null;
};
