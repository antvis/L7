"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cluster = cluster;
exports.formatData = formatData;

var _supercluster = _interopRequireDefault(require("supercluster/dist/supercluster"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function cluster(data, option) {
  var _option$radius = option.radius,
      radius = _option$radius === void 0 ? 80 : _option$radius,
      _option$maxZoom = option.maxZoom,
      maxZoom = _option$maxZoom === void 0 ? 18 : _option$maxZoom,
      _option$minZoom = option.minZoom,
      minZoom = _option$minZoom === void 0 ? 0 : _option$minZoom,
      field = option.field,
      _option$zoom = option.zoom,
      zoom = _option$zoom === void 0 ? 2 : _option$zoom;

  if (data.pointIndex) {
    var _clusterPoint = data.pointIndex.getClusters(data.extent, zoom);

    data.dataArray = formatData(_clusterPoint);
    return data;
  }

  var pointIndex = new _supercluster["default"]({
    radius: radius,
    minZoom: minZoom,
    maxZoom: maxZoom,
    map: function map(props) {
      return {
        sum: props[field]
      };
    },
    reduce: function reduce(accumulated, props) {
      accumulated.sum += props.sum;
    }
  });
  var geojson = {
    type: 'FeatureCollection'
  };
  geojson.features = data.dataArray.map(function (item) {
    return {
      type: 'Feature',
      properties: _defineProperty({}, field, item[field]),
      geometry: {
        type: 'Point',
        coordinates: item.coordinates
      }
    };
  });
  pointIndex.load(geojson.features);
  var clusterPoint = pointIndex.getClusters(data.extent, zoom);
  var resultData = clusterPoint.map(function (point, index) {
    return _objectSpread({
      coordinates: point.geometry.coordinates,
      _id: index + 1
    }, point.properties);
  });
  data.dataArray = resultData;
  return {
    data: data,
    pointIndex: pointIndex
  };
}

function formatData(clusterPoint) {
  return clusterPoint.map(function (point, index) {
    return _objectSpread({
      coordinates: point.geometry.coordinates,
      _id: index + 1
    }, point.properties);
  });
}