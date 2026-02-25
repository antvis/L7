/**
 * 比例尺工具
 * 用于替代 d3-scale 的功能
 */

// ==================== 工具函数 ====================

function bisect(a: number[], x: number, lo = 0, hi = a.length): number {
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (a[mid] < x) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function tickIncrement(start: number, stop: number, count: number): number {
  if (start === stop) return 0;
  const d = stop - start;
  const step = Math.pow(10, Math.floor(Math.log(d / count) / Math.LN10));
  const err = (count / d) * step;
  if (err <= 0.15) return step * 10;
  if (err <= 0.35) return step * 5;
  if (err <= 0.75) return step * 2;
  return step;
}

function tickStep(start: number, stop: number, count: number): number {
  if (start === stop) return 1;
  const d = stop - start;
  const step0 = Math.abs(d) / Math.max(1, count);
  let step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10));
  const error = step0 / step1;
  if (error >= 10) step1 *= 10;
  else if (error >= 5) step1 *= 5;
  else if (error >= 2) step1 *= 2;
  return d < 0 ? -step1 : step1;
}

// 处理 domain 中的无效值
function sanitizeDomain(d: any[]): number[] {
  const filtered = d.filter((v) => v != null && !Number.isNaN(v) && typeof v === 'number');
  if (filtered.length === 0) {
    return [0, 1];
  } else if (filtered.length === 1) {
    return [filtered[0], filtered[0]];
  }
  return filtered;
}

// ==================== Linear Scale ====================

export interface ScaleLinear {
  (x: number): number;
  domain(): number[];
  domain(domain: number[]): ScaleLinear;
  range(): number[];
  range(range: number[]): ScaleLinear;
  invert(y: number): number;
  ticks(count?: number): number[];
  nice(count?: number): ScaleLinear;
  clamp(): boolean;
  clamp(clamp: boolean): ScaleLinear;
}

export function scaleLinear(): ScaleLinear {
  let domain: number[] = [0, 1];
  let range: number[] = [0, 1];
  let _clamp = false;

  function scale(x: number): number {
    const d0 = domain[0];
    const d1 = domain[domain.length - 1];
    const r0 = range[0];
    const r1 = range[range.length - 1];

    // 处理相等的 domain
    if (d0 === d1) {
      return r0;
    }

    let t = (x - d0) / (d1 - d0);
    if (_clamp) t = Math.max(0, Math.min(1, t));
    return r0 + t * (r1 - r0);
  }

  scale.domain = function (d?: number[]): any {
    if (d === undefined) return domain.slice();
    domain = sanitizeDomain(d);
    return scale;
  };

  scale.range = function (r?: number[]): any {
    if (r === undefined) return range.slice();
    range = r.slice();
    return scale;
  };

  scale.invert = function (y: number): number {
    const d0 = domain[0];
    const d1 = domain[domain.length - 1];
    const r0 = range[0];
    const r1 = range[range.length - 1];
    return d0 + ((y - r0) / (r1 - r0)) * (d1 - d0);
  };

  scale.ticks = function (count = 10): number[] {
    const d0 = domain[0];
    const d1 = domain[domain.length - 1];
    if (d0 === d1) return [d0];
    const step = tickStep(d0, d1, count);
    const ticks: number[] = [];
    let i = Math.floor(d0 / step);
    const maxI = Math.ceil(d1 / step);
    while (i <= maxI) {
      ticks.push(i * step);
      i++;
    }
    return ticks;
  };

  scale.nice = function (count = 10): ScaleLinear {
    const d0 = domain[0];
    const d1 = domain[domain.length - 1];
    if (d0 === d1) return scale;
    const step = tickIncrement(d0, d1, count);
    if (step > 0) {
      domain = [Math.floor(d0 / step) * step, Math.ceil(d1 / step) * step];
    }
    return scale;
  };

  scale.clamp = function (c?: boolean): any {
    if (c === undefined) return _clamp;
    _clamp = c;
    return scale;
  };

  return scale;
}

// ==================== Power Scale ====================

export interface ScalePow extends ScaleLinear {
  exponent(): number;
  exponent(k: number): ScalePow;
}

export function scalePow(): ScalePow {
  let domain: number[] = [0, 1];
  let range: number[] = [0, 1];
  let _clamp = false;
  let _exponent = 1;

  function scale(x: number): number {
    const d0 = domain[0];
    const d1 = domain[domain.length - 1];
    const r0 = range[0];
    const r1 = range[range.length - 1];

    if (d0 === d1) {
      return r0;
    }

    let t = (x - d0) / (d1 - d0);
    if (_clamp) t = Math.max(0, Math.min(1, t));
    t = Math.pow(t, _exponent);
    return r0 + t * (r1 - r0);
  }

  scale.domain = function (d?: number[]): any {
    if (d === undefined) return domain.slice();
    domain = sanitizeDomain(d);
    return scale;
  };

  scale.range = function (r?: number[]): any {
    if (r === undefined) return range.slice();
    range = r.slice();
    return scale;
  };

  scale.invert = function (y: number): number {
    const d0 = domain[0];
    const d1 = domain[domain.length - 1];
    const r0 = range[0];
    const r1 = range[range.length - 1];
    let t = (y - r0) / (r1 - r0);
    t = Math.pow(t, 1 / _exponent);
    return d0 + t * (d1 - d0);
  };

  scale.ticks = function (count = 10): number[] {
    const d0 = domain[0];
    const d1 = domain[domain.length - 1];
    if (d0 === d1) return [d0];
    const step = tickStep(d0, d1, count);
    const ticks: number[] = [];
    let i = Math.floor(d0 / step);
    const maxI = Math.ceil(d1 / step);
    while (i <= maxI) {
      ticks.push(i * step);
      i++;
    }
    return ticks;
  };

  scale.nice = function (count = 10): ScalePow {
    const d0 = domain[0];
    const d1 = domain[domain.length - 1];
    if (d0 === d1) return scale;
    const step = tickIncrement(d0, d1, count);
    if (step > 0) {
      domain = [Math.floor(d0 / step) * step, Math.ceil(d1 / step) * step];
    }
    return scale;
  };

  scale.clamp = function (c?: boolean): any {
    if (c === undefined) return _clamp;
    _clamp = c;
    return scale;
  };

  scale.exponent = function (k?: number): any {
    if (k === undefined) return _exponent;
    _exponent = k;
    return scale;
  };

  return scale as ScalePow;
}

// ==================== Log Scale ====================

export interface ScaleLog extends ScaleLinear {
  base(): number;
  base(b: number): ScaleLog;
}

function log(x: number, base: number): number {
  return Math.log(x) / Math.log(base);
}

function pow(x: number, base: number): number {
  return Math.pow(base, x);
}

export function scaleLog(): ScaleLog {
  let domain: number[] = [1, 10];
  let range: number[] = [0, 1];
  let _clamp = false;
  let _base = 10;

  function scale(x: number): number {
    const d0 = domain[0];
    const d1 = domain[domain.length - 1];
    const r0 = range[0];
    const r1 = range[range.length - 1];

    if (d0 === d1) {
      return r0;
    }

    const absD0 = Math.abs(d0) || 1;
    const absD1 = Math.abs(d1) || 1;
    const absX = Math.abs(x) || 1;

    let t = (log(absX, _base) - log(absD0, _base)) / (log(absD1, _base) - log(absD0, _base));
    if (_clamp) t = Math.max(0, Math.min(1, t));
    return r0 + t * (r1 - r0);
  }

  scale.domain = function (d?: number[]): any {
    if (d === undefined) return domain.slice();
    const sanitized = sanitizeDomain(d);
    // log scale 需要 正数domain
    domain = sanitized.map((v) => (v <= 0 ? 1 : v));
    return scale;
  };

  scale.range = function (r?: number[]): any {
    if (r === undefined) return range.slice();
    range = r.slice();
    return scale;
  };

  scale.invert = function (y: number): number {
    const d0 = domain[0];
    const d1 = domain[domain.length - 1];
    const r0 = range[0];
    const r1 = range[range.length - 1];
    const t = (y - r0) / (r1 - r0);
    const absD0 = Math.abs(d0) || 1;
    const absD1 = Math.abs(d1) || 1;
    return pow(log(absD0, _base) + t * (log(absD1, _base) - log(absD0, _base)), _base);
  };

  scale.ticks = function (count = 10): number[] {
    const d0 = domain[0];
    const d1 = domain[domain.length - 1];
    if (d0 === d1) return [d0];
    const ticks: number[] = [];
    const startPow = Math.floor(log(Math.abs(d0) || 1, _base));
    const endPow = Math.ceil(log(Math.abs(d1) || 1, _base));
    for (let i = startPow; i <= endPow; i++) {
      ticks.push(pow(i, _base));
    }
    return ticks;
  };

  scale.nice = function (): ScaleLog {
    return scale;
  };

  scale.clamp = function (c?: boolean): any {
    if (c === undefined) return _clamp;
    _clamp = c;
    return scale;
  };

  scale.base = function (b?: number): any {
    if (b === undefined) return _base;
    _base = b;
    return scale;
  };

  return scale as ScaleLog;
}

// ==================== Ordinal Scale ====================

export interface ScaleOrdinal<T = any> {
  (x: any): T;
  domain(): any[];
  domain(domain: any[]): ScaleOrdinal<T>;
  range(): T[];
  range(range: T[]): ScaleOrdinal<T>;
  unknown(value: T): ScaleOrdinal<T>;
}

export function scaleOrdinal<T = any>(range?: T[]): ScaleOrdinal<T> {
  let domain: any[] = [];
  let _range: T[] = range || [];
  let _unknown: T | undefined;
  const index = new Map<any, number>();

  function scale(x: any): T {
    let i = index.get(x);
    if (i === undefined) {
      if (_unknown !== undefined) return _unknown;
      if (_range.length === 0) return undefined as T;
      i = domain.push(x) - 1;
      index.set(x, i);
    }
    return _range[i % _range.length];
  }

  scale.domain = function (d?: any[]): any {
    if (d === undefined) return domain.slice();
    domain = [];
    index.clear();
    d.forEach((x) => {
      if (!index.has(x)) {
        index.set(x, domain.length);
        domain.push(x);
      }
    });
    return scale;
  };

  scale.range = function (r?: T[]): any {
    if (r === undefined) return _range.slice();
    _range = r.slice();
    return scale;
  };

  scale.unknown = function (value: T): ScaleOrdinal<T> {
    _unknown = value;
    return scale;
  };

  return scale;
}

// ==================== Quantize Scale ====================

export interface ScaleQuantize {
  (x: number): any;
  domain(): number[];
  domain(domain: number[]): ScaleQuantize;
  range(): any[];
  range(range: any[]): ScaleQuantize;
  invertExtent(y: any): [number, number];
}

export function scaleQuantize(): ScaleQuantize {
  let domain: number[] = [0, 1];
  let _range: any[] = [0, 1];
  let n = 1;

  function scale(x: number): any {
    const d0 = domain[0];
    const d1 = domain[domain.length - 1];
    if (d0 === d1) {
      return _range[0];
    }
    const t = (x - d0) / (d1 - d0);
    const i = Math.max(0, Math.min(n - 1, Math.floor(t * n)));
    return _range[i];
  }

  scale.domain = function (d?: number[]): any {
    if (d === undefined) return domain.slice();
    domain = sanitizeDomain(d);
    return scale;
  };

  scale.range = function (r?: any[]): any {
    if (r === undefined) return _range.slice();
    _range = r.slice();
    n = Math.max(1, _range.length);
    return scale;
  };

  scale.invertExtent = function (y: any): [number, number] {
    const i = _range.indexOf(y);
    if (i < 0) return [NaN, NaN];
    const d0 = domain[0];
    const d1 = domain[domain.length - 1];
    const step = (d1 - d0) / n;
    return [d0 + i * step, d0 + (i + 1) * step];
  };

  return scale;
}

// ==================== Quantile Scale ====================

export interface ScaleQuantile {
  (x: number): any;
  domain(): number[];
  domain(domain: number[]): ScaleQuantile;
  range(): any[];
  range(range: any[]): ScaleQuantile;
  invertExtent(y: any): [number, number];
  quantiles(): number[];
}

export function scaleQuantile(): ScaleQuantile {
  let _domain: number[] = [];
  let _range: any[] = [0, 1];
  let thresholds: number[] = [];

  function scale(x: number): any {
    if (isNaN(x)) return _range[0];
    const i = bisect(thresholds, x);
    return _range[i];
  }

  scale.domain = function (d?: number[]): any {
    if (d === undefined) return _domain.slice();
    _domain = d
      .filter((x) => x != null && !isNaN(x) && typeof x === 'number')
      .sort((a, b) => a - b);
    rescale();
    return scale;
  };

  scale.range = function (r?: any[]): any {
    if (r === undefined) return _range.slice();
    _range = r.slice();
    rescale();
    return scale;
  };

  scale.invertExtent = function (y: any): [number, number] {
    const i = _range.indexOf(y);
    if (i < 0) return [NaN, NaN];
    const n = _range.length;
    return i > 0 ? [thresholds[i - 1], thresholds[i]] : [_domain[0], thresholds[0]];
  };

  scale.quantiles = function (): number[] {
    return thresholds.slice();
  };

  function rescale(): void {
    const n = _range.length;
    const m = _domain.length;
    if (m === 0 || n === 0) {
      thresholds = [];
      return;
    }
    thresholds = [];
    for (let i = 1; i < n; i++) {
      const q = i / n;
      const index = (m - 1) * q;
      const lower = Math.floor(index);
      const upper = Math.ceil(index);
      const weight = index - lower;
      if (upper >= m) {
        thresholds.push(_domain[m - 1]);
      } else {
        thresholds.push(_domain[lower] * (1 - weight) + _domain[upper] * weight);
      }
    }
  }

  return scale;
}

// ==================== Threshold Scale ====================

export interface ScaleThreshold {
  (x: number): any;
  domain(): number[];
  domain(domain: number[]): ScaleThreshold;
  range(): any[];
  range(range: any[]): ScaleThreshold;
  invertExtent(y: any): [number | undefined, number | undefined];
}

export function scaleThreshold(): ScaleThreshold {
  let _domain: number[] = [0.5];
  let _range: any[] = [0, 1];

  function scale(x: number): any {
    const i = bisect(_domain, x);
    return _range[i];
  }

  scale.domain = function (d?: number[]): any {
    if (d === undefined) return _domain.slice();
    _domain = d.filter((v) => v != null && !isNaN(v) && typeof v === 'number');
    if (_domain.length === 0) {
      _domain = [0.5];
    }
    return scale;
  };

  scale.range = function (r?: any[]): any {
    if (r === undefined) return _range.slice();
    _range = r.slice();
    return scale;
  };

  scale.invertExtent = function (y: any): [number | undefined, number | undefined] {
    const i = _range.indexOf(y);
    return [i > 0 ? _domain[i - 1] : undefined, i < _domain.length ? _domain[i] : undefined];
  };

  return scale;
}

// ==================== Sequential Scale ====================

export interface ScaleSequential {
  (x: number): any;
  domain(): number[];
  domain(domain: number[]): ScaleSequential;
  interpolator(): (t: number) => any;
  interpolator(interpolator: (t: number) => any): ScaleSequential;
  clamp(): boolean;
  clamp(clamp: boolean): ScaleSequential;
}

export function scaleSequential(): ScaleSequential {
  let domain: number[] = [0, 1];
  let _interpolator: (t: number) => any = (t) => t;
  let _clamp = false;

  function scale(x: number): any {
    const d0 = domain[0];
    const d1 = domain[domain.length - 1];
    if (d0 === d1) {
      return _interpolator(0.5);
    }
    let t = (x - d0) / (d1 - d0);
    if (_clamp) t = Math.max(0, Math.min(1, t));
    return _interpolator(t);
  }

  scale.domain = function (d?: number[]): any {
    if (d === undefined) return domain.slice();
    domain = sanitizeDomain(d);
    return scale;
  };

  scale.interpolator = function (i?: (t: number) => any): any {
    if (i === undefined) return _interpolator;
    _interpolator = i;
    return scale;
  };

  scale.clamp = function (c?: boolean): any {
    if (c === undefined) return _clamp;
    _clamp = c;
    return scale;
  };

  return scale;
}

// ==================== Diverging Scale ====================

export interface ScaleDiverging {
  (x: number): any;
  domain(): number[];
  domain(domain: number[]): ScaleDiverging;
  interpolator(): (t: number) => any;
  interpolator(interpolator: (t: number) => any): ScaleDiverging;
  clamp(): boolean;
  clamp(clamp: boolean): ScaleDiverging;
}

export function scaleDiverging(): ScaleDiverging {
  let domain: number[] = [0, 0.5, 1];
  let _interpolator: (t: number) => any = (t) => t;
  let _clamp = false;

  function scale(x: number): any {
    const d0 = domain[0];
    const d1 = domain[1];
    const d2 = domain[2];
    let t: number;
    if (x < d1) {
      if (d0 === d1) {
        return _interpolator(0.5);
      }
      t = (x - d0) / (d1 - d0);
      t = _clamp ? Math.max(0, t) : t;
      return _interpolator(0.5 - t * 0.5);
    } else {
      if (d1 === d2) {
        return _interpolator(0.5);
      }
      t = (x - d1) / (d2 - d1);
      t = _clamp ? Math.min(1, t) : t;
      return _interpolator(0.5 + t * 0.5);
    }
  }

  scale.domain = function (d?: number[]): any {
    if (d === undefined) return domain.slice();
    // diverging scale 需要 3 个值
    const sanitized = d.filter((v) => v != null && !isNaN(v) && typeof v === 'number');
    if (sanitized.length >= 3) {
      domain = [sanitized[0], sanitized[1], sanitized[2]];
    } else if (sanitized.length === 2) {
      const mid = (sanitized[0] + sanitized[1]) / 2;
      domain = [sanitized[0], mid, sanitized[1]];
    } else if (sanitized.length === 1) {
      domain = [sanitized[1], sanitized[0], sanitized[0] + 1];
    } else {
      domain = [0, 0.5, 1];
    }
    return scale;
  };

  scale.interpolator = function (i?: (t: number) => any): any {
    if (i === undefined) return _interpolator;
    _interpolator = i;
    return scale;
  };

  scale.clamp = function (c?: boolean): any {
    if (c === undefined) return _clamp;
    _clamp = c;
    return scale;
  };

  return scale;
}

// ==================== Time Scale ====================

export interface ScaleTime extends ScaleLinear {
  // 继承 ScaleLinear，ticks 返回 number[]
}

export function scaleTime(): ScaleTime {
  let domain: number[] = [0, 1];
  let range: number[] = [0, 1];
  let _clamp = false;

  function scale(x: number): number {
    const d0 = domain[0];
    const d1 = domain[domain.length - 1];
    const r0 = range[0];
    const r1 = range[range.length - 1];

    if (d0 === d1) {
      return r0;
    }

    let t = (x - d0) / (d1 - d0);
    if (_clamp) t = Math.max(0, Math.min(1, t));
    return r0 + t * (r1 - r0);
  }

  scale.domain = function (d?: number[]): any {
    if (d === undefined) return domain.slice();
    domain = sanitizeDomain(d);
    return scale;
  };

  scale.range = function (r?: number[]): any {
    if (r === undefined) return range.slice();
    range = r.slice();
    return scale;
  };

  scale.invert = function (y: number): number {
    const d0 = domain[0];
    const d1 = domain[domain.length - 1];
    const r0 = range[0];
    const r1 = range[range.length - 1];
    return d0 + ((y - r0) / (r1 - r0)) * (d1 - d0);
  };

  scale.ticks = function (count = 10): number[] {
    const d0 = domain[0];
    const d1 = domain[domain.length - 1];
    if (d0 === d1) return [d0];
    const step = tickStep(d0, d1, count);
    const ticks: number[] = [];
    let i = Math.floor(d0 / step);
    const maxI = Math.ceil(d1 / step);
    while (i <= maxI) {
      ticks.push(i * step);
      i++;
    }
    return ticks;
  };

  scale.nice = function (count = 10): ScaleTime {
    const d0 = domain[0];
    const d1 = domain[domain.length - 1];
    if (d0 === d1) return scale;
    const step = tickIncrement(d0, d1, count);
    if (step > 0) {
      domain = [Math.floor(d0 / step) * step, Math.ceil(d1 / step) * step];
    }
    return scale;
  };

  scale.clamp = function (c?: boolean): any {
    if (c === undefined) return _clamp;
    _clamp = c;
    return scale;
  };

  return scale as ScaleTime;
}
