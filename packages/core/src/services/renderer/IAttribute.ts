import type { IBuffer } from './IBuffer';

export interface IAttributeInitializationOptions {
  buffer: IBuffer;

  /**
   * layout(location = x)
   */
  shaderLocation?: number;

  /**
   * vertexAttribPointer 单位为 byte，默认值均为 0
   */
  offset?: number;
  stride?: number;

  /**
   * 每个顶点数据块大小，取值范围为 [1..4]
   */
  size?: number;

  /**
   * 是否需要归一化 [-1,1] 或者 [0,1]，默认值 false
   */
  normalized?: boolean;

  /**
   * gl.vertexAttribDivisorANGLE，自动开启 ANGLE_instanced_arrays 扩展
   */
  divisor?: number;
}

export interface IAttribute {
  updateBuffer(options: {
    // 用于替换的数据
    data: number[] | number[][] | Uint8Array | Uint16Array | Uint32Array;
    // 原 Buffer 替换位置，单位为 byte
    offset: number;
  }): void;
  destroy(): void;
}
