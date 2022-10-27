import { degreesToRadians, radiansToDegrees } from '@turf/helpers';
import { calDistance } from '../geo';
import { Version } from '../interface/map';
import { Point } from './interface';
// arc
export function greatCircleLineAtOffset(
  source: Point,
  target: Point,
  offset: number,
  thetaOffset: number | undefined,
  mapVersion: Version | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  segmentNumber: number = 30,
  autoFit: boolean,
) {
  let pointOffset = offset;
  if (autoFit) {
    // Tip: 自动偏移到线的节点位置
    // greatcircle 暂时不支持配置 segmentNumber 和 thetaOffset
    pointOffset = Math.round(offset * 29) / 29;
  }
  return interpolate(source, target, pointOffset, mapVersion);
}

function midPoint(source: Point, target: Point) {
  const center = [target[0] - source[0], target[1] - source[1]]; // target - source;
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
  const sinHalfDelta = [Math.sin(delta[0] / 2.0), Math.sin(delta[1] / 2.0)]; // Math.sin(delta / 2.0);
  const a =
    sinHalfDelta[1] * sinHalfDelta[1] +
    Math.cos(source[1]) *
      Math.cos(target[1]) *
      sinHalfDelta[0] *
      sinHalfDelta[0];
  return 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));
}

export function interpolate(
  s: Point,
  t: Point,
  offset: number,
  mapVersion: string | undefined,
) {
  const source = [degreesToRadians(s[0]), degreesToRadians(s[1])];
  const target = [degreesToRadians(t[0]), degreesToRadians(t[1])];
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
    const sinSource = [Math.sin(source[0]), Math.sin(source[1])];
    const cosSource = [Math.cos(source[0]), Math.cos(source[1])];
    const sinTarget = [Math.sin(target[0]), Math.sin(target[1])];
    const cosTarget = [Math.cos(target[0]), Math.cos(target[1])];
    const x = a * cosSource[1] * cosSource[0] + b * cosTarget[1] * cosTarget[0];
    const y = a * cosSource[1] * sinSource[0] + b * cosTarget[1] * sinTarget[0];
    const z = a * sinSource[1] + b * sinTarget[1];
    return [
      radiansToDegrees(Math.atan2(y, x)),
      radiansToDegrees(Math.atan2(z, Math.sqrt(x * x + y * y))),
    ];
  }
}
