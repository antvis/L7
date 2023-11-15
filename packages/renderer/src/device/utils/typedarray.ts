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
