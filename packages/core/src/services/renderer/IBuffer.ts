import type { gl } from './gl';

export interface IBufferInitializationOptions {
  data: number[] | number[][] | Uint8Array | Uint16Array | Uint32Array | Float32Array;

  /**
   * gl.DRAW_STATIC | gl.DYNAMIC_DRAW | gl.STREAM_DRAW
   */
  usage?: gl.STATIC_DRAW | gl.DYNAMIC_DRAW | gl.STREAM_DRAW;

  /**
   * gl.Float | gl.UNSIGNED_BYTE | ...
   */
  type?: gl.FLOAT | gl.UNSIGNED_BYTE;
  length?: number;

  /**
   * UniformBuffer
   */
  isUBO?: boolean;

  /**
   * Used later in Spector.js.
   */
  label?: string;
}

export interface IBuffer {
  /**
   * gl.bufferSubData
   */
  subData(options: {
    // 用于替换的数据
    data: number[] | number[][] | Uint8Array | Uint16Array | Uint32Array;
    // 原 Buffer 替换位置，单位为 byte
    offset: number;
  }): void;

  /**
   * gl.deleteBuffer
   */
  destroy(): void;
}
