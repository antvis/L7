"use strict";

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.match");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = pathToId;

function pathToId(path) {
  var match = (path || '').match(/^\/story\/(.+)/);

  if (!match) {
    throw new Error("Invalid path '".concat(path, "',  must start with '/story/'"));
  }

  return match[1];
}