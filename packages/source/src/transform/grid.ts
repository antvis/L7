/**
 * 生成四边形热力图
 * 使用屏幕像素坐标进行网格划分，确保网格闭合
 */
import type { IParseDataItem, IParserData, ITransform } from '@antv/l7-core';
import { Satistics, aProjectFlat } from '@antv/l7-utils';

interface IGridHash {
  [key: string]: { count: number; points: IParseDataItem[] };
}

const R_EARTH = 6378000;
const SQRT2 = Math.sqrt(2);

export function aggregatorToGrid(data: IParserData, option: ITransform) {
  const dataArray = data.dataArray;
  const { size = 10, method = 'sum' } = option;

  // 计算网格的像素大小（与 hexagon 一致的计算方式）
  const pixlSize = ((size / (2 * Math.PI * R_EARTH)) * (256 << 20)) / 2;

  // 先将所有点投影到屏幕坐标
  const screenPoints = dataArray.map((point: IParseDataItem) => {
    const [x, y] = aProjectFlat(point.coordinates);
    return {
      ...point,
      screenCoords: [x, y] as [number, number],
    };
  });

  // 使用屏幕坐标划分网格
  const gridHash: IGridHash = {};
  for (const point of screenPoints) {
    const [x, y] = point.screenCoords;
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;

    // 计算网格索引
    const colIdx = Math.floor(x / pixlSize);
    const rowIdx = Math.floor(y / pixlSize);
    const key = `${colIdx}-${rowIdx}`;

    if (!gridHash[key]) {
      gridHash[key] = { count: 0, points: [] };
    }
    gridHash[key].count += 1;
    gridHash[key].points.push(point);
  }

  // 生成网格数据
  const layerData = Object.entries(gridHash).map(([key, gridData], index) => {
    const [colIdx, rowIdx] = key.split('-').map(Number);
    const item: Record<string, any> = {};

    if (option.field && method) {
      const columns = Satistics.getColumn(gridData.points, option.field);
      item[method] = Satistics.statMap[method](columns);
    }

    // 网格中心点（屏幕坐标）
    const centerX = (colIdx + 0.5) * pixlSize;
    const centerY = (rowIdx + 0.5) * pixlSize;

    return {
      ...item,
      [option.method || 'sum']: item[method],
      count: gridData.count,
      rawData: gridData.points,
      coordinates: [centerX, centerY],
      _id: index,
    };
  });

  // 正方形顶点范围是 [-√2/2, √2/2]，总宽度 = √2
  // shader 中 offset = a_Position.xy * u_radius
  // 实际渲染尺寸 = √2 * xOffset
  // 要实现闭合：渲染尺寸 = 网格间距 = pixlSize
  // 所以：xOffset = pixlSize / √2
  return {
    yOffset: pixlSize / SQRT2,
    xOffset: pixlSize / SQRT2,
    radius: pixlSize,
    type: 'grid',
    dataArray: layerData,
  };
}
