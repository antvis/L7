
var path = require('x-path'),
  sep = '/';

var allCache = {};

function getCache(group) {
  if (!allCache.hasOwnProperty(group)) { allCache[group] = {}; }
  return allCache[group];
}

function directoryUp(dir, name, type, cb, disableCache) {
  var i, cache, dirs, filePath, result;

  dirs = dir.split(sep).map(function(d, i, ref) {
    return ref.slice(0, i + 1).join(sep);
  });

  cache = getCache(type + ':' + name);
  type = /file/.test(type) ? 'isFileSync' : 'isDirectorySync';

  for (i = dirs.length - 1; i >= 0; i--) {
    dir = dirs[i];
    filePath = path.join(dir, name);
    if (!disableCache && cache[dir]) {
      i++;
      result = cache[dir];
      break;
    }

    if (path[type](filePath)) {
      result = cb(filePath, dir, name);
      if (result) {
        break;
      }
    }
  }

  if (!disableCache && result) {
    while (i < dirs.length) {
      cache[dir] = result;
      i++;
    }
  }
  return result || null;
}

exports.getPkg = function(dir) {
  return directoryUp(dir, 'package.json', 'file', function(filePath, dir) {
    var pkg, result;
    try {
      pkg = require(filePath);
    } catch (e) {}

    if (pkg && pkg.name && pkg.version) {
      result = {
        name: pkg.name,
        version: pkg.version,
        main: pkg.main,
        root: dir
      };
    }
    return result;
  });
};

exports.getModuleDir = function(dir, moduleName) {
  moduleName = moduleName || '';
  return directoryUp(dir, 'node_modules', 'directory', function(filePath) {
    filePath = path.join(filePath, moduleName);
    if (path.isDirectorySync(filePath)) {
      return filePath;
    }
  }, true);
};
