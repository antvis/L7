import { vec3, vec4 } from 'gl-matrix';

export function getAngle(angle: number | undefined) {
  if (angle === undefined) {
    return 0;
  } else if (angle > 360 || angle < -360) {
    return angle % 360;
  }
  return angle;
}

export function createVec3(x: number | vec3 | vec4, y?: number, z?: number) {
  // @ts-ignore
  if (x instanceof vec3) {
    return vec3.clone(x as vec3);
    // @ts-ignore
  } else if (x instanceof vec4) {
    x = x as vec4;
    return vec3.fromValues(x[0], x[1], x[2]);
  } else {
    return vec3.fromValues(x as number, y as number, z as number);
  }
}
