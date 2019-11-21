"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "getDevCli", {
  enumerable: true,
  get: function () {
    return _dev.default;
  }
});
Object.defineProperty(exports, "getProdCli", {
  enumerable: true,
  get: function () {
    return _prod.default;
  }
});

var _dev = _interopRequireDefault(require("./dev"));

var _prod = _interopRequireDefault(require("./prod"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }