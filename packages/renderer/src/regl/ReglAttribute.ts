import {
  IAttribute,
  IAttributeInitializationOptions,
  IBuffer,
} from '@antv/l7-core';
import regl from 'l7regl';
import ReglBuffer from './ReglBuffer';

/**
 * @see https://github.com/regl-project/regl/blob/gh-pages/API.md#attributes
 */
export default class ReglAttribute implements IAttribute {
  private attribute: regl.Attribute;
  private buffer: IBuffer;

  constructor(gl: regl.Regl, options: IAttributeInitializationOptions) {
    const { buffer, offset, stride, normalized, size, divisor } = options;
    this.buffer = buffer;
    this.attribute = {
      buffer: (buffer as ReglBuffer).get(),
      offset: offset || 0,
      stride: stride || 0,
      normalized: normalized || false,
      divisor: divisor || 0,
    };

    if (size) {
      this.attribute.size = size;
    }
  }

  public get() {
    return this.attribute;
  }

  public updateBuffer(options: {
    // 用于替换的数据
    data: number[] | number[][] | Uint8Array | Uint16Array | Uint32Array;
    // 原 Buffer 替换位置，单位为 byte
    offset: number;
  }) {
    this.buffer.subData(options);
  }

  public destroy() {
    this.buffer.destroy();
  }
}
