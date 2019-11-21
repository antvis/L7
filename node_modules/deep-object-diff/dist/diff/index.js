(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', '../utils'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('../utils'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.utils);
    global.index = mod.exports;
  }
})(this, function (module, exports, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var diff = function diff(lhs, rhs) {
    if (lhs === rhs) return {}; // equal return no diff

    if (!(0, _utils.isObject)(lhs) || !(0, _utils.isObject)(rhs)) return rhs; // return updated rhs

    var l = (0, _utils.properObject)(lhs);
    var r = (0, _utils.properObject)(rhs);

    var deletedValues = Object.keys(l).reduce(function (acc, key) {
      return r.hasOwnProperty(key) ? acc : _extends({}, acc, _defineProperty({}, key, undefined));
    }, {});

    if ((0, _utils.isDate)(l) || (0, _utils.isDate)(r)) {
      if (l.valueOf() == r.valueOf()) return {};
      return r;
    }

    return Object.keys(r).reduce(function (acc, key) {
      if (!l.hasOwnProperty(key)) return _extends({}, acc, _defineProperty({}, key, r[key])); // return added r key

      var difference = diff(l[key], r[key]);

      if ((0, _utils.isObject)(difference) && (0, _utils.isEmpty)(difference) && !(0, _utils.isDate)(difference)) return acc; // return no diff

      return _extends({}, acc, _defineProperty({}, key, difference)); // return updated key
    }, deletedValues);
  };

  exports.default = diff;
  module.exports = exports['default'];
});