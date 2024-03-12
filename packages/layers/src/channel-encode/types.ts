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

export type EncodeTypes = 'constant' | 'field' | 'transform' | 'column';

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
  type: 'column';
  value: Primitive[];
  isConstant: boolean;
};

export type EncodeMethod = (data: TabularData, value: any) => Primitive[];

export type ChannelDescriptor = {
  name: string;
  // @todo
  scale?: string;
  scaleType?: string;
  quantitative?: string;
  ordinal?: string;
  scaleName?: string;
  required?: boolean;
  value?: Primitive[];
  type?: string;
  field?: string | string[];
  visual?: boolean;
  range?: any[];
};

export type Channel = {
  name: string;
  value: Primitive[];
  field: string | null;
  // @todo
  scale: Record<string, any>;
};

export type ScaleOptions = {
  // @todo
  name?: string;
  type?: string;
  domain?: any[];
  range?: any[];
  field?: string | string[];
  zero?: boolean;
  [key: string]: any;
};
