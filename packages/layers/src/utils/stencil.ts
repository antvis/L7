import {
  gl,
  IRenderOptions,
  IStencilOptions,
  MaskOperation,
  MaskOperationType,
  StencilType,
} from '@antv/l7-core';
// 掩膜配置
export function getStencil(
  mask: boolean,
  maskInside: boolean,
): Partial<IStencilOptions> {
  return {
    enable: mask,
    mask: 0xff,
    func: {
      cmp: gl.EQUAL, // gl.EQUAL,
      ref: maskInside ? 1 : 0,
      mask: 1,
    },
  };
}
interface IStencilMaskOptions extends IRenderOptions {
  maskOperation?: MaskOperationType;
}
// 模版配置
export function getStencilMask(
  option: Partial<IStencilMaskOptions>,
): Partial<IStencilOptions> {
  if (option.maskOperation === MaskOperation.OR) {
    return {
      enable: true,
      mask: 0xff,
      func: {
        cmp: gl.ALWAYS,
        ref: 1,
        mask: 0xff,
      },
      opFront: {
        fail: gl.KEEP,
        zfail: gl.REPLACE,
        zpass: gl.REPLACE,
      },
    };
  }
  return {
    enable: true,
    mask: 0xff,
    func: {
      cmp:
        option.stencilType === StencilType.SINGLE // 单层
          ? gl.ALWAYS
          : option.stencilIndex === 0 // 多层
          ? gl.ALWAYS
          : gl.LESS,
      ref:
        option.stencilType === StencilType.SINGLE
          ? 1
          : option.stencilIndex === 0
          ? 2
          : 1,
      mask: 0xff,
    },
    opFront: {
      fail: gl.KEEP,
      zfail: gl.REPLACE,
      zpass: gl.REPLACE,
    },
  };
}
