import { IAttribute, IAttributeInitializationOptions } from '@l7/core';
import regl from 'regl';
import ReglBuffer from './ReglBuffer';

/**
 * @see https://github.com/regl-project/regl/blob/gh-pages/API.md#attributes
 */
export default class ReglAttribute implements IAttribute {
  private attribute: regl.Attribute;

  constructor(gl: regl.Regl, options: IAttributeInitializationOptions) {
    const { buffer, offset, stride, normalized, size, divisor } = options;
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

  public destroy() {
    // TODO: destroy buffer?
  }
}
