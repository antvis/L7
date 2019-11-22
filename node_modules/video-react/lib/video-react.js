"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("../styles/scss/video-react.scss");

var _index = require("./index");

Object.keys(_index).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _index[key];
    }
  });
});