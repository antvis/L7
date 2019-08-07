"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggregatorToGrid = aggregatorToGrid;

var statistics = _interopRequireWildcard(require("./statistics"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

/**
 * 生成四边形热力图
 */
var R_EARTH = 6378000;

function aggregatorToGrid(data, option) {
  var dataArray = data.dataArray;
  var _option$size = option.size,
      size = _option$size === void 0 ? 10 : _option$size;

  var _pointsGridHash2 = _pointsGridHash(dataArray, size),
      gridHash = _pointsGridHash2.gridHash,
      gridOffset = _pointsGridHash2.gridOffset;

  var layerData = _getGridLayerDataFromGridHash(gridHash, gridOffset, option);

  return {
    yOffset: gridOffset.xOffset / 360 * (256 << 20) / 2,
    xOffset: gridOffset.xOffset / 360 * (256 << 20) / 2,
    radius: gridOffset.xOffset / 360 * (256 << 20) / 2,
    dataArray: layerData
  };
}

function _pointsGridHash(dataArray, size) {
  var latMin = Infinity;
  var latMax = -Infinity;
  var pLat;

  for (var index = 0; index < dataArray.length; index++) {
    var point = dataArray[index];
    pLat = point.coordinates[1];

    if (Number.isFinite(pLat)) {
      latMin = pLat < latMin ? pLat : latMin;
      latMax = pLat > latMax ? pLat : latMax;
    }
  } // const centerLat = (latMin + latMax) / 2;


  var centerLat = 34.54083;

  var gridOffset = _calculateGridLatLonOffset(size, centerLat);

  if (gridOffset.xOffset <= 0 || gridOffset.yOffset <= 0) {
    return {
      gridHash: {},
      gridOffset: gridOffset
    };
  }

  var gridHash = {};

  for (var _index = 0; _index < dataArray.length; _index++) {
    var _point = dataArray[_index];
    var lat = _point.coordinates[1];
    var lng = _point.coordinates[0];

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      var latIdx = Math.floor((lat + 90) / gridOffset.yOffset);
      var lonIdx = Math.floor((lng + 180) / gridOffset.xOffset);
      var key = "".concat(latIdx, "-").concat(lonIdx);
      gridHash[key] = gridHash[key] || {
        count: 0,
        points: []
      };
      gridHash[key].count += 1;
      gridHash[key].points.push(_point);
    }
  }

  return {
    gridHash: gridHash,
    gridOffset: gridOffset
  };
} // 计算网格偏移量


function _calculateGridLatLonOffset(cellSize, latitude) {
  var yOffset = _calculateLatOffset(cellSize);

  var xOffset = _calculateLonOffset(latitude, cellSize);

  return {
    yOffset: yOffset,
    xOffset: xOffset
  };
}

function _calculateLatOffset(dy) {
  return dy / R_EARTH * (180 / Math.PI);
}

function _calculateLonOffset(lat, dx) {
  return dx / R_EARTH * (180 / Math.PI) / Math.cos(lat * Math.PI / 180);
}

function _getGridLayerDataFromGridHash(gridHash, gridOffset, option) {
  return Object.keys(gridHash).reduce(function (accu, key, i) {
    var idxs = key.split('-');
    var latIdx = parseInt(idxs[0], 10);
    var lonIdx = parseInt(idxs[1], 10);
    var item = {};

    if (option.field && option.method) {
      var columns = getColumn(gridHash[key].points, option.field);
      item[option.method] = statistics[option.method](columns);
    }

    Object.assign(item, {
      _id: i + 1,
      coordinates: [-180 + gridOffset.xOffset * lonIdx, -90 + gridOffset.yOffset * latIdx],
      count: gridHash[key].count
    });
    accu.push(item);
    return accu;
  }, []);
}

function getColumn(data, columnName) {
  return data.map(function (item) {
    return item[columnName];
  });
}