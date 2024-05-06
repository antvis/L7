import { aProjectFlat } from '@antv/l7-utils';
import type { vec3 } from 'gl-matrix';
import { vec2 } from 'gl-matrix';
const tmp = vec2.create();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const capEnd = vec2.create();
const lineA = vec2.create();
const lineB = vec2.create();
const tangent = vec2.create();

export function computeMiter(
  lineTangent: vec2,
  miter: vec2,
  start: vec2,
  end: vec2,
  halfThick: number,
): [number, vec2] {
  vec2.add(lineTangent, start, end);
  vec2.normalize(lineTangent, lineTangent);
  miter = vec2.fromValues(-lineTangent[1], lineTangent[0]);
  const tmpvec = vec2.fromValues(-start[1], start[0]);
  return [halfThick / vec2.dot(miter, tmpvec), miter];
}

export function computeNormal(out: vec2, dir: vec2) {
  return vec2.set(out, -dir[1], dir[0]);
}

export function direction(out: vec2, a: vec2, b: vec2) {
  vec2.sub(out, a, b);
  vec2.normalize(out, out);
  return out;
}

function isPointEqual(a: vec2, b: vec2) {
  return a[0] === b[0] && a[1] === b[1];
}

export function getArrayUnique(matrix: number[][]) {
  const map = new Map();
  for (let i = 0; i < matrix.length; i++) {
    const key = matrix[0].toString() + '-' + matrix[1].toString();
    if (map.get(key)) {
      matrix.splice(i, 1);
      i++;
    } else {
      map.set(key, key);
    }
  }
  return matrix;
}

export interface IExtrudeLineOption {
  join: string;
  cap: string;
  dash: boolean;
  closed: boolean;
  indexOffset: number;
  miterLimit: number;
  thickness: number;
}
export default class ExtrudePolyline {
  public complex: {
    positions: number[];
    indices: number[];
    normals: number[];
    startIndex: number;
    indexes: number[];
  };
  private join: string;
  private cap: string;
  private miterLimit: number;
  private thickness: number;
  private normal: vec2 | null;
  private lastFlip: number = -1;
  private miter: vec2 = vec2.fromValues(0, 0);
  private started: boolean = false;
  private dash: boolean = false;
  private totalDistance: number = 0;
  private currentIndex: number = 0;

  constructor(opts: Partial<IExtrudeLineOption> = {}) {
    this.join = opts.join || 'miter';
    this.cap = opts.cap || 'butt';
    this.miterLimit = opts.miterLimit || 10;
    this.thickness = opts.thickness || 1;
    this.dash = opts.dash || false;
    this.complex = {
      positions: [],
      indices: [],
      normals: [],
      startIndex: 0,
      indexes: [],
    };
  }

  public simpleExtrude(points: number[][]) {
    const complex = this.complex;
    if (points.length <= 1) {
      return complex;
    }
    this.lastFlip = -1;
    this.started = false;
    this.normal = null;
    this.totalDistance = 0;

    const total = points.length;
    let count = complex.startIndex;
    for (let i = 1; i < total; i++) {
      const last = points[i - 1] as vec3;
      const cur = points[i] as vec3;
      const next = i < points.length - 1 ? points[i + 1] : null;
      const amt = this.simpleSegment(complex, count, last, cur, next as vec3);
      count += amt;
    }

    if (this.dash) {
      for (let i = 0; i < complex.positions.length / 6; i++) {
        complex.positions[i * 6 + 5] = this.totalDistance;
      }
    }
    complex.startIndex = complex.positions.length / 6;
    return complex;
  }

  public extrude(points: number[][]) {
    const complex = this.complex;
    if (points.length <= 1) {
      return complex;
    }
    this.lastFlip = -1;
    this.started = false;
    this.normal = null;
    this.totalDistance = 0;
    // 去除数组里重复的点
    // points = getArrayUnique(points);
    const total = points.length;
    let count = complex.startIndex;
    for (let i = 1; i < total; i++) {
      const last = points[i - 1] as vec3;
      const cur = points[i] as vec3;
      const next = i < points.length - 1 ? points[i + 1] : null;
      const amt = this.segment(complex, count, last, cur, next as vec3);
      count += amt;
    }
    if (this.dash) {
      for (let i = 0; i < complex.positions.length / 6; i++) {
        complex.positions[i * 6 + 5] = this.totalDistance;
      }
    }
    complex.startIndex = complex.positions.length / 6;
    return complex;
  }

  private simpleSegment(complex: any, index: number, last: vec3, cur: vec3, next: vec3) {
    let count = 0;
    const indices = complex.indices;
    const positions = complex.positions;
    const normals = complex.normals;
    const flatCur = aProjectFlat([cur[0], cur[1]]) as [number, number];
    const flatLast = aProjectFlat([last[0], last[1]]) as [number, number];
    // @ts-ignore
    direction(lineA, flatCur, flatLast);
    let segmentDistance = 0;
    if (this.dash) {
      // @ts-ignore
      segmentDistance = this.lineSegmentDistance(flatCur, flatLast);
      this.totalDistance += segmentDistance;
    }

    if (!this.normal) {
      this.normal = vec2.create();
      computeNormal(this.normal, lineA);
    }
    if (!this.started) {
      this.started = true;

      this.extrusions(
        positions,
        normals,
        last,
        this.normal,
        this.thickness,
        this.totalDistance - segmentDistance,
      );
    }

    indices.push(index + 0, index + 1, index + 2);

    if (!next) {
      computeNormal(this.normal, lineA);
      this.extrusions(positions, normals, cur, this.normal, this.thickness, this.totalDistance);

      indices.push(
        ...(this.lastFlip === 1
          ? [index, index + 2, index + 3]
          : [index + 2, index + 1, index + 3]),
      );
      count += 2;
    } else {
      const flatNext = aProjectFlat([next[0], next[1]]) as [number, number];
      if (isPointEqual(flatCur, flatNext)) {
        vec2.add(
          flatNext,
          flatCur,
          vec2.normalize(flatNext, vec2.subtract(flatNext, flatCur, flatLast)),
        );
      }
      direction(lineB, flatNext, flatCur);

      // stores tangent & miter

      const [miterLen, miter] = computeMiter(tangent, vec2.create(), lineA, lineB, this.thickness);
      // normal(tmp, lineA)

      // get orientation
      let flip = vec2.dot(tangent, this.normal) < 0 ? -1 : 1;
      this.extrusions(positions, normals, cur, miter, miterLen, this.totalDistance);
      indices.push(
        ...(this.lastFlip === 1
          ? [index, index + 2, index + 3]
          : [index + 2, index + 1, index + 3]),
      );

      flip = -1;

      // the miter is now the normal for our next join
      vec2.copy(this.normal, miter);
      count += 2;
      this.lastFlip = flip;
    }
    return count;
  }

  private segment(complex: any, index: number, last: vec3, cur: vec3, next: vec3) {
    let count = 0;
    const indices = complex.indices;
    const positions = complex.positions;
    const normals = complex.normals;
    const capSquare = this.cap === 'square';
    const joinBevel = this.join === 'bevel';
    const flatCur = aProjectFlat([cur[0], cur[1]]) as [number, number];
    const flatLast = aProjectFlat([last[0], last[1]]) as [number, number];
    // @ts-ignore
    direction(lineA, flatCur, flatLast);
    let segmentDistance = 0;
    if (this.dash) {
      // @ts-ignore
      segmentDistance = this.lineSegmentDistance(flatCur, flatLast);
      this.totalDistance += segmentDistance;
    }

    if (!this.normal) {
      this.normal = vec2.create();
      computeNormal(this.normal, lineA);
    }
    if (!this.started) {
      this.started = true;

      // if the end cap is type square, we can just push the verts out a bit
      if (capSquare) {
        // vec2.scaleAndAdd(capEnd, last, lineA, -this.thickness);
        const out1 = vec2.create();
        const out2 = vec2.create();
        vec2.add(out1, this.normal, lineA);
        vec2.add(out2, this.normal, lineA);
        normals.push(out2[0], out2[1], 0);
        normals.push(out1[0], out1[1], 0);
        positions.push(
          last[0],
          last[1],
          last[2] | 0,
          this.totalDistance - segmentDistance,
          -this.thickness,
          last[2] | 0,
        );
        this.complex.indexes.push(this.currentIndex);
        positions.push(
          last[0],
          last[1],
          last[2] | 0,
          this.totalDistance - segmentDistance,
          this.thickness,
          last[2] | 0,
        );
        this.complex.indexes.push(this.currentIndex);
        this.currentIndex++;
        // this.extrusions(positions, normals, last, out, this.thickness);
        // last = capEnd;
      } else {
        this.extrusions(
          positions,
          normals,
          last,
          this.normal,
          this.thickness,
          this.totalDistance - segmentDistance,
        );
      }
    }

    indices.push(index + 0, index + 1, index + 2);

    if (!next) {
      computeNormal(this.normal, lineA);
      if (capSquare) {
        // vec2.scaleAndAdd(capEnd, cur, lineA, this.thickness);
        // cur = capEnd;
        const out1 = vec2.create();
        const out2 = vec2.create();
        vec2.sub(out2, lineA, this.normal);
        vec2.add(out1, lineA, this.normal);
        // this.extrusions(positions, normals, cur, out, this.thickness);
        normals.push(out2[0], out2[1], 0);
        normals.push(out1[0], out1[1], 0);
        positions.push(cur[0], cur[1], cur[2] | 0, this.totalDistance, this.thickness, cur[2] | 0);
        this.complex.indexes.push(this.currentIndex);
        positions.push(cur[0], cur[1], cur[2] | 0, this.totalDistance, this.thickness, cur[2] | 0);
        this.complex.indexes.push(this.currentIndex);
        this.currentIndex++;
      } else {
        this.extrusions(positions, normals, cur, this.normal, this.thickness, this.totalDistance);
      }

      // this.extrusions(positions, normals, cur, this.normal, this.thickness);
      indices.push(
        ...(this.lastFlip === 1
          ? [index, index + 2, index + 3]
          : [index + 2, index + 1, index + 3]),
      );
      count += 2;
    } else {
      const flatNext = aProjectFlat([next[0], next[1]]) as [number, number];
      if (isPointEqual(flatCur, flatNext)) {
        vec2.add(
          flatNext,
          flatCur,
          vec2.normalize(flatNext, vec2.subtract(flatNext, flatCur, flatLast)),
        );
      }
      direction(lineB, flatNext, flatCur);

      // stores tangent & miter

      const [miterLen, miter] = computeMiter(tangent, vec2.create(), lineA, lineB, this.thickness);
      // normal(tmp, lineA)

      // get orientation
      let flip = vec2.dot(tangent, this.normal) < 0 ? -1 : 1;
      let bevel = joinBevel;
      if (!bevel && this.join === 'miter') {
        const limit = miterLen;
        if (limit > this.miterLimit) {
          bevel = true;
        }
      }

      if (bevel) {
        normals.push(this.normal[0], this.normal[1], 0);
        normals.push(miter[0], miter[1], 0);
        positions.push(
          cur[0],
          cur[1],
          cur[2] | 0,
          this.totalDistance,
          -this.thickness * flip,
          cur[2] | 0,
        );
        this.complex.indexes.push(this.currentIndex);
        positions.push(
          cur[0],
          cur[1],
          cur[2] | 0,
          this.totalDistance,
          this.thickness * flip,
          cur[2] | 0,
        );
        this.complex.indexes.push(this.currentIndex);
        this.currentIndex++;
        indices.push(
          ...(this.lastFlip !== -flip
            ? [index, index + 2, index + 3]
            : [index + 2, index + 1, index + 3]),
        );

        // now add the bevel triangle
        indices.push(index + 2, index + 3, index + 4);

        computeNormal(tmp, lineB);
        vec2.copy(this.normal, tmp); // store normal for next round
        normals.push(this.normal[0], this.normal[1], 0);
        positions.push(
          cur[0],
          cur[1],
          cur[2] | 0,
          this.totalDistance,
          -this.thickness * flip,
          cur[2] | 0,
        );
        this.complex.indexes.push(this.currentIndex);
        this.currentIndex++;
        count += 3;
      } else {
        this.extrusions(positions, normals, cur, miter, miterLen, this.totalDistance);
        indices.push(
          ...(this.lastFlip === 1
            ? [index, index + 2, index + 3]
            : [index + 2, index + 1, index + 3]),
        );

        flip = -1;

        // the miter is now the normal for our next join
        vec2.copy(this.normal, miter);
        count += 2;
      }
      this.lastFlip = flip;
    }
    return count;
  }

  private extrusions(
    positions: number[],
    normals: number[],
    point: vec3, // 顶点
    normal: vec2, // 法向量
    thickness: number, // 高度
    distanceRadio: number,
  ) {
    normals.push(normal[0], normal[1], 0);
    normals.push(normal[0], normal[1], 0);
    positions.push(point[0], point[1], point[2] | 0, distanceRadio, -thickness, point[2] | 0);
    this.complex.indexes.push(this.currentIndex);
    positions.push(point[0], point[1], point[2] | 0, distanceRadio, thickness, point[2] | 0);
    this.complex.indexes.push(this.currentIndex);
    this.currentIndex++;
  }

  private lineSegmentDistance(b1: vec3, a1: vec3) {
    const dx = a1[0] - b1[0];
    const dy = a1[1] - b1[1];
    return Math.sqrt(dx * dx + dy * dy);
  }
}
