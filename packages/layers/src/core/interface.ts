import { IAnimateOption, IMapService } from '@antv/l7-core';
import { generateColorRamp, getMask, IColorRamp } from '@antv/l7-utils';
import { styleColor, styleOffset, styleSingle } from '../core/BaseModel';
import {
  anchorType,
  getGlyphQuads,
  IGlyphQuad,
  shapeText,
} from '../utils/symbol-layout';
export enum lineStyleType {
  'solid' = 0.0,
  'dash' = 1.0,
}

export interface ILineLayerStyleOptions {
  opacity: styleSingle;
  lineType?: keyof typeof lineStyleType; // 可选参数、线类型(all - dash/solid)
  dashArray?: [number, number]; //  可选参数、虚线间隔
  segmentNumber?: number;

  forward?: boolean; // 可选参数、是否反向(arcLine)
  lineTexture?: boolean; // 可选参数、是否开启纹理贴图功能(all)
  iconStep?: number; // 可选参数、纹理贴图步长(all)
  iconStepCount?: number; // 可选参数、纹理贴图间隔
  textureBlend?: string; // 可选参数、供给纹理贴图使用(all)
  sourceColor?: string; // 可选参数、设置渐变色的起始颜色(all)
  targetColor?: string; // 可选参数、设置渐变色的终点颜色(all)
  thetaOffset?: number; // 可选参数、设置弧线的偏移量

  globalArcHeight?: number; // 可选参数、地球模式下 3D 弧线的高度
  vertexHeightScale?: number; // 可选参数、lineLayer vertex height scale

  borderWidth?: number; // 可选参数 线边框宽度
  borderColor?: string; // 可选参数 线边框颜色

  heightfixed?: boolean; // 可选参数 高度是否固定

  mask?: boolean; // 可选参数 时候允许蒙层
  maskInside?: boolean; // 可选参数 控制图层是否显示在蒙层的内部
}

export interface IPointLayerStyleOptions {
  opacity: number;
  strokeOpacity: number;
  strokeWidth: number;
  stroke: string;

  textOffset?: [number, number];
  textAnchor?: anchorType;
  spacing?: number;
  padding?: [number, number];
  halo?: number;
  gamma?: number;
  fontWeight?: string;
  fontFamily?: string;
  textAllowOverlap?: boolean;

  // cylinder
  pickLight?: boolean;
  depth?: boolean;
  sourceColor?: string; // 可选参数、设置渐变色的起始颜色(all)
  targetColor?: string; // 可选参数、设置渐变色的终点颜色(all)
  opacityLinear?: {
    enable: boolean;
    dir: string;
  };
  lightEnable: boolean;
  heightfixed?: boolean; // 圆柱体高度是否固定（不随 zoom 发生变化）

  offsets?: styleOffset;
  blend?: string;
  unit?: string;
  mask?: boolean;
  maskInside?: boolean;

  rotation?: number; // angle
  speed?: number;
  animateOption: IAnimateOption;
}

export interface IPolygonLayerStyleOptions {
  opacity: styleSingle;

  opacityLinear: {
    enable: boolean;
    dir: string;
  };

  heightfixed?: boolean; // 挤出几何体高度是否固定（不随 zoom 发生变化）

  pickLight: boolean;
  mask?: boolean;
  maskInside?: boolean;

  // water
  waterTexture?: string;
  speed?: number;
  // ocean
  watercolor?: string;
  watercolor2?: string;
}

export interface IImageLayerStyleOptions {
  opacity: number;
  mask?: boolean;
  maskInside?: boolean;
}

export interface IGeometryLayerStyleOptions {
  opacity: number;
  mask?: boolean;
  maskInside?: boolean;

  mapTexture?: string;

  // planeGeometry
  center?: [number, number];
  width?: number;
  height?: number;

  widthSegments?: number;
  heightSegments?: number;
}

export enum CanvasUpdateType {
  'AWAYS' = 'aways',
  'DRAGEND' = 'dragend',
}

export interface IDrawingOnCanvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  mapService: IMapService;
  size: [number, number];
}
export interface ICanvasLayerStyleOptions {
  zIndex: number;
  update: CanvasUpdateType | string;
  drawingOnCanvas: (option: IDrawingOnCanvas) => void;
  animateOption: IAnimateOption;
}

export interface IHeatMapLayerStyleOptions {
  opacity: number;
  intensity: number;
  radius: number;
  angle: number;
  rampColors: IColorRamp;
  mask?: boolean;
  maskInside?: boolean;

  coverage?: number;
}

export interface IRasterLayerStyleOptions {
  opacity: number;
  domain: [number, number];
  noDataValue: number;
  clampLow: boolean;
  clampHigh: boolean;
  rampColors: IColorRamp;
  mask?: boolean;
  maskInside?: boolean;
}
