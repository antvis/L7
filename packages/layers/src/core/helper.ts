// layer helpers

import {
  createLayerContainer,
  ILayer,
  ILayerConfig,
  IMapService,
  IPickingService,
  ISource,
} from '@antv/l7-core';
import Source from '@antv/l7-source';
import { pointsToPolygon } from '@antv/l7-utils';
import { Container } from 'inversify';
import LineLayer from '../line';
import PointLayer from '../point';
import PolygonLayer from '../polygon';
import { IBaseLayerStyleOptions } from './interface';

export async function createBaseLayer(
  type: string,
  layerConfig: Partial<ILayerConfig & IBaseLayerStyleOptions>,
  sceneContainer: Container,
  source: ISource,
) {
  let layer: ILayer;
  switch (type) {
    case 'PointLayer':
      layer = new PointLayer(layerConfig);
      break;
    case 'LineLayer':
      layer = new LineLayer(layerConfig);
      break;
    case 'PolygonLayer':
      layer = new PolygonLayer(layerConfig);
      break;
    // TODO: add more layer types
    default:
      layer = new PointLayer(layerConfig);
  }
  const container = createLayerContainer(sceneContainer);
  layer.setContainer(container, sceneContainer as Container);
  layer.source(source);
  await layer.init();
  return layer;
}

export interface ICoverRect {
  tileKey?: string;
  data: number[]; // 数据
  rect: number[]; // 覆盖矩形的数据范围
  bounds: number[]; // 经纬度矩形
  filterData?: Array<number | null>;
}

export interface IFilterOptions {
  container: Container;
  mapService: IMapService;
  pickingService: IPickingService;
  polygonPoints: number[];
}

export enum ListType {
  POINT = 'POINT', // 单个点
  BOUNDS = 'BOUNDS', // 矩形范围
  POLYGON = 'POLYGON', // 多边形范围
  INVALID = 'INVALID', // 无效的边界数据
  ALL = 'ALL', // 获取所有数据
}

/**
 * 判断点集列表的类型
 * @param points
 * @returns
 */
export function listType(points?: number[]) {
  if (!points || points.length === 0) {
    return ListType.ALL;
  }

  const len = points.length;

  if (len === 1 || len === 3) {
    return ListType.INVALID;
  }

  if (len === 2) {
    return ListType.POINT;
  }

  if (len === 4) {
    return ListType.BOUNDS;
  }

  if (len % 2 === 0) {
    return ListType.POLYGON;
  } else {
    return ListType.INVALID;
  }
}

/**
 *
 * @param filterOption 过滤参数、包括图层参数以及必要的 service
 * @param coverRects 被过滤的重叠数据
 * @param pixelBounds 提取像素的范围（像素范围 >= 重叠数据的像素范围）
 * @param callback
 */
export async function filterByPolygon(
  filterOption: IFilterOptions,
  coverRects: ICoverRect[],
  pixelBounds: number[],
  callback: (data: any) => void,
) {
  const { container, pickingService, mapService, polygonPoints } = filterOption;

  // 创建用于过滤数据的多边形图层
  const polygonData = pointsToPolygon(polygonPoints);
  const source = new Source(polygonData);
  const polygon = await createBaseLayer(
    'PolygonLayer',
    { opacity: 0.5 },
    container,
    source,
  );

  const { render: pickRender, extractPixels } = pickingService;
  pickRender(polygon, () => {
    // 根据绘制的几何形状像素纹理过滤有效值
    const {
      pickedColors,
      x: pixelMinX,
      y: pixelMinY,
      width,
      height,
    } = extractPixels(pixelBounds);
    const pixels = getPixelsR(pickedColors, width, height);
    coverRects.forEach((coverRectData) => {
      coverRectData.filterData = pixelFilter(
        mapService,
        coverRectData,
        [pixelMinX, pixelMinY],
        pixels,
      );
    });
    callback(coverRects);
    polygon.destroy();
  });
}

/**
 * 过滤数据
 * @param coverRectData
 * @param pixelBounds
 * @param pixels
 * @returns
 */
function pixelFilter(
  mapService: IMapService,
  coverRectData: any,
  pixelBounds: number[],
  pixels: number[],
) {
  const {
    bounds: coverBounds,
    rect: coverRect,
    data: coverData,
  } = coverRectData;
  const coverPixelsBounds = mapService.boundsToContainer(coverBounds);
  // 数据的宽高
  const coverWidthCount = coverRect[2] - coverRect[0]; // data width
  const coverHeightCount = coverRect[3] - coverRect[1]; // data height
  const coverDataSize = [coverWidthCount, coverHeightCount];
  return filterByPixel(
    coverPixelsBounds,
    coverData,
    coverDataSize,
    pixelBounds,
    pixels,
  );
}

/**
 * |------------------------------|
 * |  pixelBounds                 |
 * |   |----------------------|   |
 * |   |  coverPixelsBounds   |   |
 * |   |                      |   |
 * |   |                      |   |
 * |   |                      |   |
 * |   |----------------------|   |
 * |                              |
 * |------------------------------|
 * @param coverPixelsBounds cover rect 的像素坐标范围以及数据宽高
 * @param coverData         cover rect 的数据
 * @param coverDataSize     cover rect 的数据宽高
 * @param pixelBounds       pixels 的像素坐标范围
 * @param pixelData         pixels 的数据
 * 1. 根据 cover rect 中的值计算在 pixels 中对应的值
 * 2. 根据对应 pixels 中的值判断 cover rect 的值是否有效
 * 3. 过滤 cover rect 中有效的值
 */
export function filterByPixel(
  coverPixelsBounds: number[],
  coverData: number[],
  coverDataSize: number[],
  pixelBounds: number[],
  pixelData: number[],
) {
  const [coverPixelMinX, coverPixelMinY, coverPixelMaxX, coverPixelMaxY] =
    coverPixelsBounds;
  // 数据的宽高
  const [coverWidthCount, coverHeightCount] = coverDataSize;
  const [pixelMinX, pixelMinY] = pixelBounds;
  // 覆盖矩形的像素宽高
  const coverPixelHeight = coverPixelMaxY - coverPixelMinY;
  const coverPixelWidth = coverPixelMaxX - coverPixelMinX;

  // 覆盖矩形的像素坐标与过滤的几何形状的像素坐标的偏移量
  const offsetX = coverPixelMinX - pixelMinX;
  const offsetY = coverPixelMinY - pixelMinY;

  // 判断覆盖的矩形区域数据是否在过滤的几何形状内部（根据 pickFrameBuffer 的渲染纹理进行判断）
  const filterData = [];
  for (let y = 0; y < coverHeightCount; y++) {
    for (let x = 0; x < coverWidthCount; x++) {
      // 将坐标转换为像素坐标，并根据像素坐标从 pickFrameBuffer 中提取对应的像素值
      // 计算数据坐标对应的像素点位的坐标
      const pixelX = Math.floor(
        offsetX + (x * coverPixelWidth) / coverWidthCount,
      );
      const pixelY = Math.floor(
        offsetY + (y * coverPixelHeight) / coverHeightCount,
      );
      const pixelIndex = pixelY * coverPixelWidth + pixelX;
      // 根据像素值判断
      if (pixelData[pixelIndex] > 0) {
        // 数据在几何形状内部
        const coverDataIndex = y * coverWidthCount + x;
        filterData.push(coverData[coverDataIndex]);
      } else {
        filterData.push(null);
      }
    }
  }
  return filterData;
}

/**
 *
 * @param pixels 从渲染贴图中提取的颜色像素值
 * @param pixelWidth
 * @param pixelHeight
 * @returns
 */
export function getPixelsR(
  pixels: number[] | Uint8Array,
  pixelWidth: number,
  pixelHeight: number,
) {
  // 将像素值上下翻转，使得数据与渲染贴图一致（ pixels 的数据值与实际的渲染结果上下颠倒 ）
  const data = [];
  for (let i = pixelHeight - 1; i >= 0; i--) {
    for (let j = 0; j < pixelWidth; j++) {
      data.push(pixels[(i * pixelWidth + j) * 4]);
    }
  }
  return data;
}
