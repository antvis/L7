import type { Primitive, ScaleOptions } from './types';

/**
 * infer scale by value & scale options
 */
export function inferScale(name: string, value: Primitive[], scaleOptions: ScaleOptions): ScaleOptions {
  const type = inferScaleType(name, value, scaleOptions);
  const expectedDomain = inferScaleDomain(type, name, value, scaleOptions);
  const range = inferScaleRange(type, name, value, scaleOptions);

  return {
    type,
    domain: expectedDomain,
    range,
  };
}

function inferScaleType(name: string, value: Primitive[], scaleOptions: ScaleOptions): string {
  const { type, domain, range, quantitative, ordinal } = scaleOptions;
  if (type !== undefined) return type;
  if (isObject(value)) return 'identity';
  if (typeof range === 'string') return 'linear';
  if ((domain || range || []).length > 2) return asOrdinalType(name, ordinal);
  if (domain !== undefined) {
    if (isOrdinal(domain)) return asOrdinalType(name, ordinal);
    if (isTemporal(value)) return 'time';
    return asQuantitativeType(name, range, quantitative);
  }
  if (isOrdinal(value)) return asOrdinalType(name, ordinal);
  if (isTemporal(value)) return 'time';
  return asQuantitativeType(name, range, quantitative);
}

function inferScaleDomain(type: string, name: string, value: Primitive[], scaleOptions: ScaleOptions): Primitive[] {
  const { domain } = scaleOptions;
  if (domain !== undefined) return domain;
  return [];
}

function inferScaleRange(type: string, name: string, value: Primitive[], scaleOptions: ScaleOptions) {
  const { range } = scaleOptions;
  // if (typeof range === 'string') return gradientColors(range);
  if (range !== undefined) return range;
  return [];
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

function asOrdinalType(name: string, defaults?: string) {
  if (defaults) return defaults;
  return 'ordinal';
}

function asQuantitativeType(name: string, range?: Primitive[], defaults?: string) {
  if (defaults) return defaults;
  if (name !== 'color') return 'linear';
  return range ? 'linear' : 'sequential';
}
