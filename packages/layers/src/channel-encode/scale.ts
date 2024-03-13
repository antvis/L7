import { createInterpolateValue } from '@antv/scale';
import { SCALE_MAP, SCALE_TYPE } from './constants';
import type { Channel, ChannelScaleOptions, Primitive, Scale, ScaleOptions, ScaleType } from './types';
import { defined } from './utils/helper';

/**
 * infer scale by value & scale options
 */
export function inferScale(channelName: string, value: Primitive[], channelScale: ChannelScaleOptions): ScaleOptions {
  const type = inferScaleType(channelName, value, channelScale);
  const domain = inferScaleDomain(type, channelName, value, channelScale);
  const range = inferScaleRange(type, channelName, value, channelScale);

  return {
    ...channelScale,
    ...inferScaleOptions(type, channelScale),
    name: channelName,
    type,
    domain,
    range,
  };
}

/**
 * create scale Instance by scale options
 */
export function createScaleInstance(channelScale: ChannelScaleOptions) {
  const { type, ...rest } = channelScale;
  const  Scale = SCALE_MAP[type!]
  const scaleInstance = new Scale(rest) as Scale;

  return scaleInstance;
}

/**
 * scaled channel value
 */
export function applyScale(channels: Channel[], scale: Record<string, Scale>): Record<string, Primitive[]> {
  const scaledValue: Record<string, Primitive[]> = {};
  for (const channel of channels) {
    const { value, name } = channel;
    const scaleInstance = scale[name];
    scaledValue[name] = value.map((d) => scaleInstance.map(d));
  }
  return scaledValue;
}

function inferScaleType(channelName: string, value: Primitive[], channelScale: ChannelScaleOptions): ScaleType {
  const { type, domain, range, quantitative } = channelScale;
  if (type !== undefined) return type;
  if (isObject(value)) return SCALE_TYPE.IDENTITY;
  if ((domain || range || []).length > 2) return asOrdinalType(channelName);
  if (domain !== undefined) {
    if (isOrdinal(domain)) return asOrdinalType(channelName);
    if (isTemporal(value)) return SCALE_TYPE.TIME;
    return asQuantitativeType(channelName, range, quantitative);
  }
  if (isOrdinal(value)) return asOrdinalType(channelName);
  if (isTemporal(value)) return SCALE_TYPE.TIME;
  return asQuantitativeType(channelName, range, quantitative);
}

function inferScaleDomain(
  type: ScaleType,
  channelName: string,
  value: Primitive[],
  channelScale: ChannelScaleOptions,
): Primitive[] {
  const { domain } = channelScale;
  if (domain !== undefined) return domain;
  switch (type) {
    case SCALE_TYPE.LINEAR:
    case SCALE_TYPE.TIME:
    case SCALE_TYPE.LOG:
    case SCALE_TYPE.POW:
    case SCALE_TYPE.QUANTIZE:
    case SCALE_TYPE.THRESHOLD:
      return maybeMinMax(inferDomainQ(value, channelScale), channelScale);
    case SCALE_TYPE.ORDINAL:
      return inferDomainC(value);
    case SCALE_TYPE.QUANTILE:
      return inferDomainO(value);
    case SCALE_TYPE.SEQUENTIAL:
      return maybeMinMax(inferDomainS(value), channelScale);
    default:
      return [];
  }
}

function inferScaleRange(
  type: ScaleType,
  channelName: string,
  value: Primitive[],
  channelScale: ChannelScaleOptions,
): any[] | undefined {
  const { range, rangeMin, rangeMax } = channelScale;
  if (range !== undefined) return range;
  switch (type) {
    case SCALE_TYPE.LINEAR:
    case SCALE_TYPE.TIME:
    case SCALE_TYPE.LOG:
    case SCALE_TYPE.POW:
      const [r0, r1] = inferRangeQ(channelName);
      return [rangeMin || r0, rangeMax || r1];
    case SCALE_TYPE.ORDINAL:
      // TODO: categoricalColors?
      return [];
    case SCALE_TYPE.SEQUENTIAL:
      return undefined;
    case SCALE_TYPE.CONSTANT:
      return [value[0]];
    default:
      return [];
  }
}

function inferScaleOptions(type: ScaleType, channelScale: ChannelScaleOptions): ChannelScaleOptions {
  switch (type) {
    case SCALE_TYPE.LINEAR:
    case SCALE_TYPE.TIME:
    case SCALE_TYPE.LOG:
    case SCALE_TYPE.POW:
      return inferOptionsQ(channelScale);
    case SCALE_TYPE.SEQUENTIAL:
      return inferOptionsS(channelScale);
    default:
      return channelScale;
  }
}

function inferOptionsS(channelScale: ChannelScaleOptions): ChannelScaleOptions {
  // TODO: interpolator?
  return channelScale;
}

function inferOptionsQ(channelScale: ChannelScaleOptions): ChannelScaleOptions {
  const { interpolate = createInterpolateValue, nice = false, tickCount = 5 } = channelScale;
  return { ...channelScale, interpolate, nice, tickCount };
}

function inferRangeQ(name: string): Primitive[] {
  // TODO: color get palette by categoricalColors
  // if (name === 'color') return [];
  if (name === 'opacity') return [0, 1];
  if (name === 'size') return [1, 10];
  return [0, 1];
}

function isObject(value: Primitive[]): boolean {
  return value.some((v) => typeof v === 'object' && !(v instanceof Date) && v !== null && !Array.isArray(v));
}

function isOrdinal(value: Primitive[]): boolean {
  return value.some((v) => {
    const type = typeof v;
    return type === 'string' || type === 'boolean';
  });
}

function isTemporal(value: Primitive[]): boolean {
  return value.some((v) => v instanceof Date);
}

function asOrdinalType(name: string, defaults?: 'ordinal'): ScaleType {
  if (defaults) return defaults;
  return SCALE_TYPE.ORDINAL;
}

function asQuantitativeType(
  name: string,
  range?: Primitive[],
  defaults?: 'linear' | 'log' | 'pow' | 'time',
): ScaleType {
  if (defaults) return defaults;
  if (name !== 'color') return SCALE_TYPE.LINEAR;
  return range ? SCALE_TYPE.LINEAR : SCALE_TYPE.SEQUENTIAL;
}

function maybeMinMax(domain: Primitive[], options: ChannelScaleOptions): Primitive[] {
  if (domain.length === 0) return domain;
  // TODO: domainMin, domainMax ?
  const { domainMin, domainMax } = options;
  const [d0, d1] = domain;
  return [domainMin ?? d0, domainMax ?? d1];
}

function inferDomainQ(value: Primitive[], options: ChannelScaleOptions) {
  const { zero = false } = options;
  let min = Infinity;
  let max = -Infinity;
  for (const d of value) {
    if (defined(d)) {
      min = Math.min(min, +d);
      max = Math.max(max, +d);
    }
  }
  if (min === Infinity) return [];
  return zero ? [Math.min(0, min), max] : [min, max];
}

function inferDomainC(value: Primitive[]) {
  return Array.from(new Set(value));
}

function inferDomainO(value: Primitive[]) {
  return inferDomainC(value).sort();
}

function inferDomainS(value: Primitive[]) {
  let min = Infinity;
  let max = -Infinity;
  for (const d of value) {
    if (defined(d)) {
      min = Math.min(min, +d);
      max = Math.max(max, +d);
    }
  }
  if (min === Infinity) return [];
  return [min < 0 ? -max : min, max];
}
