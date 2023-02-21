import { gl, IRenderOptions, IStencilOptions } from '@antv/l7-core';
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
// 模版配置
export function getStencilMask(
  option: Partial<IRenderOptions>,
): Partial<IStencilOptions> {
  return {
    enable: true,
    mask: 0xff,
    func: {
      cmp: option.stencilType ? gl.LESS : gl.ALWAYS,
      ref: option.stencilType ? 1 : 2,
      mask: 0xff,
    },
    opFront: {
      fail: gl.KEEP,
      zfail: gl.REPLACE,
      zpass: gl.REPLACE,
    },
  };
}
