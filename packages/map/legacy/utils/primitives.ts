import { vec3, vec4 } from 'gl-matrix';
export default class Frustum {
  public static fromInvProjectionMatrix(
    invProj: Float32Array,
    worldSize: number,
    zoom: number,
  ): Frustum {
    const clipSpaceCorners: Array<[number, number, number, number]> = [
      [-1, 1, -1, 1],
      [1, 1, -1, 1],
      [1, -1, -1, 1],
      [-1, -1, -1, 1],
      [-1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, -1, 1, 1],
      [-1, -1, 1, 1],
    ];

    const scale = Math.pow(2, zoom);

    // Transform frustum corner points from clip space to tile space
    const frustumCoords = clipSpaceCorners
      .map((v) => vec4.transformMat4(new Float32Array([]), v, invProj))
      .map((v) => vec4.scale(new Float32Array([]), v, (1.0 / v[3] / worldSize) * scale));

    const frustumPlanePointIndices: Array<[number, number, number]> = [
      [0, 1, 2], // near
      [6, 5, 4], // far
      [0, 3, 7], // left
      [2, 1, 5], // right
      [3, 2, 6], // bottom
      [0, 4, 5], // top
    ];

    const frustumPlanes = frustumPlanePointIndices.map((p: [number, number, number]) => {
      const a = vec3.sub(
        new Float32Array(3),
        new Float32Array(frustumCoords[p[0]]),
        new Float32Array(frustumCoords[p[1]]),
      );
      const b = vec3.sub(
        new Float32Array(3),
        new Float32Array(frustumCoords[p[2]]),
        new Float32Array(frustumCoords[p[1]]),
      );
      const n = vec3.normalize(new Float32Array(3), vec3.cross(new Float32Array(3), a, b));
      const d = -vec3.dot(n, new Float32Array(frustumCoords[p[1]]));
      return (n as number[]).concat(d);
    });

    return new Frustum(frustumCoords as number[][], frustumPlanes);
  }
  public points: number[][];
  public planes: number[][];

  constructor(points: number[][], planes: number[][]) {
    this.points = points;
    this.planes = planes;
  }
}
