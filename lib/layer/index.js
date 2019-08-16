"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "registerLayer", {
  enumerable: true,
  get: function get() {
    return _factory.registerLayer;
  }
});
Object.defineProperty(exports, "LAYER_MAP", {
  enumerable: true,
  get: function get() {
    return _factory.LAYER_MAP;
  }
});
Object.defineProperty(exports, "getLayer", {
  enumerable: true,
  get: function get() {
    return _factory.getLayer;
  }
});

var _factory = require("./factory");

var _polygon_layer = _interopRequireDefault(require("./polygon_layer"));

var _point_layer = _interopRequireDefault(require("./point_layer"));

var _line_layer = _interopRequireDefault(require("./line_layer"));

var _image_layer = _interopRequireDefault(require("./image_layer"));

var _raster_layer = _interopRequireDefault(require("./raster_layer"));

var _heatmap_layer = _interopRequireDefault(require("./heatmap_layer"));

var _tile_layer = _interopRequireDefault(require("./tile/tile_layer"));

var _image_tile_layer = _interopRequireDefault(require("./tile/image_tile_layer"));

var _vector_tile_layer = _interopRequireDefault(require("./tile/vector_tile_layer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(0, _factory.registerLayer)('PolygonLayer', _polygon_layer["default"]);
(0, _factory.registerLayer)('PointLayer', _point_layer["default"]);
(0, _factory.registerLayer)('LineLayer', _line_layer["default"]);
(0, _factory.registerLayer)('ImageLayer', _image_layer["default"]);
(0, _factory.registerLayer)('RasterLayer', _raster_layer["default"]);
(0, _factory.registerLayer)('HeatmapLayer', _heatmap_layer["default"]);
(0, _factory.registerLayer)('TileLayer', _tile_layer["default"]);
(0, _factory.registerLayer)('ImageTileLayer', _image_tile_layer["default"]);
(0, _factory.registerLayer)('VectorTileLayer', _vector_tile_layer["default"]);