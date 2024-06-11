const dtypes = {
  '[object Int8Array]': 5120,
  '[object Int16Array]': 5122,
  '[object Int32Array]': 5124,
  '[object Uint8Array]': 5121,
  '[object Uint8ClampedArray]': 5121,
  '[object Uint16Array]': 5123,
  '[object Uint32Array]': 5125,
  '[object Float32Array]': 5126,
  '[object Float64Array]': 5121,
  '[object ArrayBuffer]': 5121,
};

export type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array;

// eslint-disable-next-line
export function isTypedArray(x: any): x is TypedArray {
  return Object.prototype.toString.call(x) in dtypes;
}

/**
 * WebGPU does not support RGB texture, so we need to convert RGB to RGBA
 * @see https://github.com/antvis/L7/pull/2262
 */
export function extend3ChannelsTo4(array: Float32Array, valueToInsert: number) {
  const originalLength = array.length;
  const insertCount = Math.ceil(originalLength / 3);
  const newLength = originalLength + insertCount;

  const newArray = new Float32Array(newLength);
  for (let i = 0; i < newLength; i += 4) {
    newArray[i] = array[(i / 4) * 3];
    newArray[i + 1] = array[(i / 4) * 3 + 1];
    newArray[i + 2] = array[(i / 4) * 3 + 2];
    newArray[i + 3] = valueToInsert;
  }

  return newArray;
}
