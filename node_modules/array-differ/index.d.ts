/**
 * Create an array with values that are present in the first array but not additional ones.
 *
 * @param array - The array to compare against.
 * @param values - The arrays with values to be excluded.
 * @returns A new array of filtered values.
 *
 * @example
 *
 * import arrayDiffer from 'array-differ';
 *
 * arrayDiffer([2, 3, 4], [3, 50]);
 * //=> [2, 4]
 */
export default function arrayDiffer<T>(array: ArrayLike<T>, ...values: ArrayLike<T>[]): T[];
