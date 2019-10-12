import { ILayerStyleOptions } from '@l7/core';
import { lngLatToMeters } from '@l7/utils';
import { vec3 } from 'gl-matrix';
interface IBufferCfg {
  data: unknown[];
  imagePos?: unknown;
  style?: ILayerStyleOptions;
}
export type Position = number[];
type Color = [number, number, number, number];
export interface IBufferInfo {
  vertices?: any;
  indexArray?: any;
  indexOffset: any;
  verticesOffset: number;
  faceNum?: any;
  dimensions: number;
  [key: string]: any;
}
export interface IEncodeFeature {
  color?: Color;
  size?: number | number[];
  shape?: string | number;
  pattern?: string;
  id?: number;
  coordinates: unknown;
  bufferInfo: unknown;
}
export default class Buffer {
  public attributes: {
    [key: string]: Float32Array;
  } = {};
  public verticesCount: number = 0;
  public indexArray: Uint32Array = new Uint32Array(0);
  public indexCount: number = 0;

  protected data: unknown[];
  protected imagePos: unknown;
  protected style: any;

  constructor({ data, imagePos, style }: IBufferCfg) {
    this.data = data;
    this.imagePos = imagePos;
    this.style = style;
    this.init();
  }
  public computeVertexNormals(
    field: string = 'positions',
    flag: boolean = true,
  ) {
    const normals = (this.attributes.normals = new Float32Array(
      this.verticesCount * 3,
    ));
    const indexArray = this.indexArray;
    const positions = this.attributes[field];
    let vA;
    let vB;
    let vC;
    const cb = vec3.create();
    const ab = vec3.create();
    const normal = vec3.create();
    for (let i = 0, li = indexArray.length; i < li; i += 3) {
      vA = indexArray[i + 0] * 3;
      vB = indexArray[i + 1] * 3;
      vC = indexArray[i + 2] * 3;
      const [ax, ay] = flag
        ? lngLatToMeters([positions[vA], positions[vA + 1]])
        : [positions[vA], positions[vA + 1]];
      const pA = vec3.fromValues(ax, ay, positions[vA + 2]);
      const [bx, by] = flag
        ? lngLatToMeters([positions[vB], positions[vB + 1]])
        : [positions[vB], positions[vB + 1]];
      const pB = vec3.fromValues(bx, by, positions[vB + 2]);
      const [cx, cy] = flag
        ? lngLatToMeters([positions[vC], positions[vC + 1]])
        : [positions[vC], positions[vC + 1]];
      const pC = vec3.fromValues(cx, cy, positions[vC + 2]);
      vec3.sub(cb, pC, pB);
      vec3.sub(ab, pA, pB);
      vec3.cross(normal, cb, ab);
      normals[vA] += cb[0];
      normals[vA + 1] += cb[1];
      normals[vA + 2] += cb[2];
      normals[vB] += cb[0];
      normals[vB + 1] += cb[1];
      normals[vB + 2] += cb[2];
      normals[vC] += cb[0];
      normals[vC + 1] += cb[1];
      normals[vC + 2] += cb[2];
    }
    this.normalizeNormals();
  }

  // 计算每个要素顶点个数，记录索引位置
  protected calculateFeatures() {
    throw new Error('Method not implemented.');
  }
  protected buildFeatures() {
    throw new Error('Method not implemented.');
  }

  protected checkIsClosed(points: Position[][]) {
    const p1 = points[0][0];
    const p2 = points[0][points[0].length - 1];
    return p1[0] === p2[0] && p1[1] === p2[1];
  }

  protected concat(arrayType: Float32Array, arrays: any) {
    let totalLength = 0;
    for (const arr of arrays) {
      totalLength += arr.length;
    }
    const arrayBuffer = new ArrayBuffer(
      totalLength * arrayType.BYTES_PER_ELEMENT,
    );
    let offset = 0;
    // @ts-ignore
    const result = new arrayType(arrayBuffer);
    for (const arr of arrays) {
      result.set(arr, offset);
      offset += arr.length;
    }
    return result;
  }
  protected encodeArray(feature: IEncodeFeature, num: number) {
    const { color, id, pattern, size } = feature;
    const bufferInfo = feature.bufferInfo as IBufferInfo;
    const { verticesOffset } = bufferInfo;
    const imagePos = this.imagePos;
    const start1 = verticesOffset;
    for (let i = 0; i < num; i++) {
      if (color) {
        this.attributes.colors[start1 * 4 + i * 4] = color[0];
        this.attributes.colors[start1 * 4 + i * 4 + 1] = color[1];
        this.attributes.colors[start1 * 4 + i * 4 + 2] = color[2];
        this.attributes.colors[start1 * 4 + i * 4 + 3] = color[3];
      }
      if (id) {
        this.attributes.pickingIds[start1 + i] = id;
      }
      if (size) {
        let size2: number[] = [];
        if (Array.isArray(size) && size.length === 2) {
          // TODO 多维size支持
          size2 = [size[0], size[0], size[1]];
        }
        if (!Array.isArray(size)) {
          size2 = [size];
        }
        this.attributes.sizes.set(size2, (start1 + i) * size2.length);
      }
      if (pattern) {
        // @ts-ignore
        const patternPos = imagePos[pattern] || { x: 0, y: 0 };
        this.attributes.patterns[start1 * 2 + i * 2] = patternPos.x;
        this.attributes.patterns[start1 * 2 + i * 2 + 1] = patternPos.y;
      }
    }
  }
  protected initAttributes() {
    this.attributes.positions = new Float32Array(this.verticesCount * 3);
    this.attributes.colors = new Float32Array(this.verticesCount * 4);
    this.attributes.pickingIds = new Float32Array(this.verticesCount);
    this.attributes.sizes = new Float32Array(this.verticesCount);
    this.attributes.pickingIds = new Float32Array(this.verticesCount);
    this.indexArray = new Uint32Array(this.indexCount);
  }

  private init() {
    //  1. 计算 attribute 长度
    this.calculateFeatures();
    //  2. 初始化 attribute
    this.initAttributes();
    //  3. 拼接attribute
    this.buildFeatures();
  }

  private normalizeNormals() {
    const { normals } = this.attributes;
    for (let i = 0, li = normals.length; i < li; i += 3) {
      const normal = vec3.fromValues(
        normals[i],
        normals[i + 1],
        normals[i + 2],
      );
      const newNormal = vec3.create();
      vec3.normalize(newNormal, normal);
      normals.set(newNormal, i);
    }
  }
}
