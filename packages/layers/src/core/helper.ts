import {
  createLayerContainer,
  ILayer,
  ILayerConfig,
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
  rect?: number[]; // 覆盖矩形的数据范围
  coverPixelsBounds?: number[]; // 覆盖矩形的像素范围
  coverBounds?: number[]; // 覆盖矩形的经纬度范围
  bounds?: number[]; // 经纬度矩形
  source?: any;
  data?: number[];
  filterData?: Array<number | null>;
}

export interface IFilterOptions {
  container: Container;
  pickingService: IPickingService;
  polygonPoints: number[];
  maskLayers: ILayer[];
}

export async function createPolygon(
  polygonPoints: number[],
  container: Container,
  maskLayers: ILayer[],
) {
  const polygonData = pointsToPolygon(polygonPoints);
  const source = new Source(polygonData);
  const polygon = await createBaseLayer(
    'PolygonLayer',
    { opacity: 0.5, maskLayers },
    container,
    source,
  );
  return polygon;
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
  const { container, pickingService, polygonPoints, maskLayers } = filterOption;
  const polygon = await createPolygon(polygonPoints, container, maskLayers);
  const { layer2Pixels } = pickingService;
  layer2Pixels(
    polygon,
    pixelBounds,
    ({ pickedColors, pixelMinX, pixelMinY, pixelWidth, pixelHeight }) => {
      const pixels = getPixelsR(pickedColors, pixelWidth, pixelHeight);
      coverRects.forEach((coverRectData) => {
        const { coverPixelsBounds, rect: coverRect, source } = coverRectData;
        coverRectData.filterData = source.filterData(
          coverRect,
          coverPixelsBounds as number[],
          [pixelMinX, pixelMinY],
          pixels,
        );
      });
      callback(coverRects);
      polygon.destroy();
    },
  );
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
  // renderService 在提取像素时，会将像素值放大 DPR 倍，而使用 boundsToContainer 获取的 pixel 坐标按 DPR 1 计算，因此这里需要将像素值缩小 DPR 倍
  const DPR = window.devicePixelRatio;
  for (let i = pixelHeight - 1; i >= 0; i -= DPR) {
    for (let j = 0; j < pixelWidth; j += DPR) {
      data.push(pixels[(i * pixelWidth + j) * 4]);
    }
  }
  return data;
}
