"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = log;

/*eslint no-console:0*/
function log() {
  var _console;

  if (process.env.DRAGGABLE_DEBUG) (_console = console).log.apply(_console, arguments);
}