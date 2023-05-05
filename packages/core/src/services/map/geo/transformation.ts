import { IPoint, Point } from './point';
export class Transformation {
  private a: number = 0;
  private b: number = 0;
  private c: number = 0;
  private d: number = 0;

  constructor(
    a: number | [number, number, number, number],
    b: number,
    c: number,
    d: number,
  ) {
    if (Array.isArray(a)) {
      this.a = a[0];
      this.b = a[1];
      this.c = a[2];
      this.d = a[3];
      return;
    }
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
  }

  public transform(point: IPoint, scale: number = 1) {
    point.x = scale * (this.a * point.x + this.b);
    point.y = scale * (this.c * point.y + this.d);
    return new Point(point.x, point.y);
  }

  public untransform(point: IPoint, scale: number = 1) {
    return new Point(
      (point.x / scale - this.b) / this.a,
      (point.y / scale - this.d) / this.c,
    );
  }
}
