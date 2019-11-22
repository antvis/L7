"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (data) {
  return "data:" + data.mimetype + ";base64," + data.base64;
};