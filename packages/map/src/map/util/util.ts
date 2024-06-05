import UnitBezier from '@mapbox/unitbezier';

export const interpolates = {
  number: function number(from: number, to: number, t: number) {
    return from + t * (to - from);
  },
};

/**
 * constrain n to the given range via min + max
 *
 * @param n - value
 * @param min - the minimum value to be returned
 * @param max - the maximum value to be returned
 * @returns the clamped value
 */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/**
 * constrain n to the given range, excluding the minimum, via modular arithmetic
 *
 * @param n - value
 * @param min - the minimum value to be returned, exclusive
 * @param max - the maximum value to be returned, inclusive
 * @returns constrained number
 */
export function wrap(n: number, min: number, max: number): number {
  const d = max - min;
  const w = ((((n - min) % d) + d) % d) + min;
  return w === min ? max : w;
}

let id = 1;

/**
 * Return a unique numeric id, starting at 1 and incrementing with
 * each call.
 *
 * @returns unique numeric id.
 */
export function uniqueId(): number {
  return id++;
}

/**
 * Given a destination object and optionally many source objects,
 * copy all properties from the source objects into the destination.
 * The last source object given overrides properties from previous
 * source objects.
 *
 * @param dest - destination object
 * @param sources - sources from which properties are pulled
 */
export function extend<T extends {}, U>(dest: T, source: U): T & U;
export function extend<T extends {}, U, V>(dest: T, source1: U, source2: V): T & U & V;
export function extend<T extends {}, U, V, W>(
  dest: T,
  source1: U,
  source2: V,
  source3: W,
): T & U & V & W;
export function extend(dest: Record<string, any>, ...sources: Array<any>): any;
export function extend(dest: Record<string, any>, ...sources: Array<any>): any {
  for (const src of sources) {
    for (const k in src) {
      dest[k] = src[k];
    }
  }
  return dest;
}

// See https://stackoverflow.com/questions/49401866/all-possible-keys-of-an-union-type
type KeysOfUnion<T> = T extends T ? keyof T : never;

/**
 * Given an object and a number of properties as strings, return version
 * of that object with only those properties.
 *
 * @param src - the object
 * @param properties - an array of property names chosen
 * to appear on the resulting object.
 * @returns object with limited properties.
 * @example
 * ```ts
 * let foo = { name: 'Charlie', age: 10 };
 * let justName = pick(foo, ['name']); // justName = { name: 'Charlie' }
 * ```
 */
export function pick<T extends object>(src: T, properties: Array<KeysOfUnion<T>>): Partial<T> {
  const result: Partial<T> = {};
  for (let i = 0; i < properties.length; i++) {
    const k = properties[i];
    if (k in src) {
      result[k] = src[k];
    }
  }
  return result;
}

/**
 * Makes optional keys required and add the the undefined type.
 *
 * ```
 * interface Test {
 *  foo: number;
 *  bar?: number;
 *  baz: number | undefined;
 * }
 *
 * Complete<Test> {
 *  foo: number;
 *  bar: number | undefined;
 *  baz: number | undefined;
 * }
 *
 * ```
 *
 * See https://medium.com/terria/typescript-transforming-optional-properties-to-required-properties-that-may-be-undefined-7482cb4e1585
 */

export type Complete<T> = {
  [P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>> ? T[P] : T[P] | undefined;
};

/**
 * Given given (x, y), (x1, y1) control points for a bezier curve,
 * return a function that interpolates along that curve.
 *
 * @param p1x - control point 1 x coordinate
 * @param p1y - control point 1 y coordinate
 * @param p2x - control point 2 x coordinate
 * @param p2y - control point 2 y coordinate
 */
export function bezier(p1x: number, p1y: number, p2x: number, p2y: number): (t: number) => number {
  const bezier = new UnitBezier(p1x, p1y, p2x, p2y);
  return (t: number) => {
    return bezier.solve(t);
  };
}

/**
 * A default bezier-curve powered easing function with
 * control points (0.25, 0.1) and (0.25, 1)
 */
export const defaultEasing = bezier(0.25, 0.1, 0.25, 1);

/**
 * Print a warning message to the console and ensure duplicate warning messages
 * are not printed.
 */
const warnOnceHistory: { [key: string]: boolean } = {};

export function warnOnce(message: string): void {
  if (!warnOnceHistory[message]) {
    // console isn't defined in some WebWorkers, see #2558
    if (typeof console !== 'undefined') console.warn(message);
    warnOnceHistory[message] = true;
  }
}

/**
 * This method converts degrees to radians.
 * The return value is the radian value.
 * @param degrees - The number of degrees
 * @returns radians
 */
export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
