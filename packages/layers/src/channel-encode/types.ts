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
  isConstant: boolean;
};

export type EncodeMethod = (data: TabularData, value: any) => Primitive[];

export type ChannelDescriptor = {
  name: string;
  // scale type name
  scaleType?: ScaleType;
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

export type ScaleOptions = {
  type?: ScaleType;
  domain?: any[];
  range?: any[];
  field?: string;
  zero?: boolean;
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
