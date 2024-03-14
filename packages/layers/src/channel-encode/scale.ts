import { createInterpolateValue } from '@antv/scale';
import { interpolateRgbBasis } from 'd3-interpolate';
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
  const Scale = SCALE_MAP[type!];
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
      return maybeMinMax(inferDomainLinear(value, channelScale), channelScale);
    case SCALE_TYPE.ORDINAL:
      return inferDomainOrdinal(value);
    case SCALE_TYPE.QUANTILE:
      return inferDomainQuantile(value);
    case SCALE_TYPE.SEQUENTIAL:
      return maybeMinMax(inferDomainSequential(value), channelScale);
    case SCALE_TYPE.DIVERGING:
      return inferDomainDiverging(value, channelScale);
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
  const { range } = channelScale;
  if (range !== undefined) return range;
  switch (type) {
    case SCALE_TYPE.LINEAR:
    case SCALE_TYPE.TIME:
    case SCALE_TYPE.LOG:
    case SCALE_TYPE.POW:
      const [r0, r1] = inferRangeQuantitative(channelName);
      const { rangeMin, rangeMax } = channelScale;
      return [rangeMin ?? r0, rangeMax ?? r1];
    case SCALE_TYPE.ORDINAL:
      // range 不存在情况，默认使用 domain 做一一映射
      // 1. 兼容旧版本  {shape: 'text'}, type is SCALE_TYPE.ORDINAL
      // 2. TODO: 备注是否还有其他情况？
      const { domain } = channelScale;
      return domain || [];
    case SCALE_TYPE.SEQUENTIAL:
    case SCALE_TYPE.DIVERGING:
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
      return inferOptionsQuantitative(channelScale);
    case SCALE_TYPE.SEQUENTIAL:
    case SCALE_TYPE.DIVERGING:
      return inferOptionsSequential(channelScale);
    default:
      return channelScale;
  }
}

function inferOptionsQuantitative(channelScale: ChannelScaleOptions): ChannelScaleOptions {
  const { interpolate = createInterpolateValue, nice = false, tickCount = 5 } = channelScale;
  return { ...channelScale, interpolate, nice, tickCount };
}

function inferOptionsSequential(channelScale: ChannelScaleOptions): ChannelScaleOptions {
  const { range = [], interpolator = interpolateRgbBasis(range), nice = false, tickCount = 5 } = channelScale;
  return { ...channelScale, interpolator, nice, tickCount };
}

function inferRangeQuantitative(name: string): Primitive[] {
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
  // TODO: is support string time, like: '2024:01:12'
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
  const { domainMin, domainMax } = options;
  const [d0, d1] = domain;
  return [domainMin ?? d0, domainMax ?? d1];
}

function inferDomainExtent(value: Primitive[]) {
  let min = Infinity;
  let max = -Infinity;
  for (const d of value) {
    if (defined(d)) {
      min = Math.min(min, +d);
      max = Math.max(max, +d);
    }
  }
  if (min === Infinity) return [];
  return [min, max];
}

function inferDomainLinear(value: Primitive[], options: ChannelScaleOptions) {
  const { zero = false } = options;
  const [min, max] = inferDomainExtent(value);
  return zero ? [Math.min(0, min), max] : [min, max];
}

function inferDomainOrdinal(value: Primitive[]) {
  return Array.from(new Set(value));
}

function inferDomainQuantile(value: Primitive[]) {
  // TODO: quantile domain 不能直接去重复，muti geo 拆分情况要取原始数据？
  return inferDomainOrdinal(value).sort();
}

function inferDomainSequential(value: Primitive[]) {
  const [min, max] = inferDomainExtent(value);
  return [min < 0 ? -max : min, max];
}

function inferDomainDiverging(value: Primitive[], channelScale: ChannelScaleOptions) {
  const [min, max] = inferDomainExtent(value);
  const { neutral = (min + max) / 2 } = channelScale;
  return [min, neutral, max];
}
