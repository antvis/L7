// @ts-ignore
import { SyncBailHook, SyncHook, SyncWaterfallHook } from '@antv/async-hook';
import { Container } from 'inversify';
import { AnimationMixer, Matrix4, Object3D } from 'three';
import Clock from '../../utils/clock';
import { ISceneConfig } from '../config/IConfigService';
import { IMapService } from '../map/IMapService';
import {
  IBlendOptions,
  IModel,
  IModelInitializationOptions,
} from '../renderer/IModel';
import {
  IMultiPassRenderer,
  IPass,
  IPostProcessingPass,
} from '../renderer/IMultiPassRenderer';
import { IRendererService } from '../renderer/IRendererService';
import { IUniform } from '../renderer/IUniform';
import { ISource, ISourceCFG } from '../source/ISourceService';
import {
  IAnimateOption,
  IEncodeFeature,
  IScale,
  IScaleOptions,
  IStyleAttributeService,
  IStyleAttributeUpdateOptions,
  ScaleAttributeType,
  StyleAttrField,
  StyleAttributeField,
  StyleAttributeOption,
  Triangulation,
} from './IStyleAttributeService';

// import {
//   IStyleAttributeUpdateOptions,
//   StyleAttributeField,
// } from '@antv/l7-core';y
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
export interface ILayerModelInitializationOptions {
  moduleName: string;
  vertexShader: string;
  fragmentShader: string;
  triangulation: Triangulation;
  segmentNumber?: number;
}

export interface ILayerModel {
  render(): void;
  getUninforms(): IModelUniform;
  getDefaultStyle(): unknown;
  getAnimateUniforms(): IModelUniform;
  buildModels(): IModel[];
  initModels(): IModel[];
  needUpdate(): boolean;
  clearModels(): void;
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
}

type ILngLat = [number, number];

export interface ILayer {
  id: string; // 一个场景中同一类型 Layer 可能存在多个
  type: string; // 代表 Layer 的类型
  name: string; //
  inited: boolean; // 是否初始化完成
  zIndex: number;
  plugins: ILayerPlugin[];
  layerModelNeedUpdate: boolean;
  styleNeedUpdate: boolean;
  layerModel: ILayerModel;
  dataState: IDataState; // 数据流状态
  pickedFeatureID: number | null;
  hooks: {
    init: SyncBailHook;
    afterInit: SyncBailHook;
    beforeRenderData: SyncWaterfallHook;
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
  needPick(type: string): boolean;
  getLayerConfig(): Partial<ILayerConfig & ISceneConfig>;
  getContainer(): Container;
  setContainer(container: Container): void;
  setCurrentPickId(id: number | null): void;
  getCurrentPickId(): number | null;
  setCurrentSelectedId(id: number | null): void;
  getCurrentSelectedId(): number | null;
  prepareBuildModel(): void;
  renderModels(): void;
  buildModels(): void;
  rebuildModels(): void;
  buildLayerModel(
    options: ILayerModelInitializationOptions &
      Partial<IModelInitializationOptions>,
  ): IModel;
  updateStyleAttribute(
    type: string,
    field: StyleAttributeField,
    values?: StyleAttributeOption,
    updateOptions?: Partial<IStyleAttributeUpdateOptions>,
  ): void;
  init(): ILayer;
  scale(field: string | number | IScaleOptions, cfg?: IScale): ILayer;
  size(field: StyleAttrField, value?: StyleAttributeOption): ILayer;
  color(field: StyleAttrField, value?: StyleAttributeOption): ILayer;
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
  style(options: unknown): ILayer;
  hide(): ILayer;
  show(): ILayer;
  getLegendItems(name: string): any;
  setIndex(index: number): ILayer;
  isVisible(): boolean;
  setMaxZoom(min: number): ILayer;
  setMinZoom(max: number): ILayer;
  getMinZoom(): number;
  getMaxZoom(): number;
  get(name: string): number;
  setBlend(type: keyof typeof BlendType): void;
  // animate(field: string, option: any): ILayer;
  renderLayers(): void;
  render(): ILayer;
  clear(): void;
  clearModels(): void;
  destroy(): void;
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
  on(type: string, handler: (...args: any[]) => void): void;
  off(type: string, handler: (...args: any[]) => void): void;
  emit(type: string, handler: unknown): void;
  once(type: string, handler: (...args: any[]) => void): void;

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

  /**
   * threejs 适配兼容相关的方法
   * @param lnglat
   * @param altitude
   * @param rotation
   * @param scale
   */

  // 获取对应地图的经纬度模型矩阵
  getModelMatrix?(
    lnglat: ILngLat,
    altitude: number,
    rotation: [number, number, number],
    scale: [number, number, number],
  ): Matrix4;

  // 获取对应地图的经纬度平移矩阵
  getTranslateMatrix?(lnglat: ILngLat, altitude?: number): Matrix4;

  // 设置模型对应地图在经纬度和高度方向的平移
  applyObjectLngLat?(
    object: Object3D,
    lnglat: ILngLat,
    altitude?: number,
  ): void;

  // 根据经纬度设置模型对应地图的平移
  setObjectLngLat?(object: Object3D, lnglat: ILngLat, altitude?: number): void;

  // 返回物体在场景中的经纬度
  getObjectLngLat?(object: Object3D): ILngLat;

  // 将经纬度转为 three 世界坐标
  lnglatToCoord?(lnglat: ILngLat): ILngLat;

  // 设置网格适配到地图坐标系
  adjustMeshToMap?(object: Object3D): void;

  // 设置网格的缩放 （主要是抹平 mapbox 底图时的差异，若是高德底图则可以直接设置网格的 scale 属性/方法）
  setMeshScale?(object: Object3D, x: number, y: number, z: number): void;

  // 增加加载模型的动画混合器
  addAnimateMixer?(mixer: AnimationMixer): void;
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
  pickedFeatureID: number;
  enableMultiPassRenderer: boolean;
  passes: Array<string | [string, { [key: string]: unknown }]>;

  forward: boolean; // 正方向

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
  animateOption: Partial<IAnimateOption>;
  /**
   * layer point text 是否是 iconfont 模式
   */
  iconfont: boolean;
  onHover(pickedFeature: IPickedFeature): void;
  onClick(pickedFeature: IPickedFeature): void;
}

/**
 * 提供 Layer 管理服务
 */
export interface ILayerService {
  clock: Clock;
  alreadyInRendering: boolean;
  add(layer: ILayer): void;
  initLayers(): void;
  startAnimate(): void;
  stopAnimate(): void;
  getLayers(): ILayer[];
  getLayer(id: string): ILayer | undefined;
  getLayerByName(name: string): ILayer | undefined;
  remove(layer: ILayer): void;
  removeAllLayers(): void;
  updateRenderOrder(): void;
  renderLayers(type?: string): void;
  getOESTextureFloat(): boolean;
  destroy(): void;
}
