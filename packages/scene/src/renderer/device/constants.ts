import {
  AddressMode,
  BlendFactor,
  BlendMode,
  BufferFrequencyHint,
  CompareFunction,
  CullMode,
  Format,
  PrimitiveTopology,
  StencilOp,
} from '@antv/g-device-api';
import { gl } from '@antv/l7-core';
import type { TypedArray } from './utils/typedarray';

export const typedArrayCtorMap: {
  [key: string]: new (data: number[]) => TypedArray;
} = {
  [gl.FLOAT]: Float32Array,
  [gl.UNSIGNED_BYTE]: Uint8Array,
  [gl.SHORT]: Int16Array,
  [gl.UNSIGNED_SHORT]: Uint16Array,
  [gl.INT]: Int32Array,
  [gl.UNSIGNED_INT]: Uint32Array,
};

export const primitiveMap: {
  [key: string]: PrimitiveTopology;
} = {
  [gl.POINTS]: PrimitiveTopology.POINTS,
  [gl.LINES]: PrimitiveTopology.LINES,
  [gl.LINE_LOOP]: PrimitiveTopology.LINES,
  [gl.LINE_STRIP]: PrimitiveTopology.LINE_STRIP,
  [gl.TRIANGLES]: PrimitiveTopology.TRIANGLES,
  [gl.TRIANGLE_FAN]: PrimitiveTopology.TRIANGLES,
  [gl.TRIANGLE_STRIP]: PrimitiveTopology.TRIANGLE_STRIP,
};

export const sizeFormatMap: {
  [key: number]: Format;
} = {
  [1]: Format.F32_R,
  [2]: Format.F32_RG,
  [3]: Format.F32_RGB,
  [4]: Format.F32_RGBA,
};

export const hintMap: {
  [key: string]: BufferFrequencyHint;
} = {
  [gl.STATIC_DRAW]: BufferFrequencyHint.STATIC,
  [gl.DYNAMIC_DRAW]: BufferFrequencyHint.DYNAMIC,
  [gl.STREAM_DRAW]: BufferFrequencyHint.DYNAMIC,
};

export const wrapModeMap: {
  [key: string]: AddressMode;
} = {
  [gl.REPEAT]: AddressMode.REPEAT,
  [gl.CLAMP_TO_EDGE]: AddressMode.CLAMP_TO_EDGE,
  [gl.MIRRORED_REPEAT]: AddressMode.MIRRORED_REPEAT,
};

export const depthFuncMap: {
  [key: string]: CompareFunction;
} = {
  [gl.NEVER]: CompareFunction.NEVER,
  [gl.ALWAYS]: CompareFunction.ALWAYS,
  [gl.LESS]: CompareFunction.LESS,
  [gl.LEQUAL]: CompareFunction.LEQUAL,
  [gl.GREATER]: CompareFunction.GREATER,
  [gl.GEQUAL]: CompareFunction.GEQUAL,
  [gl.EQUAL]: CompareFunction.EQUAL,
  [gl.NOTEQUAL]: CompareFunction.NOTEQUAL,
};

export const cullFaceMap: {
  [key: string]: CullMode;
} = {
  [gl.FRONT]: CullMode.FRONT,
  [gl.BACK]: CullMode.BACK,
};

export const blendEquationMap: {
  [key: string]: BlendMode;
} = {
  [gl.FUNC_ADD]: BlendMode.ADD,
  [gl.MIN_EXT]: BlendMode.MIN,
  [gl.MAX_EXT]: BlendMode.MAX,
  [gl.FUNC_SUBTRACT]: BlendMode.SUBSTRACT,
  [gl.FUNC_REVERSE_SUBTRACT]: BlendMode.REVERSE_SUBSTRACT,
};

export const blendFuncMap: {
  [key: string]: BlendFactor;
} = {
  [gl.ZERO]: BlendFactor.ZERO,
  [gl.ONE]: BlendFactor.ONE,
  [gl.SRC_COLOR]: BlendFactor.SRC,
  [gl.ONE_MINUS_SRC_COLOR]: BlendFactor.ONE_MINUS_SRC,
  [gl.SRC_ALPHA]: BlendFactor.SRC_ALPHA,
  [gl.ONE_MINUS_SRC_ALPHA]: BlendFactor.ONE_MINUS_SRC_ALPHA,
  [gl.DST_COLOR]: BlendFactor.DST,
  [gl.ONE_MINUS_DST_COLOR]: BlendFactor.ONE_MINUS_DST,
  [gl.DST_ALPHA]: BlendFactor.DST_ALPHA,
  [gl.ONE_MINUS_DST_ALPHA]: BlendFactor.ONE_MINUS_DST_ALPHA,
  [gl.CONSTANT_COLOR]: BlendFactor.CONST,
  [gl.ONE_MINUS_CONSTANT_COLOR]: BlendFactor.ONE_MINUS_CONSTANT,
  [gl.CONSTANT_ALPHA]: BlendFactor.CONST,
  [gl.ONE_MINUS_CONSTANT_ALPHA]: BlendFactor.ONE_MINUS_CONSTANT,
  [gl.SRC_ALPHA_SATURATE]: BlendFactor.SRC_ALPHA_SATURATE,
};

export const stencilOpMap: {
  [key: string]: StencilOp;
} = {
  [gl.REPLACE]: StencilOp.REPLACE,
  [gl.KEEP]: StencilOp.KEEP,
  [gl.ZERO]: StencilOp.ZERO,
  [gl.INVERT]: StencilOp.INVERT,
  [gl.INCR]: StencilOp.INCREMENT_CLAMP,
  [gl.DECR]: StencilOp.DECREMENT_CLAMP,
  [gl.INCR_WRAP]: StencilOp.INCREMENT_WRAP,
  [gl.DECR_WRAP]: StencilOp.DECREMENT_WRAP,
};

export const stencilFuncMap: {
  [key: string]: CompareFunction;
} = {
  [gl.ALWAYS]: CompareFunction.ALWAYS,
  [gl.EQUAL]: CompareFunction.EQUAL,
  [gl.GEQUAL]: CompareFunction.GEQUAL,
  [gl.GREATER]: CompareFunction.GREATER,
  [gl.LEQUAL]: CompareFunction.LEQUAL,
  [gl.LESS]: CompareFunction.LESS,
  [gl.NEVER]: CompareFunction.NEVER,
  [gl.NOTEQUAL]: CompareFunction.NOTEQUAL,
};

// export const filterMap: {
//   [key: string]: FilterMode;
// } = {
//   [gl.NEAREST]: 'nearest',
//   [gl.LINEAR]: 'linear',
//   [gl.LINEAR_MIPMAP_LINEAR]: 'mipmap',
//   [gl.NEAREST_MIPMAP_LINEAR]: 'nearest mipmap linear',
//   [gl.LINEAR_MIPMAP_NEAREST]: 'linear mipmap nearest',
//   [gl.NEAREST_MIPMAP_NEAREST]: 'nearest mipmap nearest',
// };

// export const mipmapMap: {
//   [key: string]: MipmapFilterMode;
// } = {
//   [gl.DONT_CARE]: MipmapFilterMode,
//   [gl.NICEST]: 'nice',
//   [gl.FASTEST]: 'fast',
// };
