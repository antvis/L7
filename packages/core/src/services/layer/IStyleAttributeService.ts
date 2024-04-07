import type { IAttribute, IAttributeInitializationOptions } from '../renderer/IAttribute';
import type { IBufferInitializationOptions } from '../renderer/IBuffer';
import type { IElements } from '../renderer/IElements';
import type { ILayer } from './ILayerService';

/**
 * 1. 提供各个 Layer 样式属性初始值的注册服务
 * 2. 当 Layer 通过 style() 改变某些样式属性时，需要感知并标记该属性已经失效，
 *    随后当 Layer 重绘时通过 dirty 标记进行脏检查。重新传入 uniform 或者构建顶点数据（更新 Buffer 中的指定位置）。
 * @see https://yuque.antfin-inc.com/yuqi.pyq/fgetpa/qfuzg8
 */

export enum ScaleTypes {
  LINEAR = 'linear',
  SEQUENTIAL = 'sequential',
  POWER = 'power',
  LOG = 'log',
  IDENTITY = 'identity',
  TIME = 'time',
  QUANTILE = 'quantile',
  QUANTIZE = 'quantize',
  THRESHOLD = 'threshold',
  CAT = 'cat',
  DIVERGING = 'diverging',
  CUSTOM = 'threshold',
}
export type ScaleTypeName =
  | 'linear'
  | 'power'
  | 'log'
  | 'identity'
  | 'time'
  | 'quantile'
  | 'quantize'
  | 'threshold'
  | 'diverging'
  | 'sequential'
  | 'cat'
  | 'custom';

export type ScaleAttributeType = 'color' | 'size' | 'shape';
export interface IScale {
  type: ScaleTypeName;
  neutral?: number;
  field?: string;
  unknown?: string;
  ticks?: any[];
  nice?: boolean;
  clamp?: boolean;
  format?: () => any;
  domain?: any[];
  range?: any[];
}

export enum StyleScaleType {
  CONSTANT = 'constant',
  VARIABLE = 'variable',
}
export interface IScaleOption extends IScale {
  attr?: ScaleAttributeType;
}
export interface IScaleOptions {
  [key: string]: IScale | undefined;
}
export interface IStyleScale {
  scale: any;
  field: string | number;
  type: StyleScaleType;
  option: IScaleOption | undefined;
}
export enum AttributeType {
  Attribute,
  InstancedAttribute,
  Uniform,
}

export interface IAnimateOption {
  enable: boolean;
  type?: string;
  interval?: number;
  duration?: number;
  trailLength?: number;
  repeat?: number;
  speed?: number;
  rings?: number;
}

export interface IEncodeFeature {
  color?: Color;
  size?: number | number[];
  shape?: string | number;
  pattern?: string;
  id?: number;
  coordinates: Position | Position[] | Position[][];
  [key: string]: any;
}

export interface IVertexAttributeDescriptor
  extends Omit<IAttributeInitializationOptions, 'buffer'> {
  /**
   * attribute name in vertex shader
   */
  name: string;
  /**
   * 创建 buffer 的参数
   */
  buffer: IBufferInitializationOptions;
  update?: (
    feature: IEncodeFeature,
    featureIdx: number,
    vertex: number[],
    attributeIdx: number,
    normal: number[],
    vertexIndex?: number,
  ) => number[];
}

export type Position = number[];
type Color = [number, number, number, number];
type CallBack = (...args: any[]) => any;
export type StyleAttributeField = string | string[] | number[] | number;
export type StyleAttributeOption = string | number | boolean | any[] | CallBack;
export type StyleAttrField = string | string[] | number | number[];
export interface IAttributeScale {
  field: string | number;
  func: unknown;
  option: IScaleOption | undefined;
}

export interface IStyleAttributeInitializationOptions {
  name: string;
  type: AttributeType;
  scale?: {
    field: StyleAttributeField;
    values: unknown[] | string;
    defaultValues: unknown[] | string;
    names: string[] | number[];
    type: StyleScaleType;
    callback?: (...args: any[]) => [];
    scalers?: IAttributeScale[];
  };
  descriptor: IVertexAttributeDescriptor;
}

export interface IScaleValue {
  field: StyleAttributeField | undefined;
  values: unknown[] | string | undefined;
  callback?: (...args: any[]) => [] | undefined;
}

export interface IFeatureRange {
  startIndex: number;
  endIndex: number;
}

export interface IStyleAttribute extends IStyleAttributeInitializationOptions {
  needRescale: boolean;
  needRemapping: boolean;
  needRegenerateVertices: boolean;
  featureRange: IFeatureRange;
  /**
   * 保存渲染层 IAttribute 引用
   */
  vertexAttribute: IAttribute;
  mapping?(...params: unknown[]): unknown[];
  setProps(props: Partial<IStyleAttributeInitializationOptions>): void;
  resetDescriptor(): void;
}

export type Triangulation = (
  feature: IEncodeFeature,
  styleOption?: unknown,
) => {
  vertices: number[];
  indices: number[];
  size: number;
  normals?: number[];
  indexes?: number[];
  count?: number;
};

export interface IStyleAttributeUpdateOptions {
  featureRange: IFeatureRange;
}

export interface IStyleAttributeService {
  attributesAndIndices: {
    attributes: {
      [attributeName: string]: IAttribute;
    };
    elements: IElements;
  };
  registerStyleAttribute(options: Partial<IStyleAttributeInitializationOptions>): IStyleAttribute;
  unRegisterStyleAttribute(name: string): void;
  updateScaleAttribute(scale: IScaleOptions): void;
  updateStyleAttribute(
    attributeName: string,
    attributeOptions: Partial<IStyleAttributeInitializationOptions>,
    updateOptions: IStyleAttributeUpdateOptions,
  ): void;
  getLayerStyleAttributes(): IStyleAttribute[] | undefined;
  getLayerStyleAttribute(attributeName: string): IStyleAttribute | undefined;
  getLayerAttributeScale(attributeName: string): any;
  createAttributesAndIndices(
    encodedFeatures: IEncodeFeature[],
    triangulation?: Triangulation,
    styleOption?: unknown,
    layer?: ILayer,
  ): {
    attributes: {
      [attributeName: string]: IAttribute;
    };
    elements: IElements;
    count: number | null;
  };
  /**
   * 根据 feature range 更新指定属性
   */
  updateAttributeByFeatureRange(
    attributeName: string,
    features: IEncodeFeature[],
    startFeatureIdx?: number,
    endFeatureIdx?: number,
    layer?: ILayer,
  ): void;
  /**
   * 清除当前管理的所有属性
   */
  clearAllAttributes(): void;
}
