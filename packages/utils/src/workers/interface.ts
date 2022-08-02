type Color = [number, number, number, number];
export type Position = number[];

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

export interface IAttributeInitializationOptions {
  buffer: IBuffer;

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

export interface IBufferInitializationOptions {
  data:
    | number[]
    | number[][]
    | Uint8Array
    | Uint16Array
    | Uint32Array
    | Float32Array;

  /**
   * gl.DRAW_STATIC | gl.DYNAMIC_DRAW | gl.STREAM_DRAW
   */
  usage?: 35044 | 35048 | 35040;

  /**
   * gl.Float | gl.UNSIGNED_BYTE | ...
   */
  type?: 5126 | 5121;
  length?: number;
}

export interface IVertexAttributeDescriptor
  extends Omit<IAttributeInitializationOptions, 'buffer'> {
  /**
   * attribute name in vertex shader
   */
  name: string;
  /**
   * 创建 buffer 的参数
   */
  buffer: IBufferInitializationOptions;
  update?: (
    feature: IEncodeFeature,
    featureIdx: number,
    vertex: number[],
    attributeIdx: number,
    normal: number[],
    vertexIndex?: number,
  ) => number[];
}

export interface IEncodeFeature {
  color?: Color;
  size?: number | number[];
  shape?: string | number;
  pattern?: string;
  id?: number;
  coordinates: Position | Position[] | Position[][];
  [key: string]: any;
}
