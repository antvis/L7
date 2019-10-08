import { ISourceCFG } from '@l7/source';
import { AsyncParallelHook, SyncHook } from 'tapable';
import { IModel } from '../renderer/IModel';
import { IMultiPassRenderer } from '../renderer/IMultiPassRenderer';
import { ISource } from '../source/ISourceService';

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

export interface IScale {
  field?: string;
  type: ScaleTypes;
  ticks?: any[];
  nice?: boolean;
  format?: () => any;
  domain?: any[];
}

export interface ILayerGlobalConfig {
  colors: string[];
  size: number;
  shape: string;
  scales: {
    [key: string]: IScale;
  };
}

export type StyleAttributeField = string | string[];
export interface ILayerStyleAttribute {
  type?: string;
  names?: string[];
  field?: StyleAttributeField;
  values?: any[];
  scales?: any[];
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
  multiPassRenderer: IMultiPassRenderer;
  init(): ILayer;
  // size(field: string, value: AttrOption): ILayer;
  // color(field: string, value: AttrOption): ILayer;
  // shape(field: string, value: AttrOption): ILayer;
  // pattern(field: string, value: AttrOption): ILayer;
  // filter(field: string, value: AttrOption): ILayer;
  // active(option: ActiveOption): ILayer;
  // style(options: ILayerStyleOptions): ILayer;
  // hide(): ILayer;
  // show(): ILayer;
  // animate(field: string, option: any): ILayer;
  render(): ILayer;
  destroy(): void;
  source(data: any, option?: ISourceCFG): ILayer;
  addPlugin(plugin: ILayerPlugin): ILayer;
  getSource(): ISource;
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
