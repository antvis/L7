/**
 * WebGL 中的顶点数据压缩
 * 使用 float-pack 技术，在 shader 中解压
 * @see https://zhuanlan.zhihu.com/p/67484498
 */

import { clamp } from 'lodash';
import { getShapeIndex } from './sdf-2d';

export interface ICircleVertex {
  tileX: number;
  tileY: number;
  shape: string;
  color: number[];
  radius: number;
  opacity: number;
  stroke: number[];
  strokeWidth: number;
  strokeOpacity: number;
}

export const LEFT_SHIFT1 = 2;
export const LEFT_SHIFT2 = 4;
export const LEFT_SHIFT6 = 64;
export const LEFT_SHIFT7 = 128;
export const LEFT_SHIFT8 = 256;
export const LEFT_SHIFT9 = 512;
export const LEFT_SHIFT13 = 8192;
export const LEFT_SHIFT14 = 16384;
export const LEFT_SHIFT15 = 32768;
export const LEFT_SHIFT16 = 32768 * 2;
export const LEFT_SHIFT17 = 131072.0;
export const LEFT_SHIFT18 = 262144.0;
export const LEFT_SHIFT19 = 524288.0;
export const LEFT_SHIFT20 = 1048576.0;
export const LEFT_SHIFT21 = 2097152.0;
export const LEFT_SHIFT22 = 4194304.0;
export const LEFT_SHIFT23 = 8388608.0;
export const LEFT_SHIFT24 = 16777216.0;
export const LEFT_SHIFT25 = 16777216.0 * 2;

/**
 * encode 2 8-bit unsigned int into a 16-bit float
 * @param {number} a 8-bit int
 * @param {number} b 8-bit int
 * @return {number} float
 */
export function packUint8ToFloat(a: number, b: number): number {
  a = clamp(Math.floor(a), 0, 255);
  b = clamp(Math.floor(b), 0, 255);
  return 256 * a + b;
}

/**
 * 为 SDF circle 压缩顶点数据
 */
export function packCircleVertex(props: ICircleVertex): {
  packedBuffer: number[][];
  packedBuffer2: number[][];
  packedBuffer3: number[][];
} {
  const {
    color,
    radius,
    tileX,
    tileY,
    shape,
    opacity, // packed buffer1
    stroke,
    strokeWidth,
    strokeOpacity, // packed buffer2
  } = props;
  const packedBuffer: number[][] = [];
  const packedBuffer2: number[][] = [];
  const packedBuffer3: number[][] = [];

  const packedColor: [number, number] = [
    packUint8ToFloat(color[0], color[1]),
    packUint8ToFloat(color[2], color[3]),
  ];
  const packedStrokeColor: [number, number] = [
    packUint8ToFloat(stroke[0], stroke[1]),
    packUint8ToFloat(stroke[2], stroke[3]),
  ];

  [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ].forEach(([extrudeX, extrudeY]) => {
    // vec4(
    //   color,
    //   color,
    //   (4-bit extrude, 4-bit shape, 16-bit radius),
    //   tileCoords
    // )
    packedBuffer.push([
      ...packedColor,
      (extrudeX + 1) * LEFT_SHIFT23 +
        (extrudeY + 1) * LEFT_SHIFT21 +
        getShapeIndex(shape) * LEFT_SHIFT17 +
        radius,
      (tileX + 512) * LEFT_SHIFT19 + (tileY + 512) * LEFT_SHIFT6,
    ]);

    // vec4(
    //   strokeColor,
    //   strokeColor,
    //   strokeWidth,
    //   strokeOpacity
    // )
    packedBuffer2.push([...packedStrokeColor, strokeWidth, strokeOpacity]);

    packedBuffer3.push([opacity, 0, 0, 0]);
  });

  return {
    packedBuffer,
    packedBuffer2,
    packedBuffer3,
  };
}

export function packOpacity(opacity: number, placed: boolean): number {
  if (opacity === 0 && !placed) {
    return 0;
  } else if (opacity === 1 && placed) {
    return 4294967295;
  }
  const targetBit = placed ? 1 : 0;
  const opacityBits = Math.floor(opacity * 127);
  return (
    opacityBits * LEFT_SHIFT25 +
    targetBit * LEFT_SHIFT24 +
    opacityBits * LEFT_SHIFT17 +
    targetBit * LEFT_SHIFT16 +
    opacityBits * LEFT_SHIFT9 +
    targetBit * LEFT_SHIFT8 +
    opacityBits * LEFT_SHIFT1 +
    targetBit
  );
}
