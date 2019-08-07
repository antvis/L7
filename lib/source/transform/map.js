"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.map = map;

function map(data, options) {
  var callback = options.callback;

  if (callback) {
    data.dataArray = data.dataArray.map(callback);
  }

  return data;
}