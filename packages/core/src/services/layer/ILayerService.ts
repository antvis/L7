// @ts-ignore
import {
  AsyncSeriesBailHook,
  AsyncWaterfallHook,
  SyncBailHook,
  SyncHook,
} from '@antv/async-hook';
import { IColorRamp, SourceTile, TilesetManager } from '@antv/l7-utils';
import { Container } from 'inversify';
import Clock from '../../utils/clock';
import { ITextureService } from '../asset/ITextureService';
import { ISceneConfig } from '../config/IConfigService';
import { IInteractionTarget } from '../interaction/IInteractionService';
import {
  ILayerPickService,
  IPickingService,
} from '../interaction/IPickingService';
import { IMapService } from '../map/IMapService';
import { IAttribute } from '../renderer/IAttribute';
import {
  IBlendOptions,
  IModel,
  IModelInitializationOptions,
  IStencilOptions,
} from '../renderer/IModel';
import {
  IMultiPassRenderer,
  IPass,
  IPostProcessingPass,
} from '../renderer/IMultiPassRenderer';
import { IRendererService } from '../renderer/IRendererService';
import { ITexture2D } from '../renderer/ITexture2D';
import { IUniform } from '../renderer/IUniform';
import {
  IParseDataItem,
  ISource,
  ISourceCFG,
  ITransform,
} from '../source/ISourceService';
import {
  IAnimateOption,
  IEncodeFeature,
  IScale,
  IScaleOptions,
  IScaleValue,
  IStyleAttribute,
  IStyleAttributeService,
  IStyleAttributeUpdateOptions,
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
  renderUpdate?(): void;
  getBlend(): Partial<IBlendOptions>;
  getStencil(option?: Partial<IRenderOptions>): Partial<IStencilOptions>;
  getUninforms(): IModelUniform;
  getDefaultStyle(): unknown;
  getAnimateUniforms(): IModelUniform;
  buildModels(): Promise<IModel[]>;
  initModels(): Promise<IModel[]>;
  needUpdate(): Promise<boolean>;
  clearModels(refresh?: boolean): void;
  render(renderOptions?: Partial<IRenderOptions>): void;

  // canvasLayer
  clearCanvas?(): void;

  // earth mode
  setEarthTime?(time: number): void;
  createModelData?(options?: any): any;
}

export interface ILayerAttributesOption {
  shape: IAttrbuteOptions;
  color: IAttrbuteOptions;
  texture: IAttrbuteOptions;
  rotate: IAttrbuteOptions;
  size: IAttrbuteOptions;
  filter: IAttrbuteOptions;
  label: IAttrbuteOptions;
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

export interface ILegend {
  type: ScaleTypeName | undefined;
  field: StyleAttributeField | undefined;
  items: LegendItems;
}

// 分段图例
export interface ILegendSegmentItem {
  field: string; // 图例字段
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
  field: StyleAttrField;
  values: StyleAttributeOption;
}

export interface IRenderOptions {
  ispick: boolean;
  isStencil: boolean;
  stencilType: StencilType;
  stencilIndex: number;
  stencilOperation: MaskOperationType;
}
export enum StencilType {
  MULTIPLE = 'MULTIPLE',
  SINGLE = 'SINGLE',
}

export enum MaskOperation {
  AND = 'and',
  OR = 'or',
}

export type MaskOperationType = 'and' | 'or';

/**
 * For tile subLayer
 */
export interface ISubLayerInitOptions {
  usage?: string | undefined;
  layerType: string;
  transforms?: ITransform[];
  visible: boolean;
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

  addTile(tile: SourceTile): Promise<{ layers: ILayer[] }>;

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
  lnglatInBounds(lnglat: { lng: number; lat: number }): boolean;
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
  pickRender(target: IInteractionTarget): void;
  selectFeature(pickedColors: Uint8Array | undefined): void;
  highlightPickedFeature(pickedColors: Uint8Array | undefined): void;
  render(isPicking?: boolean): void;
  destroy(): void;
}
export interface ITileLayer extends IBaseTileLayer {
  pickRender(target: IInteractionTarget): void;
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

export enum ILayerStage {
  INIT = 'init',
  UPDATE = 'update',
}
export interface ILayer {
  styleAttributeService: IStyleAttributeService;
  layerPickService: ILayerPickService;
  textureService: ITextureService;
  sourceLayer?: string;
  parent: ILayer;
  id: string; // 一个场景中同一类型 Layer 可能存在多个
  type: string; // 代表 Layer 的类型
  coordCenter: number[];
  name: string; //
  inited: boolean; // 是否初始化完成
  startInit: boolean; // 是否开始初始化;
  zIndex: number;
  clusterZoom: number;
  plugins: ILayerPlugin[];
  layerModelNeedUpdate: boolean;
  styleNeedUpdate: boolean;
  layerModel: ILayerModel;
  tileLayer: IBaseTileLayer;
  layerChildren: ILayer[]; // 在图层中添加子图层
  masks: ILayer[]; // 图层的 mask 列表
  tileMask?: ILayer | undefined; // 图层的 tileMask;
  sceneContainer: Container | undefined;
  dataState: IDataState; // 数据流状态
  defaultSourceConfig: {
    data: any[];
    options: ISourceCFG | undefined;
  };
  encodeDataLength: number;
  pickedFeatureID: number | null;
  hooks: {
    init: AsyncSeriesBailHook;
    afterInit: SyncBailHook;
    beforeRenderData: AsyncWaterfallHook;
    beforeRender: SyncBailHook;
    afterRender: SyncHook;
    beforePickingEncode: SyncHook;
    afterPickingEncode: SyncHook;
    beforeHighlight: SyncHook;
    beforeSelect: SyncHook;
    afterSelect: SyncHook;
    afterHighlight: SyncHook;
    beforeDestroy: SyncHook;
    afterDestroy: SyncHook;
  };
  models: IModel[];
  sourceOption: {
    data: any;
    options?: ISourceCFG;
  };
  multiPassRenderer: IMultiPassRenderer;
  // 初始化 layer 的时候指定 layer type 类型（）兼容空数据的情况
  layerType?: string | undefined;
  isTileLayer?: boolean;
  triangulation?: Triangulation | undefined;
  processData(data: IParseDataItem[]): IParseDataItem[];
  /**
   * threejs 适配兼容相关的方法
   * @param lnglat
   * @param altitude
   * @param rotation
   * @param scale
   */

  threeRenderService?: any;
  postProcessingPassFactory: (name: string) => IPostProcessingPass<unknown>;
  normalPassFactory: (name: string) => IPass<unknown>;
  getShaderPickStat: () => boolean;
  updateModelData(data: IAttributeAndElements): void;

  addMaskLayer(maskLayer: ILayer): void;
  removeMaskLayer(maskLayer: ILayer): void;
  needPick(type: string): boolean;
  getAttribute(name: string): IStyleAttribute | undefined;
  getLayerConfig<T>(): Partial<ILayerConfig & ISceneConfig & T>;
  getLayerAttributeConfig(): Partial<ILayerAttributesOption>;
  getContainer(): Container;
  setContainer(container: Container, sceneContainer: Container): void;
  setCurrentPickId(id: number | null): void;
  getCurrentPickId(): number | null;
  setCurrentSelectedId(id: number | null): void;
  getCurrentSelectedId(): number | null;
  prepareBuildModel(): void;
  renderModels(options?: Partial<IRenderOptions>): void;
  buildModels(): void;
  rebuildModels(): void;
  getModelType(): string;
  buildLayerModel(
    options: ILayerModelInitializationOptions &
      Partial<IModelInitializationOptions>,
  ): Promise<IModel>;
  createAttributes(
    options: ILayerModelInitializationOptions &
      Partial<IModelInitializationOptions>,
  ): {
    [attributeName: string]: IAttribute;
  };
  updateStyleAttribute(
    type: string,
    field: StyleAttributeField,
    values?: StyleAttributeOption,
    updateOptions?: Partial<IStyleAttributeUpdateOptions>,
  ): boolean;
  setLayerPickService(layerPickService: ILayerPickService): void;
  init(): Promise<void>;
  scale(field: string | number | IScaleOptions, cfg?: IScale): ILayer;
  getScale(name: string): any;
  size(field: StyleAttrField, value?: StyleAttributeOption): ILayer;
  color(field: StyleAttrField, value?: StyleAttributeOption): ILayer;
  rotate(field: StyleAttrField, value?: StyleAttributeOption): ILayer;
  texture(field: StyleAttrField, value?: StyleAttributeOption): ILayer;
  shape(field: StyleAttrField, value?: StyleAttributeOption): ILayer;
  label(field: StyleAttrField, value?: StyleAttributeOption): ILayer;
  animate(option: Partial<IAnimateOption> | boolean): ILayer;
  // pattern(field: string, value: StyleAttributeOption): ILayer;
  filter(field: string, value: StyleAttributeOption): ILayer;
  active(option: IActiveOption | boolean): ILayer;
  setActive(
    id: number | { x: number; y: number },
    option?: IActiveOption,
  ): void;
  select(option: IActiveOption | boolean): ILayer;
  setSelect(
    id: number | { x: number; y: number },
    option?: IActiveOption,
  ): void;
  setAutoFit(autoFit: boolean): void;
  style(options: unknown): ILayer;
  hide(): ILayer;
  show(): ILayer;
  getLegendItems(name: string, index?: number): LegendItems;
  getLegend(name: string): ILegend;
  setIndex(index: number): ILayer;
  isVisible(): boolean;
  setMaxZoom(min: number): ILayer;
  setMinZoom(max: number): ILayer;
  getMinZoom(): number;
  getMaxZoom(): number;
  get(name: string): number;
  log(type: string, step: string): void;
  setBlend(type: keyof typeof BlendType): ILayer;

  // mask
  addMask(mask: ILayer): void;
  removeMask(layer: ILayer): void;
  disableMask(): void;
  enableMask(): void;

  // animate(field: string, option: any): ILayer;

  setMultiPass(
    multipass: boolean,
    passes?: Array<string | [string, { [key: string]: unknown }]>,
  ): ILayer;
  renderLayers(): void;
  render(options?: Partial<IRenderOptions>): ILayer;

  renderMultiPass(): any;

  clear(): void;
  clearModels(): void;
  destroy(refresh?: boolean): void;
  source(data: any, option?: ISourceCFG): ILayer;
  setData(data: any, option?: ISourceCFG): ILayer;
  fitBounds(fitBoundsOptions?: unknown): ILayer;
  /**
   * 向当前图层注册插件
   * @param plugin 插件实例
   */
  addPlugin(plugin: ILayerPlugin): ILayer;
  getSource(): ISource;
  setSource(source: ISource): void;
  setEncodedData(encodedData: IEncodeFeature[]): void;
  getEncodedData(): IEncodeFeature[];
  getScaleOptions(): IScaleOptions;

  /**
   * 事件
   */
  on(type: LayerEventType, handler: (...args: any[]) => void): void;
  off(type: LayerEventType, handler: (...args: any[]) => void): void;
  emit(type: LayerEventType, handler: unknown): void;
  once(type: LayerEventType, handler: (...args: any[]) => void): void;

  isDirty(): boolean;
  /**
   * 直接调用拾取方法，在非鼠标交互场景中使用
   */
  pick(query: { x: number; y: number }): void;
  boxSelect(
    box: [number, number, number, number],
    cb: (...args: any[]) => void,
  ): void;

  updateLayerConfig(configToUpdate: Partial<ILayerConfig | unknown>): void;
  setAnimateStartTime(): void;
  getLayerAnimateTime(): number;

  // 获取对应地图的经纬度模型矩阵
  getModelMatrix?(
    lnglat: ILngLat,
    altitude: number,
    rotation: [number, number, number],
    scale: [number, number, number],
  ): any;

  // 获取对应地图的经纬度平移矩阵
  getTranslateMatrix?(lnglat: ILngLat, altitude?: number): any;

  // 设置模型对应地图在经纬度和高度方向的平移
  applyObjectLngLat?(object: any, lnglat: ILngLat, altitude?: number): void;

  // 根据经纬度设置模型对应地图的平移
  setObjectLngLat?(object: any, lnglat: ILngLat, altitude?: number): void;

  // 返回物体在场景中的经纬度
  getObjectLngLat?(object: any): ILngLat;

  // 将经纬度转为 three 世界坐标
  lnglatToCoord?(lnglat: ILngLat): ILngLat;

  // 设置网格适配到地图坐标系
  adjustMeshToMap?(object: any): void;

  // 设置网格的缩放 （主要是抹平 mapbox 底图时的差异，若是高德底图则可以直接设置网格的 scale 属性/方法）
  setMeshScale?(object: any, x: number, y: number, z: number): void;

  // 增加加载模型的动画混合器
  addAnimateMixer?(mixer: any): void;

  // 返回当前的 threejs camera
  getRenderCamera?(): any;

  /**
   * 地球模式相关的方法
   */

  // 设置当前地球时间 控制太阳角度
  setEarthTime(time: number): void;
}

/**
 * Layer 插件
 */
export interface ILayerPlugin {
  apply(
    layer: ILayer,
    services: {
      rendererService: IRendererService;
      mapService: IMapService;
      styleAttributeService: IStyleAttributeService;
      postProcessingPassFactory: (name: string) => IPostProcessingPass<unknown>;
      normalPassFactory: (name: string) => IPass<unknown>;
    },
  ): void;
}

/**
 * Layer 初始化参数
 */
export interface ILayerConfig {
  mask: boolean;
  maskInside: boolean;
  maskfence: any;
  maskColor: string;
  maskOpacity: number;
  maskLayers: ILayer[];
  maskOperation?: MaskOperationType;
  sourceLayer: string;

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
  enableMultiPassRenderer: boolean;
  passes: Array<string | [string, { [key: string]: unknown }]>;

  // layerType 指定 shape 的类型
  layerType?: string | undefined;
  cursorEnabled?: boolean;
  cursor?: string;
  forward: boolean; // 正方向
  usage?: string; // 指定图层的使用类型 - 用户地图底图绘制的优化
  enableMask: boolean;
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
  getShaderPickStat: () => boolean;

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
  remove(layer: ILayer, parentLayer?: ILayer): Promise<void>;
  removeAllLayers(): Promise<void>;
  updateLayerRenderList(): void;
  reRender(): void;
  beforeRenderData(layer: ILayer): Promise<void>;
  renderMask(masks: ILayer[]): void;
  renderTileLayer(layer: ILayer): Promise<void>;
  renderTileLayerMask(layer: ILayer): void;
  needPick(type: string): boolean;
  throttleRenderLayers(): void;
  renderLayers(): void;
  setEnableRender(flag: boolean): void;
  getOESTextureFloat(): boolean;
  addMask(mask: ILayer): void;

  destroy(): void;
}
