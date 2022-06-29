import { IAnimateOption, IMapService } from '@antv/l7-core';
import { IColorRamp, IImagedata } from '@antv/l7-utils';
import { styleOffset, styleSingle } from '../core/BaseModel';
import { anchorType } from '../utils/symbol-layout';
export enum lineStyleType {
  'solid' = 0.0,
  'dash' = 1.0,
}

interface ILineArrow {
  enable: boolean;
  arrowWidth: number;
  arrowHeight: number;
  tailWidth: number;
}

export interface ILineLayerStyleOptions {
  tileOrigin?: number[];
  coord?: string;

  opacity: styleSingle;
  lineType?: keyof typeof lineStyleType; // 可选参数、线类型(all - dash/solid)
  dashArray?: [number, number]; //  可选参数、虚线间隔
  segmentNumber?: number;

  depth?: boolean;
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
  raisingHeight?: number; // 线图层抬升高度

  mask?: boolean; // 可选参数 时候允许蒙层
  maskInside?: boolean; // 可选参数 控制图层是否显示在蒙层的内部

  arrow?: ILineArrow;

  rampColors?: IColorRamp;
  featureId?: string;
  sourceLayer?: string;
}

export interface IPointLayerStyleOptions {
  tileOrigin?: number[];
  coord?: string;
  opacity: number;
  strokeOpacity: number;
  strokeWidth: number;
  stroke: string;

  blur?: number;

  // text
  textOffset?: [number, number];
  textAnchor?: anchorType;
  spacing?: number;
  padding?: [number, number];
  halo?: number;
  gamma?: number;
  fontWeight?: string;
  fontFamily?: string;
  textAllowOverlap?: boolean;

  raisingHeight?: number; // 线图层抬升高度

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
  featureId?: string;
  sourceLayer?: string;
}

export interface IPolygonLayerStyleOptions {
  tileOrigin?: number[];
  coord?: string;
  opacity?: number;

  opacityLinear?: {
    enable: boolean;
    dir: string;
  };

  topsurface?: boolean;
  sidesurface?: boolean;

  mapTexture?: string; // 挤出几何体顶面贴图
  raisingHeight?: number; // 挤出几何体抬升高度
  sourceColor?: string; // 可选参数、设置渐变色的起始颜色(all)
  targetColor?: string; // 可选参数、设置渐变色的终点颜色(all)
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

  featureId?: string;
  sourceLayer?: string;
}

// 栅格瓦片图层
export interface IRasterTileLayerStyleOptions {
  // TODO: define
  zIndex?: number;
  opacity?: number;
}
export interface IMaskLayerStyleOptions {
  opacity: styleSingle;
}

export interface IWindLayerStyleOptions {
  uMin?: number;
  uMax?: number;
  vMin?: number;
  vMax?: number;
  fadeOpacity?: number;
  speedFactor?: number;
  dropRate?: number;
  dropRateBump?: number;
  opacity?: number;
  numParticles?: number;
  rampColors?: {
    [key: number]: string;
  };
  sizeScale?: number;
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
  terrainTexture?: string;

  // planeGeometry
  center?: [number, number];
  width?: number;
  height?: number;

  widthSegments?: number;
  heightSegments?: number;

  terrainClipHeight?: number;
  rgb2height?: (r: number, g: number, b: number) => number;

  // billboard
  raisingHeight?: number; // 抬升高度
  canvasWidth?: number;
  canvasHeight?: number;
  drawCanvas?: (canvas: HTMLCanvasElement) => void;

  // sprite
  spriteAnimate?: string;
  spriteRadius?: number;
  spriteCount?: number;
  spriteSpeed?: number;
  spriteTop?: number;
  spriteBottom?: number;
  spriteUpdate?: number;
  spriteScale?: number;

  animateOption?: IAnimateOption;
}

export enum CanvasUpdateType {
  'ALWAYS' = 'always',
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
  rampColorsData?: ImageData | IImagedata;
}
