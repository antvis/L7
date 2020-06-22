// @ts-ignore
import Point from '../../geo/point';
import { indexTouches } from '../handler_util';

function getCentroid(points: Point[]) {
  const sum = new Point(0, 0);
  for (const point of points) {
    sum._add(point);
  }
  // @ts-ignore
  return sum.div(points.length);
}

export const MAX_TAP_INTERVAL = 500;
export const MAX_TOUCH_TIME = 500;
export const MAX_DIST = 30;

export default class SingleTapRecognizer {
  public numTouches: number;
  public centroid: Point;
  public startTime: number;
  public aborted: boolean;
  public touches: { [key: string]: Point };

  constructor(options: { numTouches: number }) {
    this.reset();
    this.numTouches = options.numTouches;
  }

  public reset() {
    delete this.centroid;
    delete this.startTime;
    delete this.touches;
    this.aborted = false;
  }

  public touchstart(e: TouchEvent, points: Point[], mapTouches: Touch[]) {
    if (this.centroid || mapTouches.length > this.numTouches) {
      this.aborted = true;
    }
    if (this.aborted) {
      return;
    }

    if (this.startTime === undefined) {
      this.startTime = e.timeStamp;
    }

    if (mapTouches.length === this.numTouches) {
      this.centroid = getCentroid(points);
      this.touches = indexTouches(mapTouches, points);
    }
  }

  public touchmove(e: TouchEvent, points: Point[], mapTouches: Touch[]) {
    if (this.aborted || !this.centroid) {
      return;
    }

    const newTouches = indexTouches(mapTouches, points);
    for (const id in this.touches) {
      if (this.touches[id]) {
        const prevPos = this.touches[id];
        const pos = newTouches[id];
        if (!pos || pos.dist(prevPos) > MAX_DIST) {
          this.aborted = true;
        }
      }
    }
  }

  public touchend(e: TouchEvent, points: Point[], mapTouches: Touch[]) {
    if (!this.centroid || e.timeStamp - this.startTime > MAX_TOUCH_TIME) {
      this.aborted = true;
    }

    if (mapTouches.length === 0) {
      const centroid = !this.aborted && this.centroid;
      this.reset();
      if (centroid) {
        return centroid;
      }
    }
  }
}
