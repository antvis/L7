/**
 * Calls a defined callback function on each key:value of a object,
 * and returns a object contains the result.
 */
export function mapObject<T, U>(
  object: Record<string, T>,
  callbackfn: (value: T, key?: string, object?: Record<string, T>) => U,
): Record<string, U> {
  return Object.entries(object).reduce((obj, [key, value]) => {
    obj[key] = callbackfn(value, key, object);
    return obj;
  }, {} as Record<string, U>);
}
