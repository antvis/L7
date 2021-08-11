import { gl, IBuffer, IBufferInitializationOptions } from '@antv/l7-core';
import regl from 'l7regl';
import { dataTypeMap, usageMap } from './constants';

/**
 * adaptor for regl.Buffer
 * @see https://github.com/regl-project/regl/blob/gh-pages/API.md#buffers
 */
export default class ReglBuffer implements IBuffer {
  private buffer: regl.Buffer;

  constructor(reGl: regl.Regl, options: IBufferInitializationOptions) {
    const { data, usage, type } = options;
    this.buffer = reGl.buffer({
      data,
      usage: usageMap[usage || gl.STATIC_DRAW],
      type: dataTypeMap[type || gl.UNSIGNED_BYTE],
      // length: 0,
    });
  }

  public get() {
    return this.buffer;
  }

  public destroy() {
    this.buffer.destroy();
  }

  public subData({
    data,
    offset,
  }: {
    data: number[] | number[][] | Uint8Array | Uint16Array | Uint32Array;
    offset: number;
  }) {
    this.buffer.subdata(data, offset);
  }
}
