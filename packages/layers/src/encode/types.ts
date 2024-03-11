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
 *    encode?: Record<ChannelTypes, Encode>
 *    sclae?:...
 * }
 */
export type Encode =
  | ConstantEncode
  | ConstantEncode['value']
  | FieldEncode
  | FieldEncode['value']
  | TransformEncode
  | TransformEncode['value']
  | ColumnEncode;

export type EncodeTypes = 'constant' | 'field' | 'transform' | 'column';

export type ConstantEncode = {
  type: 'constant';
  value: Primitive;
};

export type FieldEncode = {
  type: 'field';
  value: string;
};

export type ColumnEncode = {
  type: 'column';
  value: Primitive[];
};

export type TransformEncode = {
  type: 'transform';
  value: FunctionEncode;
};

export type FunctionEncode = (value: TabularData[number], index: number, array: TabularData) => Primitive;

// export type ValueEncode = NormalizedEncode | PrimitiveEncode;

export type NormalizedEncode = ConstantEncode | FieldEncode | TransformEncode | ColumnEncode;

// export type PrimitiveEncode = Primitive | FunctionEncode;

export type ValuedEncode = {
  field: string | null;
  type: 'column';
  value: Primitive[];
  isConstant: boolean;
};

export type EncodeMethod = (data: TabularData, value: any) => Primitive[];

// export type ChannelGroups = {
//   name?: string;
//   scaleKey?: string;
//   // @todo
//   scale?: Record<string, any>;
//   values?: {
//     name?: string;
//     value?: Primitive[];
//     field?: string;
//   }[];
// };
