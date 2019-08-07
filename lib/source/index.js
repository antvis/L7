"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "getTransform", {
  enumerable: true,
  get: function get() {
    return _factory.getTransform;
  }
});
Object.defineProperty(exports, "registerTransform", {
  enumerable: true,
  get: function get() {
    return _factory.registerTransform;
  }
});
Object.defineProperty(exports, "getParser", {
  enumerable: true,
  get: function get() {
    return _factory.getParser;
  }
});
Object.defineProperty(exports, "registerParser", {
  enumerable: true,
  get: function get() {
    return _factory.registerParser;
  }
});

var _geojson = _interopRequireDefault(require("./parser/geojson"));

var _image = _interopRequireDefault(require("./parser/image"));

var _csv = _interopRequireDefault(require("./parser/csv"));

var _json = _interopRequireDefault(require("./parser/json"));

var _raster = _interopRequireDefault(require("./parser/raster"));

var _mvt = _interopRequireDefault(require("./parser/mvt"));

var _vector = _interopRequireDefault(require("./parser/vector"));

var _factory = require("./factory");

var _grid = require("./transform/grid");

var _hexagon = require("./transform/hexagon");

var _map = require("./transform/map");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// source parser
(0, _factory.registerParser)('geojson', _geojson["default"]);
(0, _factory.registerParser)('image', _image["default"]);
(0, _factory.registerParser)('csv', _csv["default"]);
(0, _factory.registerParser)('json', _json["default"]);
(0, _factory.registerParser)('raster', _raster["default"]);
(0, _factory.registerParser)('mvt', _mvt["default"]);
(0, _factory.registerParser)('vector', _vector["default"]); // 注册transform

(0, _factory.registerTransform)('grid', _grid.aggregatorToGrid);
(0, _factory.registerTransform)('hexagon', _hexagon.pointToHexbin);
(0, _factory.registerTransform)('map', _map.map);