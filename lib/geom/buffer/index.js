"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "getBuffer", {
  enumerable: true,
  get: function get() {
    return _factory.getBuffer;
  }
});

var _fill_buffer = _interopRequireDefault(require("./polygon/fill_buffer"));

var _line_buffer = _interopRequireDefault(require("./polygon/line_buffer"));

var _extrude_buffer = _interopRequireDefault(require("./polygon/extrude_buffer"));

var _fill_buffer2 = _interopRequireDefault(require("./point/fill_buffer2"));

var _meshline = _interopRequireDefault(require("./line/meshline"));

var _arcline = _interopRequireDefault(require("./line/arcline"));

var _hexagon_3d = _interopRequireDefault(require("./heatmap/hexagon_3d"));

var _extrude_buffer2 = _interopRequireDefault(require("./point/extrude_buffer"));

var _factory = require("./factory");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Polygon
// Point
// Line
// heatmap
// 3D Shape
// Point
(0, _factory.registerBuffer)('point', 'fill', _fill_buffer2["default"]); // polygon

(0, _factory.registerBuffer)('polygon', 'fill', _fill_buffer["default"]);
(0, _factory.registerBuffer)('polygon', 'extrude', _extrude_buffer["default"]);
(0, _factory.registerBuffer)('polygon', 'line', _line_buffer["default"]); // line

(0, _factory.registerBuffer)('line', 'line', _meshline["default"]);
(0, _factory.registerBuffer)('line', 'arc', _arcline["default"]);
(0, _factory.registerBuffer)('line', 'greatCircle', _arcline["default"]); // heatmap
// registerBuffer('heatmap', 'square', Grid3D);
// registerBuffer('heatmap', 'squareColumn', Grid3D);

(0, _factory.registerBuffer)('heatmap', 'shape', _hexagon_3d["default"]);
(0, _factory.registerBuffer)('point', 'shape', _hexagon_3d["default"]); // 3D Shape

(0, _factory.registerBuffer)('shape', 'extrude', _extrude_buffer2["default"]);