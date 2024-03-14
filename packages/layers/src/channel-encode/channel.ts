import { SCALE_TYPE } from './constants';
import type { Channel, ChannelDescriptor, ScaleOptions, ValuedEncodeOptions } from './types';

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
  //   } = descriptor;
  // })
  return Object.entries(encodeChannels).map<Channel>(([channelName, encodeChannel]) => {
    const scale = scales[channelName] || {};
    const { type, ...scaleOptions } = scale;
    const { isConstant, value } = encodeChannel;

    // compatible old version {shape: 'text'}, type is SCALE_TYPE.ORDINAL
    const isShapeText = isConstant && channelName === 'shape' && value[0] === 'text';
    // @todo: visual channel use identity scale.
    const scaleType = type || isShapeText ? SCALE_TYPE.ORDINAL : isConstant ? SCALE_TYPE.CONSTANT : undefined;

    return {
      name: channelName,
      value: encodeChannel.value,
      field: encodeChannel.field,
      scale: {
        type: scaleType,
        ...scaleOptions,
      },
    };
  });
}
