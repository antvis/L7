import { BBox } from '@turf/helpers';

/**
 * 计算地理数据范围
 * @param {dataArray} data 地理坐标数据
 * @return {Array} dataExtent
 */
export function extent(data: any[]) {
  const dataExtent: BBox = [Infinity, Infinity, -Infinity, -Infinity];
  data.forEach((item) => {
    const { coordinates } = item;
    caculExtent(dataExtent, coordinates);
  });
  return dataExtent;
}
function caculExtent(dataExtent: BBox, coords: any[]) {
  if (Array.isArray(coords[0])) {
    coords.forEach((coord) => {
      caculExtent(dataExtent, coord);
    });
  } else {
    if (dataExtent[0] > coords[0]) {
      dataExtent[0] = coords[0];
    }
    if (dataExtent[1] > coords[1]) {
      dataExtent[1] = coords[1];
    }
    if (dataExtent[2] < coords[0]) {
      dataExtent[2] = coords[0];
    }
    if (dataExtent[3] < coords[1]) {
      dataExtent[3] = coords[1];
    }
  }
  return dataExtent;
}

export function tranfrormCoord(data: any[], cb: (item: any[]) => any) {
  return transform(data, cb);
}
function transform(item: any[], cb: (item: any[]) => any): any {
  if (Array.isArray(item[0])) {
    return item.map((coord) => {
      return transform(coord, cb);
    });
  }
  return cb(item);
}
