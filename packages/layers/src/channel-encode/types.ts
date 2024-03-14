import type { Interpolate, Interpolator } from '@antv/scale';
import type { EncodeType, ScaleType } from './constants';

export { EncodeType, ScaleType };

export type Primitive = number | string | boolean | Date;

/**
 * tabular data, like:
 * [
 *  { lng: 103, lat: 32, mag: 5, },
 *  { lng: 103, lat: 33, mag: 6.4, },
 *  { lng: 102, lat: 32, mag: 4.4, },
 * ]
 */
export type TabularData = Record<string, Primitive>[];

/**
 * Encode Spec
 * use layer like:
 * {
 *    encode?: Record<ChannelTypes, EncodeOptions>
 *    sclae?: Record<string, ScaleOptions>
 * }
 */
export type EncodeOptions =
  | ConstantEncode
  | ConstantEncode['value']
  | FieldEncode
  | FieldEncode['value']
  | TransformEncode
  | TransformEncode['value']
  | ColumnEncode;

type ConstantEncode = {
  type: 'constant';
  value: Primitive;
};

type FieldEncode = {
  type: 'field';
  value: string;
};

type ColumnEncode = {
  type: 'column';
  value: Primitive[];
};

type TransformEncode = {
  type: 'transform';
  value: FunctionEncodeOptions;
};

export type FunctionEncodeOptions = (value: TabularData[number], index: number, array: TabularData) => Primitive;

export type NormalizedEncodeOptions = ConstantEncode | FieldEncode | TransformEncode | ColumnEncode;

// export type ValueEncodeOptions = NormalizedEncodeOptions | PrimitiveEncode;
// export type PrimitiveEncode = Primitive | FunctionEncodeOptions;

export type ValuedEncodeOptions = {
  field: string | null;
  // TODO: type support TypedArray
  type: 'column';
  value: Primitive[];
  // is constant value
  isConstant: boolean;
};

export type EncodeMethod = (data: TabularData, value: any) => Primitive[];

export type ChannelDescriptor = {
  name: string;
  // scale type name
  scaleType?: ScaleType;
  // 数据为数值类型推荐的 scale 类型名
  quantitative?: 'linear' | 'log' | 'pow' | 'time';
  required?: boolean;
  // value?: Primitive[];
  // type?: string;
  // field?: string | string[];
  // visual?: boolean;
  range?: any[];
};

export type Channel = {
  name: string;
  value: Primitive[];
  field: string | null;
  scale: ChannelScaleOptions;
};

export type ChannelScaleOptions = ScaleOptions & Pick<ChannelDescriptor, 'quantitative'>;

// TODO: 根据不同的比例尺写不同的参数类型，从 @antv/scale 导出准确的类型
export type ScaleOptions = {
  type?: ScaleType;
  // 设置数据的定义域范围
  domain?: any[];
  // 设置数据映射的值域范围
  range?: any[];
  // 设置数据的定义域最小值
  domainMin?: number;
  // 设置数据的定义域最大值
  domainMax?: number;
  // 设置数据的值域最小值
  rangeMin?: number;
  // 设置数据的值域最大值
  rangeMax?: number;
  // 对于 undefined， NaN，null 空值，返回的数据
  unknown?: any;
  // 扩展 domain 范围，让输出的 tick 展示得更加友好
  nice?: boolean;
  // 将映射值限定在 range 的范围内
  clamp?: boolean;
  // 数据的定义域最小值不能小于 0
  zero?: boolean;
  // 设置推荐的 tick 生成数量，tickCount 只是建议值，不会完全按照这个值产生 tick
  tickCount?: number;
  // 使用 diverging scale 时设置数据的定义域中间值
  neutral?: number;
  // 自定义插值器构造器
  interpolate?: Interpolate<number | string>;
  // 插值器函数
  interpolator?: Interpolator;
  [key: string]: any;
};

export type Scale = {
  map: (x: any) => any;
  invert: (x: any) => any;
  getTicks?: () => any[];
  getBandWidth?: (d?: any) => number;
  getFormatter?: () => (x: any) => string;
  getOptions: () => Record<string, any>;
  update(options: Record<string, any>): void;
  clone: () => Scale;
};
