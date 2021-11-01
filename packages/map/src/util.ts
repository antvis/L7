import { $window, isMini } from '@antv/l7-utils';
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
  // @ts-ignore
  if (isMini || !$window.matchMedia) {
    return false;
  }
  // Lazily initialize media query
  if (reducedMotionQuery == null) {
    // @ts-ignore
    reducedMotionQuery = $window.matchMedia('(prefers-reduced-motion: reduce)');
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

export const now = isMini
  ? Date.now.bind(Date)
  : $window.performance && $window.performance.now
  ? $window.performance.now.bind($window.performance)
  : Date.now.bind(Date);

export const raf =
  $window.requestAnimationFrame ||
  // @ts-ignore
  $window.mozRequestAnimationFrame ||
  // @ts-ignore
  $window.webkitRequestAnimationFrame ||
  // @ts-ignore
  $window.msRequestAnimationFrame;

export const cancel =
  $window.cancelAnimationFrame ||
  // @ts-ignore
  $window.mozCancelAnimationFrame ||
  // @ts-ignore
  $window.webkitCancelAnimationFrame ||
  // @ts-ignore
  $window.msCancelAnimationFrame;

export function renderframe(
  fn: (paintStartTimestamp: number) => void,
): ICancelable {
  const frame = raf(fn);
  return { cancel: () => cancel(frame) };
}
