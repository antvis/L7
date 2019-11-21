import { mat3, mat4, vec3, vec4 } from 'gl-matrix';

export function getAngle(angle: number | undefined) {
  if (angle === undefined) {
    return 0;
  } else if (angle > 360 || angle < -360) {
    return angle % 360;
  }
  return angle;
}

export function createVec3(x: number | vec3 | vec4, y?: number, z?: number) {
  return x instanceof vec3
    ? vec3.clone(x)
    : x instanceof vec4
    ? vec3.fromValues(x[0], x[1], x[2])
    : vec3.fromValues(x, y as number, z as number);
}
