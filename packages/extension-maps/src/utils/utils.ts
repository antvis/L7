export type IPadding =
  | number
  | [number, number, number, number]
  | {
      top?: number;
      bottom?: number;
      right?: number;
      left?: number;
    };

export function toPaddingOptions(padding: IPadding = {}) {
  const defaultPadding = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };
  if (typeof padding === 'number') {
    return {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding,
    };
  }
  if (Array.isArray(padding)) {
    if (padding.length === 4) {
      return {
        top: padding[0],
        right: padding[1],
        bottom: padding[2],
        left: padding[3],
      };
    }
    if (padding.length === 2) {
      return {
        top: padding[0],
        right: padding[1],
        bottom: padding[0],
        left: padding[1],
      };
    }
  }

  return { ...defaultPadding, ...padding };
}
