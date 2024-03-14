import {
  Constant as ConstantScale,
  Diverging as DivergingScale,
  Identity as IdentityScale,
  Linear as LinearScale,
  Log as LogScale,
  Ordinal as OrdinalScale,
  Pow as PowScale,
  Quantile as QuantileScale,
  Quantize as QuantizeScale,
  Sequential as SequentialScale,
  Threshold as ThresholdScale,
  Time as TimeScale,
} from '@antv/scale';

export const ENCODE_TYPE = {
  CONSTANT: 'constant',
  FIELD: 'field',
  TRANSFORM: 'transform',
  COLUMN: 'column',
} as const;

type EncodeMapType = typeof ENCODE_TYPE;
export type EncodeType = EncodeMapType[keyof EncodeMapType];

export const SCALE_TYPE = {
  // Continuous Scales 线性类比例尺
  LINEAR: 'linear',
  POW: 'pow',
  LOG: 'log',
  IDENTITY: 'identity',
  TIME: 'time',

  // Distribution Scales 分布类比例尺
  QUANTILE: 'quantile',
  QUANTIZE: 'quantize',
  THRESHOLD: 'threshold',
  // CUSTOM: 'threshold', // TODO:兼容旧版别名 THRESHOLD?

  // Discrete Scales 离散类比例尺
  ORDINAL: 'ordinal',
  // CAT: 'ordinal', // TODO:兼容旧版别名 ORDINAL?

  // Special
  SEQUENTIAL: 'sequential',
  DIVERGING: 'diverging',
  CONSTANT: 'constant',
} as const;

type ScaleMapType = typeof SCALE_TYPE;
export type ScaleType = ScaleMapType[keyof ScaleMapType];

export const SCALE_MAP: Record<ScaleType, any> = {
  // Continuous
  [SCALE_TYPE.LINEAR]: LinearScale,
  [SCALE_TYPE.POW]: PowScale,
  [SCALE_TYPE.LOG]: LogScale,
  [SCALE_TYPE.IDENTITY]: IdentityScale,
  [SCALE_TYPE.TIME]: TimeScale,

  // Distribution
  [SCALE_TYPE.THRESHOLD]: ThresholdScale,
  [SCALE_TYPE.QUANTILE]: QuantileScale,
  [SCALE_TYPE.QUANTIZE]: QuantizeScale,

  // Discrete
  [SCALE_TYPE.ORDINAL]: OrdinalScale,

  // Special
  [SCALE_TYPE.SEQUENTIAL]: SequentialScale,
  [SCALE_TYPE.DIVERGING]: DivergingScale,
  [SCALE_TYPE.CONSTANT]: ConstantScale,
} as const;
