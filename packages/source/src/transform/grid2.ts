/**
 * 生成四边形热力图
 */
import {
  IParseDataItem,
  IParserCfg,
  IParserData,
  ISourceCFG,
  ITransform,
} from '@l7/core';
import { aProjectFlat, metersToLngLat } from '@l7/utils';
import { statMap } from './statistics';

interface IGridHash {
  [key: string]: any;
}
interface IGridOffset {
  yOffset: number;
  xOffset: number;
}
interface IRawData {
  coordinates: [number, number];
  [key: string]: any;
}
const R_EARTH = 6378000;

export function aggregatorToGrid(data: IParserData, option: ITransform) {
  const dataArray = data.dataArray;
  const { size = 10 } = option;
  const pixlSize = ((size / (2 * Math.PI * R_EARTH)) * (256 << 20)) / 2;
  const screenPoints: IRawData[] = dataArray.map((point: IParseDataItem) => {
    const [x, y] = aProjectFlat(point.coordinates);
    return {
      ...point,
      coordinates: [parseInt(x.toFixed(0), 10), parseInt(y.toFixed(0), 10)],
    };
  });
  const gridHash = _pointsGridHash(screenPoints, pixlSize);
  const layerData = _getGridLayerDataFromGridHash(gridHash, pixlSize, option);
  return {
    yOffset: pixlSize / 2,
    xOffset: pixlSize / 2,
    dataArray: layerData,
  };
}

function _pointsGridHash(dataArray: any[], size: number) {
  const gridHash: IGridHash = {};
  for (const point of dataArray) {
    const x = point.coordinates[0];
    const y = point.coordinates[1];
    const latIdx = Math.floor(y / size);
    const lonIdx = Math.floor(x / size);
    const key = `${latIdx}-${lonIdx}`;

    gridHash[key] = gridHash[key] || { count: 0, points: [] };
    gridHash[key].count += 1;
    gridHash[key].points.push(point);
  }

  return gridHash;
}

function _getGridLayerDataFromGridHash(
  gridHash: IGridHash,
  size: number,
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
      const columns = getColumn(gridHash[key].points, option.field);
      item[option.method] = statMap[option.method](columns);
    }
    Object.assign(item, {
      _id: i + 1,
      coordinates: [lonIdx * size, latIdx * size],
      count: gridHash[key].count,
    });
    // @ts-ignore
    accu.push(item);
    return accu;
  }, []);
}
function getColumn(data: any[], columnName: string) {
  return data.map((item) => {
    return item[columnName] * 1;
  });
}
