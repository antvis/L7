"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = data => `data:${data.mimetype};base64,${data.base64}`;