export type PointLike = [number, number] | Point;

export default class Point {
  public static convert(a: any) {
    if (a instanceof Point) {
      return a;
    }
    if (Array.isArray(a)) {
      return new Point(a[0], a[1]);
    }
    return a;
  }
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public clone() {
    return new Point(this.x, this.y);
  }

  public _add(p: Point) {
    this.x += p.x;
    this.y += p.y;
    return this;
  }

  public add(p: Point) {
    return this.clone()._add(p);
  }

  public _sub(p: Point) {
    this.x -= p.x;
    this.y -= p.y;
    return this;
  }
  public sub(p: Point) {
    return this.clone()._sub(p);
  }

  public _multByPoint(p: Point) {
    this.x *= p.x;
    this.y *= p.y;
    return this;
  }

  public multByPoint(p: Point) {
    return this.clone()._multByPoint(p);
  }

  public _divByPoint(p: Point) {
    this.x /= p.x;
    this.y /= p.y;
    return this;
  }
  public divByPoint(p: Point) {
    return this.clone()._divByPoint(p);
  }

  public _mult(k: number) {
    this.x *= k;
    this.y *= k;
    return this;
  }

  public mult(k: number) {
    return this.clone()._mult(k);
  }

  public _div(k: number) {
    this.x /= k;
    this.y /= k;
    return this;
  }

  public div(k: number) {
    return this.clone()._div(k);
  }

  public _rotate(angle: number) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x = cos * this.x - sin * this.y;
    const y = sin * this.x + cos * this.y;
    this.x = x;
    this.y = y;
    return this;
  }

  public rotate(angle: number) {
    return this.clone()._rotate(angle);
  }

  public _rotateAround(angle: number, p: Point) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x = p.x + cos * (this.x - p.x) - sin * (this.y - p.y);
    const y = p.y + sin * (this.x - p.x) + cos * (this.y - p.y);
    this.x = x;
    this.y = y;
    return this;
  }
  public roateAround(angle: number, p: Point) {
    return this.clone()._rotateAround(angle, p);
  }

  public _matMult(m: number[]) {
    const x = m[0] * this.x + m[1] * this.y;
    const y = m[2] * this.x + m[3] * this.y;
    this.x = x;
    this.y = y;
    return this;
  }

  public matMult(m: number[]) {
    return this.clone()._matMult(m);
  }

  public _unit() {
    this.div(this.mag());
    return this;
  }
  public unit() {
    return this.clone()._unit();
  }

  public _perp() {
    const y = this.y;
    this.y = this.x;
    this.x = -y;
    return this;
  }
  public perp() {
    return this.clone()._perp();
  }

  public _round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }

  public round() {
    return this.clone()._round();
  }

  public mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  public equals(other: Point) {
    return this.x === other.x && this.y === other.y;
  }

  public dist(p: Point) {
    return Math.sqrt(this.distSqr(p));
  }

  public distSqr(p: Point) {
    const dx = p.x - this.x;
    const dy = p.y - this.y;
    return dx * dx + dy * dy;
  }

  public angle() {
    return Math.atan2(this.y, this.x);
  }

  public angleTo(b: Point) {
    return Math.atan2(this.y - b.y, this.x - b.x);
  }

  public angleWith(b: Point) {
    return this.angleWithSep(b.x, b.y);
  }

  public angleWithSep(x: number, y: number) {
    return Math.atan2(this.x * y - this.y * x, this.x * x + this.y * y);
  }
}
