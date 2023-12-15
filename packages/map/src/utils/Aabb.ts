import { vec3, vec4 } from 'gl-matrix';
import type Frustum from './primitives';
export default class Aabb {
  public min: vec3;
  public max: vec3;
  public center: vec3;

  constructor(min: vec3, max: vec3) {
    this.min = min;
    this.max = max;
    this.center = vec3.scale(
      new Float32Array(3),
      vec3.add(new Float32Array(3), this.min, this.max),
      0.5,
    );
  }

  public quadrant(index: number): Aabb {
    const split = [index % 2 === 0, index < 2];
    const qMin = vec3.clone(this.min);
    const qMax = vec3.clone(this.max);
    for (let axis = 0; axis < split.length; axis++) {
      qMin[axis] = split[axis] ? this.min[axis] : this.center[axis];
      qMax[axis] = split[axis] ? this.center[axis] : this.max[axis];
    }
    // Elevation is always constant, hence quadrant.max.z = this.max.z
    qMax[2] = this.max[2];
    return new Aabb(qMin, qMax);
  }

  public distanceX(point: number[]): number {
    const pointOnAabb = Math.max(Math.min(this.max[0], point[0]), this.min[0]);
    return pointOnAabb - point[0];
  }

  public distanceY(point: number[]): number {
    const pointOnAabb = Math.max(Math.min(this.max[1], point[1]), this.min[1]);
    return pointOnAabb - point[1];
  }

  // Performs a frustum-aabb intersection test. Returns 0 if there's no intersection,
  // 1 if shapes are intersecting and 2 if the aabb if fully inside the frustum.
  public intersects(frustum: Frustum): number {
    // Execute separating axis test between two convex objects to find intersections
    // Each frustum plane together with 3 major axes define the separating axes
    // Note: test only 4 points as both min and max points have equal elevation

    const aabbPoints = [
      [this.min[0], this.min[1], 0.0, 1],
      [this.max[0], this.min[1], 0.0, 1],
      [this.max[0], this.max[1], 0.0, 1],
      [this.min[0], this.max[1], 0.0, 1],
    ];

    let fullyInside = true;

    for (const plane of frustum.planes) {
      let pointsInside = 0;

      for (const i of aabbPoints) {
        // @ts-ignore
        pointsInside += vec4.dot(plane, i) >= 0;
      }

      if (pointsInside === 0) {
        return 0;
      }

      if (pointsInside !== aabbPoints.length) {
        fullyInside = false;
      }
    }

    if (fullyInside) {
      return 2;
    }

    for (let axis = 0; axis < 3; axis++) {
      let projMin = Number.MAX_VALUE;
      let projMax = -Number.MAX_VALUE;

      for (const p of frustum.points) {
        const projectedPoint = p[axis] - this.min[axis];

        projMin = Math.min(projMin, projectedPoint);
        projMax = Math.max(projMax, projectedPoint);
      }

      if (projMax < 0 || projMin > this.max[axis] - this.min[axis]) {
        return 0;
      }
    }

    return 1;
  }
}
