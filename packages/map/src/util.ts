// @ts-ignore
import UnitBezier from '@mapbox/unitbezier';
let reducedMotionQuery: MediaQueryList;
export interface ICancelable {
  cancel: () => void;
}
export function wrap(n: number, min: number, max: number): number {
  const d = max - min;
  const w = ((((n - min) % d) + d) % d) + min;
  return w === min ? max : w;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function interpolate(a: number, b: number, t: number) {
  return a * (1 - t) + b * t;
}
export function bezier(
  p1x: number,
  p1y: number,
  p2x: number,
  p2y: number,
): (t: number) => number {
  const bez = new UnitBezier(p1x, p1y, p2x, p2y);
  return (t: number) => {
    return bez.solve(t);
  };
}

export const ease = bezier(0.25, 0.1, 0.25, 1);

export function prefersReducedMotion(): boolean {
  if (!window.matchMedia) {
    return false;
  }
  // Lazily initialize media query
  if (reducedMotionQuery == null) {
    reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  }
  return reducedMotionQuery.matches;
}

export function pick(
  src: { [key: string]: any },
  properties: string[],
): { [key: string]: any } {
  const result: { [key: string]: any } = {};
  for (const name of properties) {
    if (name in src) {
      result[name] = src[name];
    }
  }
  return result;
}

// export const now = // l7 - mini
//   window.performance && window.performance.now// l7 - mini
//     ? window.performance.now.bind(window.performance)// l7 - mini
//     : Date.now.bind(Date);// l7 - mini
export const now = 1;

export const raf = 1;
// export const raf =// l7 - mini
// window.requestAnimationFrame ||// l7 - mini
// @ts-ignore
// window.mozRequestAnimationFrame ||// l7 - mini
// window.webkitRequestAnimationFrame ||// l7 - mini
// @ts-ignore
// window.msRequestAnimationFrame;// l7 - mini

export const cancel = 1;
// export const cancel =// l7 - mini
// window.cancelAnimationFrame ||// l7 - mini
// @ts-ignore
// window.mozCancelAnimationFrame ||// l7 - mini
// window.webkitCancelAnimationFrame ||// l7 - mini
// @ts-ignore
// window.msCancelAnimationFrame;// l7 - mini

export function renderframe(
  fn: (paintStartTimestamp: number) => void,
  // @ts-ignore
): ICancelable {
  // const frame = raf(fn);// l7 - mini
  // return { cancel: () => cancel(frame) };// l7 - mini
}
