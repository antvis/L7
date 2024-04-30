export function isNumber(n: any) {
  return typeof n === 'number';
}

/**
 * Calculate the low part of a WebGL 64 bit float
 * @param x {number} - the input float number
 * @returns {number} - the lower 32 bit of the number
 */
export function fp64LowPart(x: number): number {
  return x - Math.fround(x);
}
