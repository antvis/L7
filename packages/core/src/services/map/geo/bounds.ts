import { Point, PointLike } from './point';

export type IBoundsArray = [[number, number], [number, number]];
export type IBoundsLike =
  | Bounds
  | [PointLike, PointLike]
  | [number, number, number, number];
export class Bounds {
  public min: Point;
  public max: Point;

  public static convert(input: IBoundsLike | PointLike): Bounds {
    if (input instanceof Bounds) {
      return input;
    }
    return new Bounds(input);
  }

  constructor(a: PointLike | IBoundsLike, b?: PointLike) {
    if (!a) {
      return;
    }
    const points = b ? [a, b] : a;
    if (Array.isArray(points) && typeof points[0] === 'number') {
      this.extend(
        points as [number, number] | [number, number, number, number],
      );
    } else if (Array.isArray(points)) {
      for (let i = 0, len = points.length; i < len; i++) {
        if (typeof points[i] !== 'number') {
          // @ts-ignore
          this.extend(points[i]);
        }
      }
    }
  }

  public extend(obj: PointLike | IBoundsLike): Bounds {
    const min = this.min;
    const max = this.max;
    let min2: Point = new Point(0, 0);
    let max2: Point = new Point(0, 0);
    // 点
    if (
      obj instanceof Point ||
      (Array.isArray(obj) && obj.length === 2 && typeof obj[0] === 'number')
    ) {
      min2 = Point.convert(obj);
      max2 = Point.convert(obj);
    } else if (obj instanceof Bounds) {
      min2 = obj.min;
      max2 = obj.max;
      if (!min2 || !max2) {
        return this;
      }
    } else {
      if (Array.isArray(obj)) {
        min2 = Point.convert([obj[0], obj[1]]);
        max2 = Point.convert([obj[2], obj[3]]);
      }
    }

    if (!min && !max) {
      this.min = min2.clone();
      this.max = max2.clone();
    } else {
      this.min.x = Math.min(min2.x, this.min.x);
      this.max.x = Math.max(max2.x, this.max.x);
      this.min.y = Math.min(min2.y, this.min.y);
      this.max.y = Math.max(max2.y, this.max.y);
    }
    return this;
  }

  public getCenter(): Point {
    return Point.convert(this.min.add(this.max).div(2));
  }
  public getBottomLeft(): Point {
    return Point.convert([this.min.x, this.max.y]);
  }
  public getTopRight(): Point {
    return Point.convert([this.max.x, this.min.y]);
  }
  public getTopLeft(): Point {
    return Point.convert(this.min);
  }
  public getBottomRight(): Point {
    return Point.convert(this.max);
  }
  public getSize(): Point {
    return this.max.sub(this.min);
  }
  public contains(a: PointLike | IBoundsLike): boolean {
    let obj = a;
    let min: Point;
    let max: Point;
    // Point 为点
    (Array.isArray(obj) && obj.length === 2 && typeof obj[0] === 'number') ||
    obj instanceof Point
      ? (obj = Point.convert(obj))
      : (obj = Bounds.convert(obj));

    if (obj instanceof Bounds) {
      min = obj.min;
      max = obj.max;
    } else {
      min = max = obj as Point;
    }

    return (
      min.x >= this.min.x &&
      max.x <= this.max.x &&
      min.y >= this.min.y &&
      max.y <= this.max.y
    );
  }
  public intersects(bounds: IBoundsLike): boolean {
    bounds = Bounds.convert(bounds);

    const min = this.min;
    const max = this.max;
    const min2 = bounds.min;
    const max2 = bounds.max;
    const xIntersects = max2.x >= min.x && min2.x <= max.x;
    const yIntersects = max2.y >= min.y && min2.y <= max.y;

    return xIntersects && yIntersects;
  }
  public overlaps(bounds: IBoundsLike): boolean {
    bounds = Bounds.convert(bounds);

    const min = this.min;
    const max = this.max;
    const min2 = bounds.min;
    const max2 = bounds.max;
    const xOverlaps = max2.x > min.x && min2.x < max.x;
    const yOverlaps = max2.y > min.y && min2.y < max.y;

    return xOverlaps && yOverlaps;
  }
  public isValid(): boolean {
    return !!(this.min && this.max);
  }
  public pad(bufferRatio: number): Bounds {
    const min = this.min;
    const max = this.max;
    const heightBuffer = Math.abs(min.x - max.x) * bufferRatio;
    const widthBuffer = Math.abs(min.y - max.y) * bufferRatio;

    return Bounds.convert([
      Point.convert([min.x - heightBuffer, min.y - widthBuffer]),
      Point.convert([max.x + heightBuffer, max.y + widthBuffer]),
    ]);
  }
  public equals(bounds: Bounds): boolean {
    if (!bounds) {
      return false;
    }

    bounds = Bounds.convert(bounds);

    return (
      this.min.equals(bounds.getTopLeft()) &&
      this.max.equals(bounds.getBottomRight())
    );
  }
}
