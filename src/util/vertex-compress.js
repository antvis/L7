import clamp from '@antv/util/lib/clamp';

/**
 * encode 2 8-bit unsigned int into a 16-bit float
 * @param {number} a 8-bit int
 * @param {number} b 8-bit int
 * @return {number} float
 */
export function packUint8ToFloat(a, b) {
  a = clamp(Math.floor(a), 0, 255);
  b = clamp(Math.floor(b), 0, 255);
  return 256 * a + b;
}
