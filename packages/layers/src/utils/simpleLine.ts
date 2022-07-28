import { aProjectFlat } from '@antv/l7-utils';
import { vec2, vec3 } from 'gl-matrix';

const lineA = vec2.create();

export function direction(out: vec2, a: vec2, b: vec2) {
  vec2.sub(out, a, b);
  vec2.normalize(out, out);
  return out;
}

export default class ExtrudePolyline {
  public complex: {
    positions: number[];
    indices: number[];
    startIndex: number;
    indexes: number[];
  };

  private started: boolean = false;

  private totalDistance: number = 0;
  private currentIndex: number = 0;

  constructor() {
    this.complex = {
      positions: [],
      indices: [],
      startIndex: 0,
      indexes: [],
    };
  }

  public simpleExtrude(points: number[][]) {
    const complex = this.complex;
    if (points.length <= 1) {
      return complex;
    }

    this.started = false;

    this.totalDistance = 0;

    const total = points.length;
    let count = complex.startIndex;
    for (let i = 1; i < total; i++) {
      const last = points[i - 1] as vec3;
      const cur = points[i] as vec3;
      const amt = this.simpleSegment(complex, count, last, cur);
      count += amt;
    }

    for (let i = 0; i < complex.positions.length / 6; i++) {
      complex.positions[i * 6 + 5] = this.totalDistance;
    }
    return complex;
  }
  private simpleSegment(complex: any, index: number, last: vec3, cur: vec3) {
    let count = 0;
    const indices = complex.indices;
    const positions = complex.positions;
    const flatCur = aProjectFlat([cur[0], cur[1]]) as [number, number];
    const flatLast = aProjectFlat([last[0], last[1]]) as [number, number];

    direction(lineA, flatCur, flatLast);

    const segmentDistance = this.lineSegmentDistance(flatCur, flatLast);
    this.totalDistance += segmentDistance;

    if (!this.started) {
      this.started = true;
      this.extrusions(positions, last, this.totalDistance - segmentDistance);
    }

    this.extrusions(positions, cur, this.totalDistance);
    indices.push(index + 0, index + 1, index + 2);
    indices.push(index + 2, index + 1, index + 3);
    count += 2;

    return count;
  }
  private extrusions(
    positions: number[],
    point: vec3, // 顶点
    distanceRadio: number,
  ) {
    positions.push(
      point[0],
      point[1],
      point[2] | 0,
      distanceRadio,
      0,
      point[2] | 0,
    );
    this.complex.indexes.push(this.currentIndex);
    positions.push(
      point[0],
      point[1],
      point[2] | 0,
      distanceRadio,
      0,
      point[2] | 0,
    );
    this.complex.indexes.push(this.currentIndex);
    this.currentIndex++;
  }
  private lineSegmentDistance(b1: [number, number], a1: [number, number]) {
    const dx = a1[0] - b1[0];
    const dy = a1[1] - b1[1];
    return Math.sqrt(dx * dx + dy * dy);
  }
}
