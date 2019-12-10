import { Container } from 'inversify';
import { SyncBailHook, SyncHook, SyncWaterfallHook } from 'tapable';
import Clock from '../../utils/clock';
import { ISceneConfig } from '../config/IConfigService';
import { IMapService } from '../map/IMapService';
import { IModel, IModelInitializationOptions } from '../renderer/IModel';
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
  StyleAttrField,
  StyleAttributeOption,
  Triangulation,
} from './IStyleAttributeService';

export interface ILayerModelInitializationOptions {
  moduleName: string;
  vertexShader: string;
  fragmentShader: string;
  triangulation: Triangulation;
}
export interface ILayerModel {
  render(): void;
  getUninforms(): IModelUniform;
  buildModels(): IModel[];
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

export interface ILayer {
  id: string; // 一个场景中同一类型 Layer 可能存在多个
  name: string; // 代表 Layer 的类型
  inited: boolean; // 是否初始化完成
  zIndex: number;
  plugins: ILayerPlugin[];
  layerModelNeedUpdate: boolean;
  dataPluginsState: { [key: string]: boolean };
  hooks: {
    init: SyncBailHook<void, boolean | void>;
    beforeRenderData: SyncWaterfallHook<boolean | void>;
    beforeRender: SyncBailHook<void, boolean | void>;
    afterRender: SyncHook<void>;
    beforePickingEncode: SyncHook<void>;
    afterPickingEncode: SyncHook<void>;
    beforeHighlight: SyncHook<[number[]]>;
    afterHighlight: SyncHook<void>;
    beforeDestroy: SyncHook<void>;
    afterDestroy: SyncHook<void>;
  };
  models: IModel[];
  sourceOption: {
    data: any;
    options?: ISourceCFG;
  };
  multiPassRenderer: IMultiPassRenderer;
  getLayerConfig(): Partial<ILayerConfig & ISceneConfig>;
  getContainer(): Container;
  setContainer(container: Container): void;
  buildLayerModel(
    options: ILayerModelInitializationOptions &
      Partial<IModelInitializationOptions>,
  ): IModel;
  init(): ILayer;
  scale(field: string | IScaleOptions, cfg: IScale): ILayer;
  size(field: StyleAttrField, value?: StyleAttributeOption): ILayer;
  color(field: StyleAttrField, value?: StyleAttributeOption): ILayer;
  shape(field: StyleAttrField, value?: StyleAttributeOption): ILayer;
  label(field: StyleAttrField, value?: StyleAttributeOption): ILayer;
  animate(option: IAnimateOption): ILayer;
  // pattern(field: string, value: StyleAttributeOption): ILayer;
  filter(field: string, value: StyleAttributeOption): ILayer;
  // active(option: ActiveOption): ILayer;
  style(options: unknown): ILayer;
  hide(): ILayer;
  show(): ILayer;
  setIndex(index: number): ILayer;
  isVisible(): boolean;
  setMaxZoom(min: number): ILayer;
  setMinZoom(max: number): ILayer;
  // animate(field: string, option: any): ILayer;
  render(): ILayer;
  destroy(): void;
  source(data: any, option?: ISourceCFG): ILayer;
  setData(data: any, option?: ISourceCFG): ILayer;
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
  on(type: string, hander: (...args: any[]) => void): void;
  off(type: string, hander: (...args: any[]) => void): void;
  once(type: string, hander: (...args: any[]) => void): void;
  /**
   * JSON Schema 用于校验配置项
   */
  getConfigSchemaForValidation(): object;
  isDirty(): boolean;
  /**
   * 直接调用拾取方法，在非鼠标交互场景中使用
   */
  pick(query: { x: number; y: number }): void;
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
  /**
   * 高亮颜色
   */
  highlightColor: string | number[];
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
  onHover(pickedFeature: IPickedFeature): void;
  onClick(pickedFeature: IPickedFeature): void;
}

/**
 * 提供 Layer 管理服务
 */
export interface ILayerService {
  clock: Clock;
  add(layer: ILayer): void;
  initLayers(): void;
  startAnimate(): void;
  stopAnimate(): void;
  getLayers(): ILayer[];
  getLayer(name: string): ILayer | undefined;
  remove(layer: ILayer): void;
  updateRenderOrder(): void;
  renderLayers(): void;
  destroy(): void;
}
