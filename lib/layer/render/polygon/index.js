"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.polygonMesh = polygonMesh;
Object.defineProperty(exports, "DrawAnimate", {
  enumerable: true,
  get: function get() {
    return _drawAnimate["default"];
  }
});
Object.defineProperty(exports, "DrawFill", {
  enumerable: true,
  get: function get() {
    return _drawFill["default"];
  }
});
Object.defineProperty(exports, "DrawLine", {
  enumerable: true,
  get: function get() {
    return _drawLine["default"];
  }
});

var _drawAnimate = _interopRequireDefault(require("./drawAnimate"));

var _drawFill = _interopRequireDefault(require("./drawFill"));

var _drawLine = _interopRequireDefault(require("./drawLine"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function polygonMesh() {}