import { lodashUtil } from '@antv/l7-utils';
// @ts-ignore
import rewind from '@mapbox/geojson-rewind';
import type { Feature, FeatureCollection, Geometries } from '@turf/helpers';
import type { IRasterFileData, IRasterLayerData } from '../interface';

interface IDataItem {
  [key: string]: any;
}

export function getColumn(data: IDataItem[], columnName: string) {
  return data.map((item: IDataItem) => {
    return item[columnName] * 1;
  });
}

export function isRasterFileData(data?: IRasterLayerData) {
  if (data === undefined) {
    return false;
  }
  if (!Array.isArray(data) && data.data !== undefined) {
    return true;
  } else {
    return false;
  }
}

export function isRasterFileDataArray(data: IRasterLayerData) {
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return false;
    }
    if (isRasterFileData(data[0] as IRasterFileData)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export function isNumberArray(data: IRasterLayerData) {
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return true;
    }
    if (typeof data[0] === 'number') {
      return true;
    } else {
      return false;
    }
  }
  return false;
}

/**
 * enforce polygon ring winding order for geojson
 * https://github.com/mapbox/geojson-rewind
 * @param geojson
 * @returns geojson
 */
export function geojsonRewind<T extends FeatureCollection | Feature | Geometries>(geojson: T) {
  // rewind 方法会修改原始数据，frozen 的数据，需要深度克隆后才能修改
  const data = Object.isFrozen(geojson) ? lodashUtil.cloneDeep(geojson) : geojson;

  // 设置地理多边形方向 If clockwise is true, the outer ring is clockwise, otherwise it is counterclockwise.
  rewind(data, true);

  return data;
}

// raster and image layer  extentToCoord
export function extentToCoord(
  coord: [number, number][] | undefined,
  extent: [number, number, number, number],
) {
  return coord
    ? coord
    : [
        [extent[0], extent[3]],
        [extent[2], extent[3]],
        [extent[2], extent[1]],
        [extent[0], extent[1]],
      ];
}
