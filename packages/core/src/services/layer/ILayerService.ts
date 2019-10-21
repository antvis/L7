import { AsyncParallelHook, SyncHook } from 'tapable';
import { IModel } from '../renderer/IModel';
import { IMultiPassRenderer } from '../renderer/IMultiPassRenderer';
import { ISource, ISourceCFG } from '../source/ISourceService';
import { ILayerStyleOptions } from './ILayerStyleService';
export enum ScaleTypes {
  LINEAR = 'linear',
  POWER = 'power',
  LOG = 'log',
  IDENTITY = 'identity',
  TIME = 'time',
  QUANTILE = 'quantile',
  QUANTIZE = 'quantize',
  THRESHOLD = 'threshold',
  CAT = 'cat',
}
export enum StyleScaleType {
  CONSTANT = 'constant',
  VARIABLE = 'variable',
}
export interface IScaleOption {
  field?: string;
  type: ScaleTypes;
  ticks?: any[];
  nice?: boolean;
  format?: () => any;
  domain?: any[];
}
export interface IStyleScale {
  scale: any;
  field: string;
  type: StyleScaleType;
  option: IScaleOption;
}

export interface ILayerGlobalConfig {
  colors: string[];
  size: number;
  shape: string;
  scales: {
    [key: string]: IScaleOption;
  };
}
type CallBack = (...args: any[]) => any;
export type StyleAttributeField = string | string[];
export type StyleAttributeOption = string | number | boolean | any[] | CallBack;
export type StyleAttrField = string | string[] | number | number[];
export interface ILayerStyleAttribute {
  type: string;
  names: string[];
  field: StyleAttributeField;
  values?: any[];
  scales?: IStyleScale[];
  setScales: (scales: IStyleScale[]) => void;
  callback?: (...args: any[]) => [];
  mapping?(...params: unknown[]): unknown[];
}

export interface ILayer {
  name: string;
  // visible: boolean;
  // zIndex: number;
  // type: string;
  // id: number;
  plugins: ILayerPlugin[];
  hooks: {
    init: SyncHook<unknown>;
    beforeRender: SyncHook<unknown>;
    afterRender: SyncHook<unknown>;
  };
  models: IModel[];
  styleAttributes: {
    [attributeName: string]: ILayerStyleAttribute;
  };
  sourceOption: {
    data: any;
    options?: ISourceCFG;
  };
  multiPassRenderer: IMultiPassRenderer;
  init(): ILayer;
  size(field: StyleAttrField, value?: StyleAttributeOption): ILayer;
  color(field: StyleAttrField, value?: StyleAttributeOption): ILayer;
  shape(field: StyleAttrField, value?: StyleAttributeOption): ILayer;
  // pattern(field: string, value: StyleAttributeOption): ILayer;
  // filter(field: string, value: StyleAttributeOption): ILayer;
  // active(option: ActiveOption): ILayer;
  style(options: ILayerStyleOptions): ILayer;
  // hide(): ILayer;
  // show(): ILayer;
  // animate(field: string, option: any): ILayer;
  render(): ILayer;
  destroy(): void;
  source(data: any, option?: ISourceCFG): ILayer;
  addPlugin(plugin: ILayerPlugin): ILayer;
  getSource(): ISource;
  setSource(source: ISource): void;
  setEncodedData(encodedData: Array<{ [key: string]: unknown }>): void;
  getEncodedData(): Array<{ [key: string]: unknown }>;
  getInitializationOptions(): Partial<ILayerInitializationOptions>;
}

export interface ILayerPlugin {
  apply(layer: ILayer): void;
}

/**
 * Layer 初始化参数
 */
export interface ILayerInitializationOptions {
  enableMultiPassRenderer: boolean;
  enablePicking: boolean;
  passes: Array<string | [string, { [key: string]: unknown }]>;
}

/**
 * 提供 Layer 管理服务
 */
export interface ILayerService {
  add(layer: ILayer): void;
  initLayers(): void;
  renderLayers(): void;
  clean(): void;
}
