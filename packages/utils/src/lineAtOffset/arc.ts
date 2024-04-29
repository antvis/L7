import type { Point } from './interface';
// arc
export function arcLineAtOffset(
  source: Point,
  target: Point,
  offset: number,
  thetaOffset: number | undefined,
  segmentNumber: number = 30,
  autoFit: boolean,
) {
  let pointOffset = offset;

  if (autoFit) {
    // Tip: 自动偏移到线的节点位置
    pointOffset = Math.round(offset * (segmentNumber - 1)) / (segmentNumber - 1);
  }

  if (!thetaOffset) {
    return interpolate(source, target, pointOffset, 0.314);
  } else {
    return interpolate(source, target, pointOffset, thetaOffset);
  }
}

function bezier3(arr: Point, t: number) {
  const ut = 1 - t;
  return (arr[0] * ut + arr[1] * t) * ut + (arr[1] * ut + arr[2] * t) * t;
}

function calDistance(p1: Point, p2: Point) {
  return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}

function midPoint(source: Point, target: Point, thetaOffset: number) {
  const center = [target[0] - source[0], target[1] - source[1]]; // target - source;
  const r = calDistance(center, [0, 0]);
  const theta = Math.atan2(center[1], center[0]);
  const r2 = r / 2.0 / Math.cos(thetaOffset);
  const theta2 = theta + thetaOffset;
  const mid = [r2 * Math.cos(theta2) + source[0], r2 * Math.sin(theta2) + source[1]];
  return mid;
}

function interpolate(source: Point, target: Point, offset: number, thetaOffset: number) {
  // amap
  const mid = midPoint(source, target, thetaOffset);
  const x = [source[0], mid[0], target[0]];
  const y = [source[1], mid[1], target[1]];
  return [bezier3(x, offset), bezier3(y, offset), 0];
}
