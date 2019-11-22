"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = copy;

/* eslint-disable no-undef */
function copy(str) {
  var tmp = document.createElement('TEXTAREA');
  var focus = document.activeElement;
  tmp.value = str;
  document.body.appendChild(tmp);
  tmp.select();
  document.execCommand('copy');
  document.body.removeChild(tmp);
  focus.focus();
}