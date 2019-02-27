/**
 * 生成四边形热力图
 */
import * as statistics from './statistics';

const R_EARTH = 6378000;

/**
 * 计算方格密度图
 * @param {*} data 经纬度数据 和属性数据
 * @param {*} size 半径大小 单位 km
 * @return
 */
export function aggregatorToGrid(data, option) {
  const dataArray = data.dataArray;
  const { size = 10 } = option;
  const { gridHash, gridOffset } = _pointsGridHash(dataArray, size);
  const layerData = _getGridLayerDataFromGridHash(gridHash, gridOffset, option);
  return {
    yOffset: gridOffset.xOffset / 360 * (256 << 20) / 2,
    xOffset: gridOffset.xOffset / 360 * (256 << 20) / 2,
    dataArray: layerData
  };
}

function _pointsGridHash(dataArray, size) {
  let latMin = Infinity;
  let latMax = -Infinity;
  let pLat;
  for (let index = 0; index < dataArray.length; index++) {
    const point = dataArray[index];
    pLat = point.coordinates[1];
    if (Number.isFinite(pLat)) {
      latMin = pLat < latMin ? pLat : latMin;
      latMax = pLat > latMax ? pLat : latMax;
    }

  }
  // const centerLat = (latMin + latMax) / 2;
  const centerLat = 34.54083;
  const gridOffset = _calculateGridLatLonOffset(size, centerLat);
  if (gridOffset.xOffset <= 0 || gridOffset.yOffset <= 0) {
    return { gridHash: {}, gridOffset };
  }
  const gridHash = {};
  for (let index = 0; index < dataArray.length; index++) {
    const point = dataArray[index];
    const lat = point.coordinates[1];
    const lng = point.coordinates[0];

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      const latIdx = Math.floor((lat + 90) / gridOffset.yOffset);
      const lonIdx = Math.floor((lng + 180) / gridOffset.xOffset);
      const key = `${latIdx}-${lonIdx}`;

      gridHash[key] = gridHash[key] || { count: 0, points: [] };
      gridHash[key].count += 1;
      gridHash[key].points.push(point);
    }
  }

  return { gridHash, gridOffset };
}
// 计算网格偏移量
function _calculateGridLatLonOffset(cellSize, latitude) {
  const yOffset = _calculateLatOffset(cellSize);
  const xOffset = _calculateLonOffset(latitude, cellSize);
  return { yOffset, xOffset };
}

function _calculateLatOffset(dy) {
  return (dy / R_EARTH) * (180 / Math.PI);
}

function _calculateLonOffset(lat, dx) {
  return ((dx / R_EARTH) * (180 / Math.PI)) / Math.cos((lat * Math.PI) / 180);
}
function _getGridLayerDataFromGridHash(gridHash, gridOffset, option) {
  return Object.keys(gridHash).reduce((accu, key, i) => {
    const idxs = key.split('-');
    const latIdx = parseInt(idxs[0], 10);
    const lonIdx = parseInt(idxs[1], 10);
    const item = {};
    if (option.field && option.method) {
      const columns = getColumn(gridHash[key].points, option.field);
      item[option.method] = statistics[option.method](columns);
    }
    Object.assign(item, {
      _id: i + 1,
      coordinates: [ -180 + gridOffset.xOffset * lonIdx, -90 + gridOffset.yOffset * latIdx ],
      count: gridHash[key].count
    });
    accu.push(item);
    return accu;
  }, []);
}
function getColumn(data, columnName) {
  return data.map(item => {
    return item[columnName];
  });
}
