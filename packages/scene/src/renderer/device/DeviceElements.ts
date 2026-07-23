import type { Buffer, Device } from '@antv/g-device-api';
import { BufferUsage } from '@antv/g-device-api';
import type { IElements, IElementsInitializationOptions } from '@antv/l7-core';
import { gl } from '@antv/l7-core';
import { typedArrayCtorMap } from './constants';
import type { TypedArray } from './utils/typedarray';
import { isTypedArray } from './utils/typedarray';

export default class DeviceElements implements IElements {
  private indexBuffer: Buffer;
  private type;
  private count: number;

  constructor(device: Device, options: IElementsInitializationOptions) {
    const { data, type, count = 0 } = options;

    let typed: TypedArray;
    if (isTypedArray(data)) {
      typed = data;
    } else {
      typed = new typedArrayCtorMap[this.type || gl.UNSIGNED_INT](data as number[]);
    }

    this.type = type;
    this.count = count;

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
      typed = new typedArrayCtorMap[this.type || gl.UNSIGNED_INT](data as number[]);
    }
    this.indexBuffer.setSubData(0, new Uint8Array(typed.buffer));
  }

  public destroy() {
    this.indexBuffer.destroy();
  }
}
