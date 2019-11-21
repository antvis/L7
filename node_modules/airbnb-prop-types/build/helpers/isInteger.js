"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var floor = Math.floor;
var finite = isFinite;

var _default = Number.isInteger ||
/* istanbul ignore next */
function (x) {
  return typeof x === 'number' && finite(x) && floor(x) === x;
};

exports["default"] = _default;
//# sourceMappingURL=isInteger.js.map