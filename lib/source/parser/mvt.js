"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = mvt;

var _pbf = _interopRequireDefault(require("pbf"));

var VectorParser = _interopRequireWildcard(require("@mapbox/vector-tile"));

var _geojson = _interopRequireDefault(require("./geojson"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function mvt(data, cfg) {
  var tile = new VectorParser.VectorTile(new _pbf["default"](data));
  var layerName = cfg.sourceLayer;
  var features = [];
  var vectorLayer = tile.layers[layerName];

  if (vectorLayer === undefined) {
    return null;
  }

  for (var i = 0; i < vectorLayer.length; i++) {
    var feature = vectorLayer.feature(i);
    var geofeature = feature.toGeoJSON(cfg.tile[0], cfg.tile[1], cfg.tile[2]);
    features.push(geofeature);
  }

  var geodata = {
    type: 'FeatureCollection',
    features: features
  };
  return features.length === 0 ? null : (0, _geojson["default"])(geodata, cfg);
}