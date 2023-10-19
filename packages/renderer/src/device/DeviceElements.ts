import { gl, IElements, IElementsInitializationOptions } from '@antv/l7-core';
import { TypedArray } from '@antv/l7-source';
import { Buffer, BufferUsage, Device } from '@strawberry-vis/g-device-api';
import { isTypedArray } from './utils/typedarray';
import { typedArrayCtorMap } from './constants';

/**
 * @see https://github.com/regl-project/regl/blob/gh-pages/API.md#elements
 */
export default class DeviceElements implements IElements {
  private indexBuffer: Buffer;
  private type;

  constructor(device: Device, options: IElementsInitializationOptions) {
    const { data, usage, type, count } = options;

    let typed: TypedArray;
    if (isTypedArray(data)) {
      typed = data;
    } else {
      typed = new typedArrayCtorMap[this.type || gl.UNSIGNED_INT](
        data as number[],
      );
    }

    this.type = type;

    this.indexBuffer = device.createBuffer({
      viewOrSize: typed,
      usage: BufferUsage.INDEX,
    });
  }

  public get() {
    return this.indexBuffer;
  }

  public subData({
    data,
  }: {
    data: number[] | number[][] | Uint8Array | Uint16Array | Uint32Array;
  }) {
    let typed: TypedArray;
    if (isTypedArray(data)) {
      typed = data;
    } else {
      typed = new typedArrayCtorMap[this.type || gl.UNSIGNED_INT](
        data as number[],
      );
    }
    this.indexBuffer.setSubData(0, new Uint8Array(typed.buffer));
  }

  public destroy() {
    this.indexBuffer.destroy();
  }
}
