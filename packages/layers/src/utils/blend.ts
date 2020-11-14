import { BlendType, gl, IBlendOptions, IBlendTypes } from '@antv/l7-core';
export const BlendTypes: IBlendTypes = {
  [BlendType.additive]: {
    enable: true,
    func: {
      srcRGB: gl.ONE,
      dstRGB: gl.ONE,
      srcAlpha: 1,
      dstAlpha: 1,
    },
  },
  [BlendType.none]: {
    enable: false,
  },
  [BlendType.normal]: {
    enable: true,
    func: {
      srcRGB: gl.SRC_ALPHA,
      dstRGB: gl.ONE_MINUS_SRC_ALPHA,
      srcAlpha: 1,
      dstAlpha: 1,
    },
  },
  [BlendType.subtractive]: {
    enable: true,
    func: {
      srcRGB: gl.ONE,
      dstRGB: gl.ONE,
      srcAlpha: gl.ZERO,
      dstAlpha: gl.ONE_MINUS_SRC_COLOR,
    },
    equation: {
      rgb: gl.FUNC_SUBTRACT,
      alpha: gl.FUNC_SUBTRACT,
    },
  },
  [BlendType.max]: {
    enable: true,
    func: {
      srcRGB: gl.ONE,
      dstRGB: gl.ONE,
    },
    equation: {
      rgb: gl.MAX_EXT,
    },
  },
  [BlendType.min]: {
    enable: true,
    func: {
      srcRGB: gl.ONE,
      dstRGB: gl.ONE,
    },
    equation: {
      rgb: gl.MIN_EXT,
    },
  },
};
