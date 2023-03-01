import { project } from '@antv/l7-utils';
import LineLayer from '../../line';
import PointLayer from '../../point/index';
import PolygonLayer from '../../polygon';

export function getTileLayer(type: string) {
  if (type === 'PolygonLayer') {
    return PolygonLayer;
  }
  if (type === 'LineLayer') {
    return LineLayer;
  }
  if (type === 'PointLayer') {
    return PointLayer;
  }
  return PointLayer;
}

export function isNeedMask(type: string) {
  return ['PolygonLayer', 'LineLayer'].indexOf(type) !== -1;
}

export function isRect(bounds: number[]) {
  if (bounds.length > 4) {
    return false;
  } else {
    return true;
  }
}

/**
 * 计算经纬度在二维数据中的位置
 * 由于二维数组数据的分布是均匀的，而经纬度的分布是不均匀的，因此统一将经纬度转换成平面坐标后进行计算
 * @param lnglat
 * @param width   二维数据的宽度
 * @param height  二维数据的高度
 * @param bounds
 * @returns
 */
export function projectRect(
  lngLat: number[],
  width: number,
  height: number,
  bounds: number[],
) {
  /**
   * minLng, maxLat --- * -> x 正方向
   * |                  |
   * |                  |
   * * ---------- maxLng, minLat
   * ｜
   * v y 正方向
   */
  const [lng, lat] = lngLat;
  const [minLng, minLat, maxLng, maxLat] = bounds;

  const [pointX, pointY] = project([lng, lat]);
  const [minX, minY] = project([minLng, maxLat]);
  const [maxX, maxY] = project([maxLng, minLat]);
  const x = Math.round(((pointX - minX) / (maxX - minX)) * width);
  const y = Math.round(((pointY - minY) / (maxY - minY)) * height);
  return [x, y]; // 返回在二维数据中的位置
}

/**
 * 按照矩形从栅格数据中提取数据
 * @param data
 * @param rect
 * @param width 二维数据的宽度
 * @returns
 */
export function getRectData(data: number[], width: number, rect: number[]) {
  const [minX, minY, maxX, maxY] = rect;
  const selectedData = [];
  for (let i = minY; i < maxY; i++) {
    for (let j = minX; j < maxX; j++) {
      const index = i * width + j;
      const d = data[index];
      selectedData.push(d);
    }
  }
  return selectedData;
}
