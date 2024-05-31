import type { Buffer, Device } from '@antv/g-device-api';
import { BufferUsage } from '@antv/g-device-api';
import type { IBuffer, IBufferInitializationOptions } from '@antv/l7-core';
import { gl } from '@antv/l7-core';
import { hintMap, typedArrayCtorMap } from './constants';
import type { TypedArray } from './utils/typedarray';
import { isTypedArray } from './utils/typedarray';

/**
 * Use Buffer from @antv/g-device-api
 */
export default class DeviceBuffer implements IBuffer {
  private buffer: Buffer;

  private isDestroyed: boolean = false;
  private type;
  private size: number;

  constructor(device: Device, options: IBufferInitializationOptions) {
    const { data, usage, type, isUBO, label } = options;

    let typed: TypedArray;
    if (isTypedArray(data)) {
      typed = data;
    } else {
      typed = new typedArrayCtorMap[this.type || gl.FLOAT](data as number[]);
    }

    this.type = type;
    this.size = typed.byteLength;

    // @see https://www.npmjs.com/package/@antv/g-device-api#createBuffer
    this.buffer = device.createBuffer({
      viewOrSize: typed,
      usage: isUBO ? BufferUsage.UNIFORM : BufferUsage.VERTEX,
      hint: hintMap[usage || gl.STATIC_DRAW],
    });
    if (label) {
      device.setResourceName(this.buffer, label);
    }
  }

  get() {
    return this.buffer;
  }

  destroy() {
    if (!this.isDestroyed) {
      this.buffer.destroy();
    }
    this.isDestroyed = true;
  }

  subData({
    data,
    offset,
  }: {
    data: number[] | number[][] | Uint8Array | Uint16Array | Uint32Array;
    offset: number;
  }) {
    let typed: TypedArray;
    if (isTypedArray(data)) {
      typed = data;
    } else {
      typed = new typedArrayCtorMap[this.type || gl.FLOAT](data as number[]);
    }
    this.buffer.setSubData(offset, new Uint8Array(typed.buffer));
  }
}
