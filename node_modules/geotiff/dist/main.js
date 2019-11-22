'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _geotiff = require('./geotiff');

Object.keys(_geotiff).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _geotiff[key];
    }
  });
});