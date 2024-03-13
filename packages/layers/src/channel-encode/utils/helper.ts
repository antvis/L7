export function defined(x: any) {
  return x !== undefined && x !== null && !Number.isNaN(x);
}

/**
 * 推断不是 null or undefined
 */
export const notNullorUndefined = <T extends NonNullable<any>>(d: T | null | undefined): d is T => {
  return d !== undefined && d !== null;
};
