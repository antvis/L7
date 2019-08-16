"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = geoJSON;

var turfMeta = _interopRequireWildcard(require("@turf/meta"));

var _invariant = require("@turf/invariant");

var _bkdrHash = require("../../util/bkdr-hash");

var _geojsonRewind = _interopRequireDefault(require("@mapbox/geojson-rewind"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function geoJSON(data, cfg) {
  // 矢量瓦片图层不做 rewind
  (0, _geojsonRewind["default"])(data, true);
  var resultData = [];
  var featureKeys = {};
  data.features = data.features.filter(function (item) {
    return item != null && item.geometry && item.geometry.type && item.geometry.coordinates && item.geometry.coordinates.length > 0;
  }); // 数据为空时处理

  var i = 0;
  turfMeta.flattenEach(data, function (currentFeature, featureIndex) {
    // 多个polygon 拆成一个
    var coord = (0, _invariant.getCoords)(currentFeature);
    var id = featureIndex + 1;

    if (cfg.idField && currentFeature.properties[cfg.idField]) {
      var value = currentFeature.properties[cfg.idField];
      id = (0, _bkdrHash.djb2hash)(value) % 1000019;
      featureKeys[id] = {
        index: i++,
        idField: value
      };
    }

    var dataItem = _objectSpread({}, currentFeature.properties, {
      coordinates: coord,
      _id: id
    });

    resultData.push(dataItem);
  });
  return {
    dataArray: resultData,
    featureKeys: featureKeys
  };
}