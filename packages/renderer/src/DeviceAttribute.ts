import type { Buffer, Device } from '@antv/g-device-api';
import type { IAttribute, IAttributeInitializationOptions, IBuffer } from '@antv/l7-core';
import type DeviceBuffer from './DeviceBuffer';

interface AttributeConfig {
  shaderLocation?: number;
  /** A REGLBuffer wrapping the buffer object. (Default: null) */
  buffer?: Buffer;
  /** The offset of the vertexAttribPointer in bytes. (Default: 0) */
  offset?: number | undefined;
  /** The stride of the vertexAttribPointer in bytes. (Default: 0) */
  stride?: number | undefined;
  /** Whether the pointer is normalized. (Default: false) */
  normalized?: boolean;
  /** The size of the vertex attribute. (Default: Inferred from shader) */
  size?: number | undefined;
  /** Sets gl.vertexAttribDivisorANGLE. Only supported if the ANGLE_instanced_arrays extension is available. (Default: 0) */
  divisor?: number | undefined;
  /** Data type for attribute */
  type?: 'uint8' | 'uint16' | 'uint32' | 'float' | 'int8' | 'int16' | 'int32';
}

export default class DeviceAttribute implements IAttribute {
  private attribute: AttributeConfig;
  private buffer: IBuffer;

  constructor(device: Device, options: IAttributeInitializationOptions) {
    const { buffer, offset, stride, normalized, size, divisor, shaderLocation } = options;
    this.buffer = buffer;
    this.attribute = {
      shaderLocation,
      buffer: (buffer as DeviceBuffer).get(),
      offset: offset || 0,
      stride: stride || 0,
      normalized: normalized || false,
      divisor: divisor || 0,
    };

    if (size) {
      this.attribute.size = size;
    }
  }

  get() {
    return this.buffer;
  }

  updateBuffer(options: {
    // 用于替换的数据
    data: number[] | number[][] | Uint8Array | Uint16Array | Uint32Array;
    // 原 Buffer 替换位置，单位为 byte
    offset: number;
  }) {
    this.buffer.subData(options);
  }

  destroy() {
    this.buffer.destroy();
  }
}
