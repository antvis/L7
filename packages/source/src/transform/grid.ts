/**
 * 生成四边形热力图
 */
import type { IParserData, ITransform } from '@antv/l7-core';
import { Satistics, aProjectFlat } from '@antv/l7-utils';

interface IGridHash {
  [key: string]: any;
}
interface IGridOffset {
  yOffset: number;
  xOffset: number;
}
const R_EARTH = 6378000;

export function aggregatorToGrid(data: IParserData, option: ITransform) {
  const dataArray = data.dataArray;
  const { size = 10 } = option;
  const pixlSize = ((size / (2 * Math.PI * R_EARTH)) * (256 << 20)) / 2;
  const { gridHash, gridOffset } = _pointsGridHash(dataArray, size);
  const layerData = _getGridLayerDataFromGridHash(gridHash, gridOffset, option);
  return {
    yOffset: pixlSize,
    xOffset: pixlSize,
    radius: pixlSize,
    type: 'grid',
    dataArray: layerData,
  };
}

function _pointsGridHash(dataArray: any[], size: number) {
  let latMin = Infinity;
  let latMax = -Infinity;
  let pLat;

  for (const point of dataArray) {
    pLat = point.coordinates[1];
    if (Number.isFinite(pLat)) {
      latMin = pLat < latMin ? pLat : latMin;
      latMax = pLat > latMax ? pLat : latMax;
    }
  }
  const centerLat = (latMin + latMax) / 2;
  const gridOffset = _calculateGridLatLonOffset(size, centerLat);
  if (gridOffset.xOffset <= 0 || gridOffset.yOffset <= 0) {
    return { gridHash: {}, gridOffset };
  }
  const gridHash: IGridHash = {};
  for (const point of dataArray) {
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
function _calculateGridLatLonOffset(cellSize: number, latitude: number) {
  const yOffset = _calculateLatOffset(cellSize);
  const xOffset = _calculateLonOffset(latitude, cellSize);
  return { yOffset, xOffset };
}

function _calculateLatOffset(dy: number) {
  return (dy / R_EARTH) * (180 / Math.PI);
}

function _calculateLonOffset(lat: number, dx: number) {
  return ((dx / R_EARTH) * (180 / Math.PI)) / Math.cos((lat * Math.PI) / 180);
}
function _getGridLayerDataFromGridHash(
  gridHash: IGridHash,
  gridOffset: IGridOffset,
  option: ITransform,
) {
  return Object.keys(gridHash).reduce((accu, key, i) => {
    const idxs = key.split('-');
    const latIdx = parseInt(idxs[0], 10);
    const lonIdx = parseInt(idxs[1], 10);
    const item: {
      [key: string]: any;
    } = {};
    if (option.field && option.method) {
      const columns = Satistics.getColumn(gridHash[key].points, option.field);
      item[option.method] = Satistics.statMap[option.method](columns);
    }
    Object.assign(item, {
      _id: i,
      coordinates: aProjectFlat([
        -180 + gridOffset.xOffset * (lonIdx + 0.5),
        -90 + gridOffset.yOffset * (latIdx + 0.5),
      ]),
      rawData: gridHash[key].points,
      count: gridHash[key].count,
    });
    // @ts-ignore
    accu.push(item);
    return accu;
  }, []);
}
