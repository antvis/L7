// @ts-ignore
import Point from '../../geo/point';
import { indexTouches } from '../handler_util';

export default class TouchPanHandler {
  public enabled: boolean;
  public active: boolean;
  public touches: { [key: string]: Point };
  public minTouches: number;
  public clickTolerance: number;
  public sum: Point;

  constructor(options: { clickTolerance: number }) {
    this.minTouches = 1;
    this.clickTolerance = options.clickTolerance || 1;
    this.reset();
  }

  public reset() {
    this.active = false;
    this.touches = {};
    this.sum = new Point(0, 0);
  }

  public touchstart(e: TouchEvent, points: Point[], mapTouches: Touch[]) {
    return this.calculateTransform(e, points, mapTouches);
  }

  public touchmove(e: TouchEvent, points: Point[], mapTouches: Touch[]) {
    if (!this.active) {
      return;
    }
    e.preventDefault();
    return this.calculateTransform(e, points, mapTouches);
  }

  public touchend(e: TouchEvent, points: Point[], mapTouches: Touch[]) {
    this.calculateTransform(e, points, mapTouches);

    if (this.active && mapTouches.length < this.minTouches) {
      this.reset();
    }
  }

  public touchcancel() {
    this.reset();
  }
  public enable() {
    this.enabled = true;
  }

  public disable() {
    this.enabled = false;
    this.reset();
  }

  public isEnabled() {
    return this.enabled;
  }

  public isActive() {
    return this.active;
  }

  private calculateTransform(
    e: TouchEvent,
    points: Point[],
    mapTouches: Touch[],
  ) {
    if (mapTouches.length > 0) {
      this.active = true;
    }

    const touches = indexTouches(mapTouches, points);

    const touchPointSum = new Point(0, 0);
    const touchDeltaSum = new Point(0, 0);
    let touchDeltaCount = 0;

    for (const identifier in touches) {
      if (touches[identifier]) {
        const point = touches[identifier];
        const prevPoint = this.touches[identifier];
        if (prevPoint) {
          touchPointSum._add(point);
          touchDeltaSum._add(point.sub(prevPoint));
          touchDeltaCount++;
          touches[identifier] = point;
        }
      }
    }

    this.touches = touches;

    if (touchDeltaCount < this.minTouches || !touchDeltaSum.mag()) {
      return;
    }
    // @ts-ignore
    const panDelta = touchDeltaSum.div(touchDeltaCount);
    this.sum._add(panDelta);
    if (this.sum.mag() < this.clickTolerance) {
      return;
    }
    // @ts-ignore
    const around = touchPointSum.div(touchDeltaCount);

    return {
      around,
      panDelta,
    };
  }
}
