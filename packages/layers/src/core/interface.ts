import type {
  IAnimateOption,
  IMapService,
  ITexture2D,
  StyleAttributeField,
  StyleAttributeOption,
} from '@antv/l7-core';
import type { IColorRamp } from '@antv/l7-utils';
import type { CanvasModelType } from '../canvas/models';
import type { anchorType } from '../utils/symbol-layout';
export enum lineStyleType {
  'solid' = 0.0,
  'dash' = 1.0,
}

export enum LinearDir {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}

export enum TextureBlend {
  NORMAL = 'normal',
  REPLACE = 'replace',
}
/**
 * 基础图层类型定义
 */
export interface IBaseLayerStyleOptions {
  opacity?: number;

  depth?: boolean; // 是否开启深度检测
  blend?: string; // 混合方式

  raisingHeight?: number; // 抬升高度
  heightfixed?: boolean; // 高度是否固定

  zIndex?: number;

  // 蒙层
  mask?: boolean; // 可选参数 时候允许蒙层
  maskInside?: boolean; // 可选参数 控制图层是否显示在蒙层的内部

  color?: string;
  size?: number;
}

export interface ILineLayerStyleOptions extends IBaseLayerStyleOptions {
  tileOrigin?: number[];
  coord?: string;

  lineType?: keyof typeof lineStyleType; // 可选参数、线类型(all - dash/solid)
  dashArray?: [number, number]; //  可选参数、虚线间隔
  segmentNumber?: number;

  forward?: boolean; // 可选参数、是否反向(arcLine)
  lineTexture?: boolean; // 可选参数、是否开启纹理贴图功能(all)
  iconStep?: number; // 可选参数、纹理贴图步长(all)
  iconStepCount?: number; // 可选参数、纹理贴图间隔
  textureBlend?: TextureBlend; // 可选参数、供给纹理贴图使用(all)

  linearDir?: LinearDir;
  sourceColor?: string; // 可选参数、设置渐变色的起始颜色(all)
  targetColor?: string; // 可选参数、设置渐变色的终点颜色(all)

  thetaOffset?: number; // 可选参数、设置弧线的偏移量

  globalArcHeight?: number; // 可选参数、地球模式下 3D 弧线的高度
  vertexHeightScale?: number; // 可选参数、lineLayer vertex height scale

  borderWidth?: number; // 可选参数 线边框宽度
  borderColor?: string; // 可选参数 线边框颜色

  strokeWidth?: number; // 可选参数 线边框宽度
  storke?: string; // 可选参数 线边框颜色

  blur?: [number, number, number]; // 配置线图层的 blur 分布

  symbol?: ILineSymbol;

  rampColors?: IColorRamp;
  featureId?: string;
  sourceLayer?: string;
  enablePicking?: boolean;
  workerEnabled?: boolean;
}
export enum SizeUnitType {
  pixel = 0,
  meter = 1,
}
export interface IPointLayerStyleOptions extends IBaseLayerStyleOptions {
  tileOrigin?: number[];
  coord?: string;

  strokeOpacity: number;
  strokeWidth: number;
  stroke: string;

  blur?: number;
  billboard?: boolean; // 图片符号地图支持

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
  // cylinder
  pickLight?: boolean;

  sourceColor?: string; // 可选参数、设置渐变色的起始颜色(all)
  targetColor?: string; // 可选参数、设置渐变色的终点颜色(all)
  opacityLinear?: {
    enable: boolean;
    dir: string;
  };
  lightEnable: boolean;

  offsets?: [number, number];

  unit?: SizeUnitType;

  rotation?: number; // angle
  speed?: number;
  featureId?: string;
  sourceLayer?: string;
}

export interface IPolygonLayerStyleOptions extends IBaseLayerStyleOptions {
  tileOrigin?: number[];
  coord?: string;
  opacityLinear?: {
    enable: boolean;
    dir: string;
  };

  topsurface?: boolean;
  sidesurface?: boolean;

  mapTexture?: string; // 挤出几何体顶面贴图

  sourceColor?: string; // 可选参数、设置渐变色的起始颜色(all)
  targetColor?: string; // 可选参数、设置渐变色的终点颜色(all)

  pickLight: boolean;

  // water
  waterTexture?: string;
  speed?: number;
  // ocean
  watercolor?: string;
  watercolor2?: string;

  featureId?: string;
  sourceLayer?: string;
}

export interface IPolygonExtrusionStyleOptions {
  opacity: number;
  extrusionBase: number;
}

// 栅格瓦片图层
export interface IRasterTileLayerStyleOptions extends IBaseLayerStyleOptions {
  // define
  opacity: number;
}
export interface IMaskLayerStyleOptions extends IBaseLayerStyleOptions {
  // define
  opacity: number;
  color: string;
  sourceLayer?: string;
}

export interface IWindLayerStyleOptions extends IBaseLayerStyleOptions {
  uMin?: number;
  uMax?: number;
  vMin?: number;
  vMax?: number;
  fadeOpacity?: number;
  speedFactor?: number;
  dropRate?: number;
  dropRateBump?: number;
  numParticles?: number;
  rampColors?: {
    [key: number]: string;
  };
  sizeScale?: number;
}

export interface IImageLayerStyleOptions extends IBaseLayerStyleOptions {
  domain?: [number, number];
  noDataValue?: number;
  clampLow?: boolean;
  clampHigh?: boolean;
  rampColors?: IColorRamp;
  colorTexture?: ITexture2D;
  brightness?: number;
  contrast?: number;
  saturation?: number;
  gamma?: number;
}

export interface ICityBuildLayerStyleOptions {
  opacity: number;
  baseColor: string;
  brightColor: string;
  windowColor: string;
  time: number;
  sweep: {
    enable: boolean;
    sweepRadius: number;
    sweepColor: string;
    sweepSpeed: number;
    sweepCenter?: [number, number];
  };
}

export interface IGeometryLayerStyleOptions extends IBaseLayerStyleOptions {
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

export interface ICanvasLayerRenderParams {
  canvas: HTMLCanvasElement;
  ctx: RenderingContext;
  container: {
    width: number;
    height: number;
    bounds: [[number, number], [number, number]];
  };
  size: [number, number];
  utils: {
    lngLatToContainer: IMapService['lngLatToContainer'];
  };
  mapService: IMapService;
}

export interface ICanvasLayerOptions {
  zIndex?: number;
  contextType?: CanvasModelType;
  getContext?: (canvas: HTMLCanvasElement) => RenderingContext;
  trigger?: 'end' | 'change';
  /**
   * @deprecated
   * @alias trigger
   */
  update?: CanvasUpdateType | string;
  draw?: (renderParams: ICanvasLayerRenderParams) => void;
  /**
   * @deprecated
   * @alias draw
   */
  drawingOnCanvas?: (renderParams: ICanvasLayerRenderParams) => void;
}

export interface IHeatMapLayerStyleOptions extends IBaseLayerStyleOptions {
  intensity: number;
  radius: number;
  angle: number;
  rampColors: IColorRamp;

  coverage?: number;
}
export interface IBaseRasterLayerStyleOptions extends IBaseLayerStyleOptions {
  colorTexture?: ITexture2D;
  domain: [number, number];
  noDataValue: number;
  clampLow: boolean;
  clampHigh: boolean;
  rampColors: IColorRamp;
}
export interface IRasterLayerStyleOptions extends IBaseRasterLayerStyleOptions {
  channelRMax?: number;
  channelGMax?: number;
  channelBMax?: number;
}

export interface IRasterTerrainLayerStyleOptions extends IBaseRasterLayerStyleOptions {
  rScaler?: number;
  gScaler?: number;
  bScaler?: number;
  offset?: number;
}
export type ArrowType =
  | 'circle'
  | 'triangle'
  | 'rect'
  | 'diamond'
  | 'classic'
  | 'halfTriangle'
  | 'none';
export interface IArrowOptions {
  type: ArrowType;
  width?: number;
  height?: number;
  radius?: number;
}
export interface ILineSymbol {
  source: ArrowType | IArrowOptions;
  target: ArrowType | IArrowOptions;
}
export interface IFlowLineStyleOptions extends IBaseLayerStyleOptions {
  gapWidth?: number;
  offsets?: [number, number];
  stroke?: string;
  strokeOpacity?: number;
  strokeWidth?: number;
  symbol?: ILineSymbol;
}

export interface IStyleEncodeAttributeOptions {
  field: StyleAttributeField;
  values?: StyleAttributeOption;
}
