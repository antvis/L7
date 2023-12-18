// @ts-ignore
import type Point from '../../geo/point';
import { MAX_TAP_INTERVAL } from './single_tap_recognizer';
import TapRecognizer from './tap_recognizer';

export default class TapDragZoomHandler {
  public enabled: boolean;
  public active: boolean;
  public swipePoint: Point;
  public swipeTouch: number;
  public tapTime: number;
  public tap: TapRecognizer;

  constructor() {
    this.tap = new TapRecognizer({
      numTouches: 1,
      numTaps: 1,
    });

    this.reset();
  }

  public reset() {
    this.active = false;
    // @ts-ignore
    delete this.swipePoint;
    // @ts-ignore
    delete this.swipeTouch;
    // @ts-ignore
    delete this.tapTime;
    this.tap.reset();
  }

  public touchstart(e: TouchEvent, points: Point[], mapTouches: Touch[]) {
    if (this.swipePoint) {
      return;
    }

    if (this.tapTime && e.timeStamp - this.tapTime > MAX_TAP_INTERVAL) {
      this.reset();
    }

    if (!this.tapTime) {
      this.tap.touchstart(e, points, mapTouches);
    } else if (mapTouches.length > 0) {
      this.swipePoint = points[0];
      this.swipeTouch = mapTouches[0].identifier;
    }
  }

  public touchmove(e: TouchEvent, points: Point[], mapTouches: Touch[]) {
    if (!this.tapTime) {
      this.tap.touchmove(e, points, mapTouches);
    } else if (this.swipePoint) {
      if (mapTouches[0].identifier !== this.swipeTouch) {
        return;
      }

      const newSwipePoint = points[0];
      const dist = newSwipePoint.y - this.swipePoint.y;
      this.swipePoint = newSwipePoint;

      e.preventDefault();
      this.active = true;

      return {
        zoomDelta: dist / 128,
      };
    }
  }

  public touchend(e: TouchEvent, points: Point[], mapTouches: Touch[]) {
    if (!this.tapTime) {
      const point = this.tap.touchend(e, points, mapTouches);
      if (point) {
        this.tapTime = e.timeStamp;
      }
    } else if (this.swipePoint) {
      if (mapTouches.length === 0) {
        this.reset();
      }
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
}
