// @ts-ignore
import { SyncBailHook, SyncHook, SyncWaterfallHook } from '@antv/async-hook';
import { Container } from 'inversify';
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
  ScaleAttributeType,
  StyleAttrField,
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
export interface ILayerModelInitializationOptions {
  moduleName: string;
  vertexShader: string;
  fragmentShader: string;
  triangulation: Triangulation;
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
  init(): ILayer;
  scale(field: string | number | IScaleOptions, cfg?: IScale): ILayer;
  size(field: StyleAttrField, value?: StyleAttributeOption): ILayer;
  color(field: StyleAttrField, value?: StyleAttributeOption): ILayer;
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
  /**
   * JSON Schema 用于校验配置项
   */
  getConfigSchemaForValidation(): object;
  isDirty(): boolean;
  /**
   * 直接调用拾取方法，在非鼠标交互场景中使用
   */
  pick(query: { x: number; y: number }): void;

  updateLayerConfig(configToUpdate: Partial<ILayerConfig | unknown>): void;
  setAnimateStartTime(): void;
  getLayerAnimateTime(): number;
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
  renderLayers(): void;
  destroy(): void;
}
