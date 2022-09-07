import { gl, IElements, IElementsInitializationOptions } from '@antv/l7-core';
import regl from 'l7regl';
import { dataTypeMap, usageMap } from './constants';

/**
 * @see https://github.com/regl-project/regl/blob/gh-pages/API.md#elements
 */
export default class ReglElements implements IElements {
  private elements: regl.Elements;

  constructor(reGl: regl.Regl, options: IElementsInitializationOptions) {
    const { data, usage, type, count } = options;
    this.elements = reGl.elements({
      data,
      usage: usageMap[usage || gl.STATIC_DRAW],
      type: dataTypeMap[type || gl.UNSIGNED_BYTE] as
        | 'uint8'
        | 'uint16'
        | 'uint32',
      count,
    });
  }

  public get() {
    return this.elements;
  }

  public subData({
    data,
  }: {
    data: number[] | number[][] | Uint8Array | Uint16Array | Uint32Array;
  }) {
    this.elements.subdata(data);
  }

  public destroy() {
    // this.elements.destroy();
  }
}
