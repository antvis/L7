type IPosition = [number, number, number];
export type IPath = IPosition[];
export enum ShapeType {
  CIRCLE = 'cylinder',
  SQUARE = 'squareColumn',
  TRIANGLE = 'triangleColumn',
  HEXAGON = 'hexagonColumn',
  PENTAGON = 'pentagonColumn',
}

/**
 * 生成规则多边形顶点个数
 * @param pointCount  顶点个数 3 => 三角形
 * @param start 顶点起始角度 调整图形的方向
 */
export function polygonPath(pointCount: number, start: number = 0): IPath {
  const step = (Math.PI * 2) / pointCount;
  const line = [];
  for (let i = 0; i < pointCount; i++) {
    line.push(step * i + (start * Math.PI) / 12);
  }
  const path: IPath = line.map((t) => {
    const x = Math.sin(t + Math.PI / 4);
    const y = Math.cos(t + Math.PI / 4);
    return [x, y, 0];
  });
  path.push(path[0]);
  return path;
}

export function circle(): IPath {
  return polygonPath(30);
}
export function square(): IPath {
  return polygonPath(4);
}
export function triangle(): IPath {
  return polygonPath(3);
}
export function hexagon(): IPath {
  return polygonPath(6);
}
export function pentagon(): IPath {
  return polygonPath(5);
}

export const geometryShape = {
  [ShapeType.CIRCLE]: circle,
  [ShapeType.HEXAGON]: hexagon,
  [ShapeType.TRIANGLE]: triangle,
  [ShapeType.SQUARE]: square,
  [ShapeType.PENTAGON]: pentagon,
};
