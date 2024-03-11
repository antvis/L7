import type {
  Encode,
  EncodeMethod,
  EncodeTypes,
  FunctionEncode,
  NormalizedEncode,
  Primitive,
  TabularData,
  ValuedEncode,
} from './types';
import { mapObject } from './utils';

/**
 * get normalized encode channels by encode channels
 * @example
 * getNormalizedEncode([{radius: 1}, {radius: 2}], {size: 'radius'})
 * // {size: { type: 'field', value: 'radius'}}
 */
export function getNormalizedEncode(data: TabularData, encodeChannels: Record<string, Encode>) {
  const normalizedEncode = mapObject<Encode, NormalizedEncode>(encodeChannels, (channel) =>
    inferEncodeChannels(data, channel),
  );
  return normalizedEncode;
}

export function inferEncodeChannels(data: TabularData, encodeChannel: Encode): NormalizedEncode {
  if (isTypedEncodeChannel(encodeChannel)) return encodeChannel;
  const type = inferEncodeChannelType(data, encodeChannel);
  return { type, value: encodeChannel } as NormalizedEncode;
}

function isTypedEncodeChannel(channel: Encode): channel is NormalizedEncode {
  if (typeof channel !== 'object' || channel instanceof Date || channel === null) {
    return false;
  }
  const { type } = channel;

  return ['constant', 'field', 'transform', 'column'].includes(type);
}

function inferEncodeChannelType(data: TabularData, channel: Encode): EncodeTypes {
  if (typeof channel === 'function') return 'transform';
  if (typeof channel === 'string' && isField(data, channel)) return 'field';
  return 'constant';
}

function isField(data: TabularData, value: string): boolean {
  if (!Array.isArray(data)) return false;
  return data.some((d) => d[value] !== undefined);
}

/**
 * get encode channels with extract columns
 * @example
 * getValuedEncode([{radius: 1}, {radius: 2}], {size: { type: 'field', value: 'radius'}})
 * // {size: {type: 'radius', type: 'column', value: [1, 2], isConstant: false}}
 */
export function getValuedEncode(data: TabularData, encodeChannels: Record<string, NormalizedEncode>) {
  const valuedEncode = mapObject<NormalizedEncode, ValuedEncode>(encodeChannels, (channel) => columnOf(data, channel));

  return valuedEncode;
}

const encodeMethodMap = new Map<EncodeTypes, EncodeMethod>([
  ['constant', (data: TabularData, value: Primitive) => new Array(data.length).fill(value)],
  ['field', (data: TabularData, value: string) => data.map((d) => d[value])],
  ['transform', (data: TabularData, value: FunctionEncode) => data.map(value)],
  ['column', (data: TabularData, value: Primitive[]) => value],
]);

function columnOf(data: TabularData, channel: NormalizedEncode): ValuedEncode {
  const encodeMethod = encodeMethodMap.get(channel.type);
  const value = encodeMethod ? encodeMethod(data, channel.value) : [];
  return {
    type: 'column',
    value,
    field: fieldOf(channel),
    isConstant: channel.type === 'constant',
  };
}

function fieldOf(channel: NormalizedEncode): string | null {
  const { type, value } = channel;
  if (type === 'field' && typeof value === 'string') return value;
  return null;
}

/**
 * get channels
 */
export function getChannels() {}

/**
 * infer scale by channel
 */
export function inferScale() {}
