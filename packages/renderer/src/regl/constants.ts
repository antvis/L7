/**
 * @desc 由于 regl 使用大量字符串而非 WebGL 常量，因此需要映射
 */
import { gl } from '@antv/l7-core';
import type regl from 'regl';

// @see https://github.com/regl-project/regl/blob/gh-pages/lib/constants/primitives.json
export const primitiveMap: {
  [key: string]:
    | 'points'
    | 'lines'
    | 'line loop'
    | 'line strip'
    | 'triangles'
    | 'triangle strip'
    | 'triangle fan';
} = {
  [gl.POINTS]: 'points',
  [gl.LINES]: 'lines',
  [gl.LINE_LOOP]: 'line loop',
  [gl.LINE_STRIP]: 'line strip',
  [gl.TRIANGLES]: 'triangles',
  [gl.TRIANGLE_FAN]: 'triangle fan',
  [gl.TRIANGLE_STRIP]: 'triangle strip',
};

export const usageMap: {
  [key: string]: 'static' | 'dynamic' | 'stream';
} = {
  [gl.STATIC_DRAW]: 'static',
  [gl.DYNAMIC_DRAW]: 'dynamic',
  [gl.STREAM_DRAW]: 'stream',
};

export const dataTypeMap: {
  [key: string]: 'int8' | 'int16' | 'int32' | 'uint8' | 'uint16' | 'uint32' | 'float';
} = {
  [gl.BYTE]: 'int8',
  // [gl.UNSIGNED_INT]: 'int16',
  [gl.INT]: 'int32',
  [gl.UNSIGNED_BYTE]: 'uint8',
  [gl.UNSIGNED_SHORT]: 'uint16',
  [gl.UNSIGNED_INT]: 'uint32',
  [gl.FLOAT]: 'float',
};

export const formatMap: {
  [key: string]:
    | 'alpha'
    | 'luminance'
    | 'luminance alpha'
    | 'rgb'
    | 'rgba'
    | 'rgba4'
    | 'rgb5 a1'
    | 'rgb565'
    | 'depth'
    | 'depth stencil';
} = {
  [gl.ALPHA]: 'alpha',
  [gl.LUMINANCE]: 'luminance',
  [gl.LUMINANCE_ALPHA]: 'luminance alpha',
  [gl.RGB]: 'rgb',
  [gl.RGBA]: 'rgba',
  [gl.RGBA4]: 'rgba4',
  [gl.RGB5_A1]: 'rgb5 a1',
  [gl.RGB565]: 'rgb565',
  [gl.DEPTH_COMPONENT]: 'depth',
  [gl.DEPTH_STENCIL]: 'depth stencil',
};

export const mipmapMap: {
  [key: string]: 'dont care' | 'nice' | 'fast';
} = {
  [gl.DONT_CARE]: 'dont care',
  [gl.NICEST]: 'nice',
  [gl.FASTEST]: 'fast',
};

export const filterMap: {
  [key: string]:
    | 'nearest'
    | 'linear'
    | 'mipmap'
    | 'nearest mipmap linear'
    | 'linear mipmap nearest'
    | 'nearest mipmap nearest';
} = {
  [gl.NEAREST]: 'nearest',
  [gl.LINEAR]: 'linear',
  [gl.LINEAR_MIPMAP_LINEAR]: 'mipmap',
  [gl.NEAREST_MIPMAP_LINEAR]: 'nearest mipmap linear',
  [gl.LINEAR_MIPMAP_NEAREST]: 'linear mipmap nearest',
  [gl.NEAREST_MIPMAP_NEAREST]: 'nearest mipmap nearest',
};

export const wrapModeMap: {
  [key: string]: 'repeat' | 'clamp' | 'mirror';
} = {
  [gl.REPEAT]: 'repeat',
  [gl.CLAMP_TO_EDGE]: 'clamp',
  [gl.MIRRORED_REPEAT]: 'mirror',
};

export const colorSpaceMap: {
  [key: string]: 'none' | 'browser';
} = {
  [gl.NONE]: 'none',
  [gl.BROWSER_DEFAULT_WEBGL]: 'browser',
};

export const depthFuncMap: {
  [key: string]:
    | 'never'
    | 'always'
    | 'less'
    | 'lequal'
    | 'greater'
    | 'gequal'
    | 'equal'
    | 'notequal';
} = {
  [gl.NEVER]: 'never',
  [gl.ALWAYS]: 'always',
  [gl.LESS]: 'less',
  [gl.LEQUAL]: 'lequal',
  [gl.GREATER]: 'greater',
  [gl.GEQUAL]: 'gequal',
  [gl.EQUAL]: 'equal',
  [gl.NOTEQUAL]: 'notequal',
};

export const blendEquationMap: {
  [key: string]: regl.BlendingEquation;
} = {
  [gl.FUNC_ADD]: 'add',
  [gl.MIN_EXT]: 'min',
  [gl.MAX_EXT]: 'max',
  [gl.FUNC_SUBTRACT]: 'subtract',
  [gl.FUNC_REVERSE_SUBTRACT]: 'reverse subtract',
};

export const blendFuncMap: {
  [key: string]: regl.BlendingFunction;
} = {
  [gl.ZERO]: 'zero',
  [gl.ONE]: 'one',
  [gl.SRC_COLOR]: 'src color',
  [gl.ONE_MINUS_SRC_COLOR]: 'one minus src color',
  [gl.SRC_ALPHA]: 'src alpha',
  [gl.ONE_MINUS_SRC_ALPHA]: 'one minus src alpha',
  [gl.DST_COLOR]: 'dst color',
  [gl.ONE_MINUS_DST_COLOR]: 'one minus dst color',
  [gl.DST_ALPHA]: 'dst alpha',
  [gl.ONE_MINUS_DST_ALPHA]: 'one minus dst alpha',
  [gl.CONSTANT_COLOR]: 'constant color',
  [gl.ONE_MINUS_CONSTANT_COLOR]: 'one minus constant color',
  [gl.CONSTANT_ALPHA]: 'constant alpha',
  [gl.ONE_MINUS_CONSTANT_ALPHA]: 'one minus constant alpha',
  [gl.SRC_ALPHA_SATURATE]: 'src alpha saturate',
};

export const stencilFuncMap: {
  [key: string]: regl.ComparisonOperatorType;
} = {
  [gl.NEVER]: 'never',
  [gl.ALWAYS]: 'always',
  [gl.LESS]: 'less',
  [gl.LEQUAL]: 'lequal',
  [gl.GREATER]: 'greater',
  [gl.GEQUAL]: 'gequal',
  [gl.EQUAL]: 'equal',
  [gl.NOTEQUAL]: 'notequal',
};

export const stencilOpMap: {
  [key: string]: regl.StencilOperationType;
} = {
  [gl.ZERO]: 'zero',
  [gl.KEEP]: 'keep',
  [gl.REPLACE]: 'replace',
  [gl.INVERT]: 'invert',
  [gl.INCR]: 'increment',
  [gl.DECR]: 'decrement',
  [gl.INCR_WRAP]: 'increment wrap',
  [gl.DECR_WRAP]: 'decrement wrap',
};

export const cullFaceMap: {
  [key: string]: regl.FaceOrientationType;
} = {
  [gl.FRONT]: 'front',
  [gl.BACK]: 'back',
};
