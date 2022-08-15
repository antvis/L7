import { Point } from './interface';
import { calDistance } from '../geo';

// arc
export function greatCorcleLineAtOffset(
  source: Point,
  target: Point,
  offset: number,
  mapVersion: string | undefined,
) {
  return interpolate(source, target, offset, mapVersion);
}

function midPoint(source: Point, target: Point) {
  const center = [target[0] - source[0], target[1] - source[1]]; //target - source;
  const r = calDistance(center, [0, 0]);
  const theta = Math.atan2(center[1], center[0]);
  const thetaOffset = 0.314;
  const r2 = r / 2.0 / Math.cos(thetaOffset);
  const theta2 = theta + thetaOffset;
  const mid = [
    r2 * Math.cos(theta2) + source[0],
    r2 * Math.sin(theta2) + source[1],
  ];
  return mid;
}

function bezier3(arr: Point, t: number) {
  const ut = 1 - t;
  return (arr[0] * ut + arr[1] * t) * ut + (arr[1] * ut + arr[2] * t) * t;
}

function getAngularDist(source: Point, target: Point) {
  const delta = [source[0] - target[0], source[1] - target[1]];
  const sin_half_delta = [Math.sin(delta[0] / 2.0), Math.sin(delta[1] / 2.0)]; //Math.sin(delta / 2.0);
  const a =
    sin_half_delta[1] * sin_half_delta[1] +
    Math.cos(source[1]) *
      Math.cos(target[1]) *
      sin_half_delta[0] *
      sin_half_delta[0];
  return 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));
}

export function interpolate(
  source: Point,
  target: Point,
  offset: number,
  mapVersion: string | undefined,
) {
  if (mapVersion === 'GAODE2.x') {
    // gaode2.x
    const mid = midPoint(source, target);
    const x = [source[0], mid[0], target[0]];
    const y = [source[1], mid[1], target[1]];
    return [bezier3(x, offset), bezier3(y, offset), 0];
  } else {
    const angularDist = getAngularDist(source, target);
    if (Math.abs(angularDist - Math.PI) < 0.001) {
      return [
        (1.0 - offset) * source[0] + offset * target[0],
        (1.0 - offset) * source[1] + offset * target[1],
      ];
    }
    const a = Math.sin((1.0 - offset) * angularDist) / Math.sin(angularDist);
    const b = Math.sin(offset * angularDist) / Math.sin(angularDist);
    const sin_source = [Math.sin(source[0]), Math.sin(source[1])];
    const cos_source = [Math.cos(source[0]), Math.cos(source[1])];
    const sin_target = [Math.sin(target[0]), Math.sin(target[1])];
    const cos_target = [Math.cos(target[0]), Math.cos(target[1])];
    const x =
      a * cos_source[1] * cos_source[0] + b * cos_target[1] * cos_target[0];
    const y =
      a * cos_source[1] * sin_source[0] + b * cos_target[1] * sin_target[0];
    const z = a * sin_source[1] + b * sin_target[1];
    return [Math.atan2(y, x), Math.atan2(z, Math.sqrt(x * x + y * y))];
  }
}
