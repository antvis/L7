(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', './utils'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('./utils'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.utils);
    global.preseveArray = mod.exports;
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

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var getLargerArray = function getLargerArray(l, r) {
    return l.length > r.length ? l : r;
  };

  var preserve = function preserve(diff, left, right) {

    if (!(0, _utils.isObject)(diff)) return diff;

    return Object.keys(diff).reduce(function (acc, key) {

      var leftArray = left[key];
      var rightArray = right[key];

      if (Array.isArray(leftArray) && Array.isArray(rightArray)) {
        var array = [].concat(_toConsumableArray(getLargerArray(leftArray, rightArray)));
        return _extends({}, acc, _defineProperty({}, key, array.reduce(function (acc2, item, index) {
          if (diff[key].hasOwnProperty(index)) {
            acc2[index] = preserve(diff[key][index], leftArray[index], rightArray[index]); // diff recurse and check for nested arrays
            return acc2;
          }

          delete acc2[index]; // no diff aka empty
          return acc2;
        }, array)));
      }

      return _extends({}, acc, _defineProperty({}, key, diff[key]));
    }, {});
  };

  exports.default = preserve;
  module.exports = exports['default'];
});