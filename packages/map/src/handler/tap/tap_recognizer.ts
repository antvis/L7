// @ts-ignore
import Point from '../../geo/point';
import SingleTapRecognizer, {
  MAX_DIST,
  MAX_TAP_INTERVAL,
} from './single_tap_recognizer';

export default class TapRecognizer {
  public singleTap: SingleTapRecognizer;
  public numTaps: number;
  public lastTime: number;
  public lastTap: Point;
  public count: number;

  constructor(options: { numTaps: number; numTouches: number }) {
    this.singleTap = new SingleTapRecognizer(options);
    this.numTaps = options.numTaps;
    this.reset();
  }

  public reset() {
    this.lastTime = Infinity;
    // @ts-ignore
    delete this.lastTap;
    this.count = 0;
    this.singleTap.reset();
  }

  public touchstart(e: TouchEvent, points: Point[], mapTouches: Touch[]) {
    this.singleTap.touchstart(e, points, mapTouches);
  }

  public touchmove(e: TouchEvent, points: Point[], mapTouches: Touch[]) {
    this.singleTap.touchmove(e, points, mapTouches);
  }

  public touchend(e: TouchEvent, points: Point[], mapTouches: Touch[]) {
    const tap = this.singleTap.touchend(e, points, mapTouches);
    if (tap) {
      const soonEnough = e.timeStamp - this.lastTime < MAX_TAP_INTERVAL;
      const closeEnough = !this.lastTap || this.lastTap.dist(tap) < MAX_DIST;

      if (!soonEnough || !closeEnough) {
        this.reset();
      }

      this.count++;
      this.lastTime = e.timeStamp;
      this.lastTap = tap;

      if (this.count === this.numTaps) {
        this.reset();
        return tap;
      }
    }
  }
}
