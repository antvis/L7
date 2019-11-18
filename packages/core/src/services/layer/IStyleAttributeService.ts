import {
  IAttribute,
  IAttributeInitializationOptions,
} from '../renderer/IAttribute';
import { IBufferInitializationOptions } from '../renderer/IBuffer';
import { IElements } from '../renderer/IElements';
import { IParseDataItem, IParserData } from '../source/ISourceService';
import { ILayer } from './ILayerService';

/**
 * 1. 提供各个 Layer 样式属性初始值的注册服务
 * 2. 当 Layer 通过 style() 改变某些样式属性时，需要感知并标记该属性已经失效，
 *    随后当 Layer 重绘时通过 dirty 标记进行脏检查。重新传入 uniform 或者构建顶点数据（更新 Buffer 中的指定位置）。
 * @see https://yuque.antfin-inc.com/yuqi.pyq/fgetpa/qfuzg8
 */

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
  type: ScaleTypes;
  ticks?: any[];
  nice?: boolean;
  format?: () => any;
  domain?: any[];
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
export interface IScaleOptions {
  [key: string]: IScale;
}
export interface IStyleScale {
  scale: any;
  field: string;
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
  interval?: number;
  duration?: number;
  trailLength?: number;
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
  ) => number[];
}

type Position = number[];
type Color = [number, number, number, number];
type CallBack = (...args: any[]) => any;
export type StyleAttributeField = string | string[];
export type StyleAttributeOption = string | number | boolean | any[] | CallBack;
export type StyleAttrField = string | string[] | number | number[];

export interface IStyleAttributeInitializationOptions {
  name: string;
  type: AttributeType;
  scale?: {
    field: StyleAttributeField;
    values: unknown[];
    names: string[];
    type: StyleScaleType;
    callback?: (...args: any[]) => [];
    scalers?: Array<{
      field: string;
      func: unknown;
    }>;
  };
  descriptor: IVertexAttributeDescriptor;
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
}

export type Triangulation = (
  feature: IEncodeFeature,
) => {
  vertices: number[];
  indices: number[];
  size: number;
  normals?: number[];
};

export interface IStyleAttributeUpdateOptions {
  featureRange: IFeatureRange;
}

export interface IStyleAttributeService {
  // registerDefaultStyleOptions(
  //   layerName: string,
  //   options: ILayerStyleOptions,
  // ): void;
  registerStyleAttribute(
    options: Partial<IStyleAttributeInitializationOptions>,
  ): IStyleAttribute;
  updateStyleAttribute(
    attributeName: string,
    attributeOptions: Partial<IStyleAttributeInitializationOptions>,
    updateOptions: IStyleAttributeUpdateOptions,
  ): void;
  getLayerStyleAttributes(): IStyleAttribute[] | undefined;
  getLayerStyleAttribute(attributeName: string): IStyleAttribute | undefined;
  createAttributesAndIndices(
    encodedFeatures: IEncodeFeature[],
    triangulation: Triangulation,
  ): {
    attributes: {
      [attributeName: string]: IAttribute;
    };
    elements: IElements;
  };
  /**
   * 根据 feature range 更新指定属性
   */
  updateAttributeByFeatureRange(
    attributeName: string,
    features: IEncodeFeature[],
    startFeatureIdx?: number,
    endFeatureIdx?: number,
  ): void;
  /**
   * 清除当前管理的所有属性
   */
  clearAllAttributes(): void;
}
