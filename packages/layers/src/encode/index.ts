import type {
  Channel,
  ChannelDescriptor,
  EncodeMethod,
  EncodeOptions,
  EncodeTypes,
  FunctionEncodeOptions,
  NormalizedEncodeOptions,
  Primitive,
  ScaleOptions,
  TabularData,
  ValuedEncodeOptions,
} from './types';
import { mapObject } from './utils';

/**
 * get normalized encode channels by encode channels
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

export function inferEncodeChannels(data: TabularData, encodeChannel: EncodeOptions): NormalizedEncodeOptions {
  if (isTypedEncodeChannel(encodeChannel)) return encodeChannel;
  const type = inferEncodeChannelType(data, encodeChannel);
  return { type, value: encodeChannel } as NormalizedEncodeOptions;
}

function isTypedEncodeChannel(channel: EncodeOptions): channel is NormalizedEncodeOptions {
  if (typeof channel !== 'object' || channel instanceof Date || channel === null) {
    return false;
  }
  const { type } = channel;

  return ['constant', 'field', 'transform', 'column'].includes(type);
}

function inferEncodeChannelType(data: TabularData, channel: EncodeOptions): EncodeTypes {
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
export function getValuedEncode(data: TabularData, encodeChannels: Record<string, NormalizedEncodeOptions>) {
  const valuedEncode = mapObject<NormalizedEncodeOptions, ValuedEncodeOptions>(encodeChannels, (channel) =>
    columnOf(data, channel),
  );

  return valuedEncode;
}

const encodeMethodMap = new Map<EncodeTypes, EncodeMethod>([
  ['constant', (data: TabularData, value: Primitive) => new Array(data.length).fill(value)],
  ['field', (data: TabularData, value: string) => data.map((d) => d[value])],
  ['transform', (data: TabularData, value: FunctionEncodeOptions) => data.map(value)],
  ['column', (data: TabularData, value: Primitive[]) => value],
]);

function columnOf(data: TabularData, channel: NormalizedEncodeOptions): ValuedEncodeOptions {
  const encodeMethod = encodeMethodMap.get(channel.type);
  const value = encodeMethod ? encodeMethod(data, channel.value) : [];
  return {
    type: 'column',
    value,
    field: fieldOf(channel),
    isConstant: channel.type === 'constant',
  };
}

function fieldOf(channel: NormalizedEncodeOptions): string | null {
  const { type, value } = channel;
  if (type === 'field' && typeof value === 'string') return value;
  return null;
}

/**
 * get channels with initialize scale options
 */
export function getChannels(
  channelDescriptor: ChannelDescriptor[],
  encodeChannels: Record<string, ValuedEncodeOptions>,
  scales: Record<string, ScaleOptions>,
) {
  // channelDescriptor.filter((descriptor) => {
  //   const channelName = descriptor.name
  //   if (encodeChannels[channelName]) return true;
  //   //@todo if (descriptor.required) throw new Error(`Missing encoding for channel: ${name}.`);
  //   return false;
  // }).map(descriptor => {
  //   const {
  //     scaleType,
  //     range,
  //     quantitative,
  //     ordinal,
  //   } = descriptor;
  // })
  return Object.entries(encodeChannels).map<Channel>(([channelName, encodeChannel]) => {
    const scale = scales[channelName] || {};
    const {
      // @todo: visual channel use identity scale.
      type = encodeChannel.isConstant ? 'constant' : undefined,
      ...scaleOptions
    } = scale;

    return {
      name: channelName,
      value: encodeChannel.value,
      field: encodeChannel.field,
      scale: {
        type,
        ...scaleOptions,
      },
    };
  });
}

/**
 * infer scale by channel
 */
export function inferScale() {}
