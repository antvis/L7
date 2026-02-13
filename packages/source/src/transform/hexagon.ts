import type { IParseDataItem, IParserData, ITransform } from '@antv/l7-core';
import { Satistics, aProjectFlat } from '@antv/l7-utils';
import { hexbin } from 'd3-hexbin';

const R_EARTH = 6378000;

interface IHexBinItem<T> extends Array<T> {
  x: number;
  y: number;
  [key: string]: any;
}
interface IRawData {
  coordinates: [number, number];
  [key: string]: any;
}

export function pointToHexbin(data: IParserData, option: ITransform) {
  const dataArray = data.dataArray;
  const { size = 10, method = 'sum' } = option;
  // pixlSize 是 d3-hexbin 的外接圆半径 r
  const pixlSize = ((size / (2 * Math.PI * R_EARTH)) * (256 << 20)) / 2;
  const screenPoints: IRawData[] = dataArray.map((point: IParseDataItem) => {
    const [x, y] = aProjectFlat(point.coordinates);
    return {
      ...point,
      coordinates: [x, y],
    };
  });

  const newHexbin = hexbin<IRawData>()
    .radius(pixlSize)
    .x((d: IRawData) => d.coordinates[0])
    .y((d: IRawData) => d.coordinates[1]);
  const hexbinBins = newHexbin(screenPoints);

  // d3-hexbin 使用 pointy-top 方向（尖角朝上），其关键参数：
  // - 外接圆半径 r = pixlSize
  // - 水平网格间距 dx = r * √3 = pixlSize * √3
  // - 垂直网格间距 dy = r * 1.5 = pixlSize * 1.5
  //
  // pointy-top 六边形顶点坐标范围：
  // - x ∈ [-√3/2, √3/2]，总宽度 = √3（单位圆情况下）
  // - y ∈ [-1, 1]，总高度 = 2（单位圆情况下）
  //
  // 渲染时 shader 计算：offset = a_Position.xy * u_radius
  // 六边形渲染尺寸 = 顶点范围 * u_radius
  // - 渲染宽度 = √3 * xOffset
  // - 渲染高度 = 2 * yOffset
  //
  // 蜂窝网格闭合条件：相邻六边形共享边缘
  // - 相邻六边形中心距离 = √3 * r（共享边缘的两六边形）
  // - 边缘中点到中心距离 = √3/2 * r
  // - 两个共享边缘的六边形，边缘中点重合，中心距离 = √3 * r
  //
  // 设置 xOffset = yOffset = pixlSize 时：
  // - 渲染宽度 = pixlSize * √3 = dx（水平方向闭合）
  // - 渲染高度 = pixlSize * 2（相邻行有重叠，通过交错排列实现边缘共享）

  const result: IParserData = {
    dataArray: hexbinBins.map((hex: IHexBinItem<IRawData>, index: number) => {
      if (option.field && method) {
        const columns = Satistics.getColumn(hex, option.field);
        hex[method] = Satistics.statMap[method](columns);
      }
      return {
        [option.method]: hex[method],
        count: hex.length,
        rawData: hex,
        coordinates: [hex.x, hex.y],
        _id: index,
      };
    }),
    radius: pixlSize,
    xOffset: pixlSize, // 渲染宽度 = √3 * pixlSize = dx
    yOffset: pixlSize, // 渲染高度 = 2 * pixlSize
    type: 'hexagon',
  };
  return result;
}
