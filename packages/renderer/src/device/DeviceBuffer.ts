import { Buffer, BufferUsage, Device } from '@antv/g-device-api';
import { IBuffer, IBufferInitializationOptions, gl } from '@antv/l7-core';
import { hintMap, typedArrayCtorMap } from './constants';
import { TypedArray, isTypedArray } from './utils/typedarray';

/**
 * Use Buffer from @antv/g-device-api
 */
export default class DeviceBuffer implements IBuffer {
  private buffer: Buffer;

  private isDestroyed: boolean = false;
  private type;
  private size: number;

  constructor(device: Device, options: IBufferInitializationOptions) {
    const { data, usage, type, isUBO } = options;

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
