import { SyncBailHook, SyncHook } from 'tapable';
import { IGlobalConfigService } from '../config/IConfigService';
import { IModel } from '../renderer/IModel';
import { IMultiPassRenderer } from '../renderer/IMultiPassRenderer';
import { ISource, ISourceCFG } from '../source/ISourceService';
import {
  IEncodeFeature,
  IScale,
  IScaleOptions,
  IStyleAttributeService,
  StyleAttrField,
  StyleAttributeOption,
} from './IStyleAttributeService';

export interface ILayerGlobalConfig {
  colors: string[];
  size: number;
  shape: string;
  shape2d: string[];
  shape3d: string[];
  scales: {
    [key: string]: IScale;
  };
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
  visible: boolean;
  zIndex: number;
  minZoom: number;
  maxZoom: number;
  configService: IGlobalConfigService;
  plugins: ILayerPlugin[];
  hooks: {
    init: SyncBailHook<void, boolean | void>;
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
  styleAttributeService: IStyleAttributeService;
  init(): ILayer;
  size(field: StyleAttrField, value?: StyleAttributeOption): ILayer;
  color(field: StyleAttrField, value?: StyleAttributeOption): ILayer;
  shape(field: StyleAttrField, value?: StyleAttributeOption): ILayer;
  label(field: StyleAttrField, value?: StyleAttributeOption): ILayer;
  // pattern(field: string, value: StyleAttributeOption): ILayer;
  // filter(field: string, value: StyleAttributeOption): ILayer;
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
  addPlugin(plugin: ILayerPlugin): ILayer;
  getSource(): ISource;
  setSource(source: ISource): void;
  setEncodedData(encodedData: IEncodeFeature[]): void;
  getEncodedData(): IEncodeFeature[];
  getStyleOptions(): Partial<ILayerInitializationOptions>;
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
  apply(layer: ILayer): void;
}

/**
 * Layer 初始化参数
 */
export interface ILayerInitializationOptions {
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
  onHover(pickedFeature: IPickedFeature): void;
  onClick(pickedFeature: IPickedFeature): void;
}

/**
 * 提供 Layer 管理服务
 */
export interface ILayerService {
  add(layer: ILayer): void;
  initLayers(): void;
  getLayers(): ILayer[];
  getLayer(name: string): ILayer | undefined;
  remove(layer: ILayer): void;
  updateRenderOrder(): void;
  renderLayers(): void;
  destroy(): void;
}
