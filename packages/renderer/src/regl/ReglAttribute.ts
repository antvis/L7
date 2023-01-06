import {
  IAttribute,
  IAttributeInitializationOptions,
  IBuffer,
} from '@antv/l7-core';
import regl from 'l7regl';

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
      buffer,
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
}
