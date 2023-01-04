
import { IColorRamp, SourceTile, TilesetManager } from '@antv/l7-utils';
import { Container } from 'inversify';
import Clock from '../../utils/clock';
import { ISceneConfig } from '../config/IConfigService';
import { IInteractionTarget } from '../interaction/IInteractionService';
import { IPickingService } from '../interaction/IPickingService';
import { IMapService } from '../map/IMapService';

import {
  IBlendOptions,
  IModel,
  
} from '../renderer/IModel';
import { IRendererService } from '../renderer/IRendererService';
import { ITexture2D } from '../renderer/ITexture2D';
import { IUniform } from '../renderer/IUniform';
import { ISourceCFG, ITransform, IParseDataItem } from '../source/ISourceService';
import {
  IAnimateOption,

  IScale,
  IScaleValue,
  ScaleTypeName,
  StyleAttrField,
  StyleAttributeField,
  StyleAttributeOption,
  Triangulation,
} from './IStyleAttributeService';

export enum BlendType {
  normal = 'normal',
  additive = 'additive',
  subtractive = 'subtractive',
  min = 'min',
  max = 'max',
  none = 'none',
}
export interface IBlendTypes {
  [key: string]: Partial<IBlendOptions>;
}
export interface IDataState {
  dataSourceNeedUpdate: boolean;
  dataMappingNeedUpdate: boolean;
  filterNeedUpdate: boolean;
  featureScaleNeedUpdate: boolean;
  StyleAttrNeedUpdate: boolean;
}

export interface IWorkerOption {
  modelType: string;
  [key: string]: any;
}
export interface ILayerModelInitializationOptions {
  moduleName: string;
  vertexShader: string;
  fragmentShader: string;
  triangulation: Triangulation;
  segmentNumber?: number;
  workerEnabled?: boolean;
  workerOptions?: IWorkerOption;
}

export interface ILayerModel {
  render(): void;
  renderUpdate?(): void;
  getUninforms(): IModelUniform;
  getDefaultStyle(): unknown;
  getAnimateUniforms(): IModelUniform;
  buildModels(): Promise<IModel[]>;
  initModels(): Promise<IModel[]>;
  needUpdate(): boolean;
  clearModels(refresh?: boolean): void;

  // canvasLayer
  clearCanvas?(): void;

  createModelData?(options?: any): any;
}

export interface ILayerAttributesOption {
  shape: IAttrbuteOptions,
  color: IAttrbuteOptions,
  
  rotate:IAttrbuteOptions,
  size:IAttrbuteOptions,
  filter:IAttrbuteOptions,
}

export interface IModelUniform {
  [key: string]: IUniform;
}

export interface IPickedFeature {
  x: number;
  y: number;
  lnglat?: { lng: number; lat: number };
  feature?: unknown;
}
// 交互样式
export interface IActiveOption {
  color: string | number[];
  mix?: number;
}

type ILngLat = [number, number];

export interface ILegend  {
  type: ScaleTypeName | undefined
  field: StyleAttributeField | undefined;
  items:LegendItems
}

// 分段图例
export interface ILegendSegmentItem {
  field:string;// 图例字段
  value: [number, number];
  [key: string]: any;
}
// 分类图例
export interface ILegendClassificaItem {
  value: number | string;
  [key: string]: any;
}
// 图层图例
export type LegendItems = ILegendSegmentItem[] | ILegendClassificaItem[];

export interface IAttributeAndElements {
  attributes: any;
  elements: any;
}

export interface ISubLayerStyles {
  opacity: number;
}

export interface IAttrbuteOptions {
  field: StyleAttrField,
  values:StyleAttributeOption
}

/**
 * For tile subLayer
 */
export interface ISubLayerInitOptions {
  usage?: string|undefined;
  layerType: string;
  transforms?: ITransform[];
  visible: boolean,
  shape?: string | string[] | IScaleValue;
  // options
  zIndex: number;
  mask: boolean;
  // source
  // style
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity?: number;

  opacity: number;
  color?: IScaleValue;
  basemapColor?: string;
  size?: IScaleValue;
  basemapSize?: number;

  // raster tiff
  domain?: [number, number];
  clampLow?: boolean;
  clampHigh?: boolean;
  rampColors?: IColorRamp;
  colorTexture?: ITexture2D;
  // 在初始化的时候使用

  pixelConstant?: number;
  pixelConstantR?: number;
  pixelConstantG?: number;
  pixelConstantB?: number;
  pixelConstantRGB?: number;

  coords?: string;
  sourceLayer?: string;
  featureId?: string;

  workerEnabled?: boolean;
}

export interface IBaseTileLayerManager {
  sourceLayer: string;
  parent: ILayer;
  children: ILayer[];

  addTile(tile: SourceTile):Promise<{ layers: ILayer[]; }>;

  addChild(layer: ILayer): void;
  addChildren(layers: ILayer[]): void;
  removeChild(layer: ILayer): void;
  clearChild(): void;
  hasChild(layer: ILayer): boolean;
  render(isPicking?: boolean): void;
  destroy(): void;
}

export interface ITilePickService {
  pick(layer: ILayer, target: IInteractionTarget): boolean;
  pickRender(target: IInteractionTarget): void;
}

export interface ITile {
  x: number;
  y: number;
  z: number;
  key: string;
  sourceTile: SourceTile;
  visible: boolean;
  isLoaded: boolean;
  getMainLayer(): ILayer | undefined;
  getLayers(): ILayer[];
  getFeatureById(id: number): any;
  styleUpdate(...args: any): void;
  initTileLayer(): Promise<void>;
  lnglatInBounds(lnglat: {
    lng: number;
    lat: number;
  }): boolean;
  updateVisible(value: boolean): void;
  updateOptions(key: string, value: any): void;
  destroy(): void;
}

export interface ITileLayerService {
  tileResource: Map<string, any>;
  hasTile(tileKey: string): boolean;
  getLayers(): ILayer[];
  getTiles(): ITile[];
}

export interface IBaseTileLayer {
  tilesetManager: TilesetManager | undefined;
  tileLayerService: ITileLayerService;
  getLayers(): ILayer[];
  getTiles(): ITile[];
  pickRender(target: IInteractionTarget):void;
  selectFeature(pickedColors: Uint8Array | undefined):void;
  highlightPickedFeature(pickedColors: Uint8Array | undefined):void;
  render(isPicking?: boolean): void;
  destroy(): void;
}
export interface ITileLayer extends IBaseTileLayer{
  pickRender(target: IInteractionTarget):void;
  pickLayers(target: IInteractionTarget): boolean;
  clearPick(type: string): void;
  clearPickState(): void;
  destroy(): void;
}

export interface ITileLayerOPtions {
  parent: ILayer;
  rendererService: IRendererService;
  mapService: IMapService;
  layerService: ILayerService;
  pickingService: IPickingService;
  transforms: ITransform[];
}

export type LayerEventType =
  | 'inited'
  | 'legend'
  | 'legend:color'
  | 'legend:size'
  | 'add'
  | 'remove'
  | 'destroy'
  | 'contextmenu'
  | 'uncontextmenu'
  | 'unpick'
  | 'mousedown'
  | 'unmousedown'
  | 'unclick'
  | 'undblclick'
  | 'unmouseenter'
  | 'unmousemove'
  | 'mouseout'
  | 'click'
  | 'dblclick'
  | 'mouseenter'
  | 'unmousemove'
  | 'mouseout'
  | 'show'
  | 'hide'
  | any;

export interface ILayer {
  sourceLayer?: string;
  parent: ILayer;
  id: string; // 一个场景中同一类型 Layer 可能存在多个
  type: string; // 代表 Layer 的类型
  coordCenter: number[];
  name: string; //
  inited: boolean; // 是否初始化完成
  startInit: boolean // 是否开始初始化;
  zIndex: number;
  clusterZoom: number;
  
  layerModelNeedUpdate: boolean;
  styleNeedUpdate: boolean;
  layerModel: ILayerModel;
  
  
  sceneContainer: Container | undefined;
  dataState: IDataState; // 数据流状态

  
  pickedFeatureID: number | null;

  models: IModel[];
  // 初始化 layer 的时候指定 layer type 类型（）兼容空数据的情况
  layerType?: string | undefined;
  
  triangulation?: Triangulation | undefined;


  getLayerConfig<T>(): Partial<ILayerConfig & ISceneConfig & T>;
  
  getContainer(): Container;
  setContainer(container: Container, sceneContainer: Container): void;
  

  buildModels(): void;

  
  init(): Promise<void>;


  render(): ILayer;

  clear(): void;
  clearModels(): void;
  destroy(refresh?: boolean): void;

  /**
   * 事件
   */
  on(type: LayerEventType, handler: (...args: any[]) => void): void;
  off(type: LayerEventType, handler: (...args: any[]) => void): void;
  emit(type: LayerEventType, handler: unknown): void;
  once(type: LayerEventType, handler: (...args: any[]) => void): void;
}

/**
 * Layer 初始化参数
 */
export interface ILayerConfig {
  sourceLayer:string;

  colors: string[];
  size: number;
  shape: string;
  shape2d: string[];
  shape3d: string[];
  scales: {
    [key: string]: IScale;
  };
  minZoom: number;
  maxZoom: number;
  visible: boolean;
  zIndex: number;
  pickingBuffer: number;
  enablePropagation: boolean;
  autoFit: boolean;
  fitBoundsOptions?: unknown;
  name: string; //
  blend: keyof typeof BlendType;
  depth: boolean;
  pickedFeatureID: number;
  
  passes: Array<string | [string, { [key: string]: unknown }]>;

  // layerType 指定 shape 的类型
  layerType?: string | undefined;
  cursorEnabled?: boolean;
  cursor?: string;
  forward: boolean; // 正方向
  usage?: string; // 指定图层的使用类型 - 用户地图底图绘制的优化

  /**
   * 开启拾取
   */
  enablePicking: boolean;
  /**
   * 开启高亮
   */
  enableHighlight: boolean;

  enableSelect: boolean;
  /**
   * 高亮颜色
   */
  highlightColor: string | number[];
  selectColor: string | number[];
  active: boolean;
  activeColor: string | number[];
  activeMix?: number;
  selectMix?: number;
  /**
   * 开启 TAA
   */
  enableTAA: boolean;
  /**
   * 相机抖动程度
   */
  jitterScale: number;
  /**
   * 开启光照
   */
  enableLighting: boolean;

  /**
   * 动画参数
   */
  animateOption: Partial<IAnimateOption>;

  /**
   * 地球模式参数
   */
   globalOptions: any;
  /**
   * layer point text 是否是 iconfont 模式
   */
  iconfont: boolean;

  workerEnabled?: boolean;
  onHover(pickedFeature: IPickedFeature): void;
  onClick(pickedFeature: IPickedFeature): void;
}

export type LayerServiceEvent = 'layerChange';

/**
 * 提供 Layer 管理服务
 */

export interface ILayerService {
  pickedLayerId: number;
  clock: Clock;
  alreadyInRendering: boolean;
  sceneService?: any;
  // 控制着色器颜色拾取计算
  enableShaderPick: () => void;
  disableShaderPick: () => void;
  

  on(type: string, handler: (...args: any[]) => void): void;
  off(type: string, handler: (...args: any[]) => void): void;
  once(type: string, handler: (...args: any[]) => void): void;
  // 清除画布
  clear(): void;
  add(layer: ILayer): void;
  initLayers(): Promise<void>;
  startAnimate(): void;
  stopAnimate(): void;
  getSceneInited(): boolean;
  getLayers(): ILayer[];
  getRenderList(): ILayer[];
  getLayer(id: string): ILayer | undefined;
  getLayerByName(name: string): ILayer | undefined;
  remove(layer: ILayer, parentLayer?: ILayer): void;
  removeAllLayers(): void;
  updateLayerRenderList(): void;
  reRender(): void;
  beforeRenderData(layer: ILayer): Promise<void>;
  renderMask(masks:ILayer[]): void;
  renderLayer(layer: ILayer): Promise<void>
  needPick(type:string):boolean;
  renderLayers(): void;
  setEnableRender(flag: boolean): void;
  getOESTextureFloat(): boolean;

  destroy(): void;
}
