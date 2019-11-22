"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = log;

/*eslint no-console:0*/
function log(...args) {
  if (process.env.DRAGGABLE_DEBUG) console.log(...args);
}