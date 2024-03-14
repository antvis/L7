import { ENCODE_TYPE } from './constants';
import type {
  EncodeMethod,
  EncodeOptions,
  EncodeType,
  FunctionEncodeOptions,
  NormalizedEncodeOptions,
  Primitive,
  TabularData,
  ValuedEncodeOptions,
} from './types';
import { mapObject } from './utils/array';

/**
 * get normalized encode channels by encode channels.
 * encode channel supported:
 * 1. Constant Encode: `{size: {type: 'constant', value: 5}}` or `{size: 5}`
 * 2. Field Encode: `{size: {type: 'field', value: 'size'}}` or `{size: 'size'}`
 * 3. Function Encode: `{size: {type: 'transform', value: (d) => d.size*2}}` or `{size: (d) => d.size*2}`
 * 4. Data Encode: `{size: {type: 'column', value: [2, 5, 8, 2, 3]}}`
 * @example
 * normalizeEncode([{radius: 1}, {radius: 2}], {size: 'radius'})
 * // {size: { type: 'field', value: 'radius'}}
 */
export function normalizeEncode(data: TabularData, encodeChannels: Record<string, EncodeOptions>) {
  const normalizedEncode = mapObject<EncodeOptions, NormalizedEncodeOptions>(encodeChannels, (channel) =>
    inferEncodeChannels(data, channel),
  );
  return normalizedEncode;
}

function inferEncodeChannels(data: TabularData, encodeChannel: EncodeOptions): NormalizedEncodeOptions {
  if (isTypedEncodeChannel(encodeChannel)) return encodeChannel;
  const type = inferEncodeChannelType(data, encodeChannel);
  return { type, value: encodeChannel } as NormalizedEncodeOptions;
}

function isTypedEncodeChannel(encodeChannel: EncodeOptions): encodeChannel is NormalizedEncodeOptions {
  if (typeof encodeChannel !== 'object' || encodeChannel instanceof Date || encodeChannel === null) {
    return false;
  }
  const { type } = encodeChannel;

  return Object.values(ENCODE_TYPE).includes(type);
}

function inferEncodeChannelType(data: TabularData, encodeChannel: EncodeOptions): EncodeType {
  if (typeof encodeChannel === 'function') return ENCODE_TYPE.TRANSFORM;
  if (typeof encodeChannel === 'string' && isField(data, encodeChannel)) return ENCODE_TYPE.FIELD;
  return ENCODE_TYPE.CONSTANT;
}

function isField(data: TabularData, value: string): boolean {
  if (!Array.isArray(data)) return false;
  return data.some((d) => d[value] !== undefined);
}

/**
 * get encode channels with extract columns.
 * @example
 * getValuedEncode([{radius: 1}, {radius: 2}], {size: { type: 'field', value: 'radius'}})
 * // {size: {type: 'radius', type: 'column', value: [1, 2], isConstant: false}}
 */
export function getValuedEncode(data: TabularData, encodeChannels: Record<string, NormalizedEncodeOptions>) {
  const valuedEncode = mapObject<NormalizedEncodeOptions, ValuedEncodeOptions>(encodeChannels, (channel) =>
    columnOf(data, channel),
  );

  return valuedEncode;
}

const ENCODE_METHOD_MAP = new Map<EncodeType, EncodeMethod>([
  [ENCODE_TYPE.CONSTANT, (data: TabularData, value: Primitive) => new Array(data.length).fill(value)],
  [ENCODE_TYPE.FIELD, (data: TabularData, value: string) => data.map((d) => d[value])],
  [ENCODE_TYPE.TRANSFORM, (data: TabularData, value: FunctionEncodeOptions) => data.map(value)],
  [ENCODE_TYPE.COLUMN, (data: TabularData, value: Primitive[]) => value],
]);

function columnOf(data: TabularData, channel: NormalizedEncodeOptions): ValuedEncodeOptions {
  const encodeMethod = ENCODE_METHOD_MAP.get(channel.type);
  const value = encodeMethod ? encodeMethod(data, channel.value) : [];
  return {
    type: 'column',
    value,
    field: fieldOf(channel),
    isConstant: channel.type === ENCODE_TYPE.CONSTANT,
  };
}

function fieldOf(channel: NormalizedEncodeOptions): string | null {
  const { type, value } = channel;
  if (type === ENCODE_TYPE.FIELD && typeof value === 'string') return value;
  return null;
}
