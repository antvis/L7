// @ts-ignore
import type Point from '../../geo/point';
import DOM from '../../utils/dom';

export default class TwoTouchHandler {
  protected enabled: boolean;
  protected active: boolean;
  protected firstTwoTouches: [number, number];
  protected vector: Point;
  protected startVector: Point;
  protected aroundCenter: boolean;

  constructor() {
    this.reset();
  }

  public reset() {
    this.active = false;
    // @ts-ignore
    delete this.firstTwoTouches;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public start(points: [Point, Point]) {
    return;
  } // eslint-disable-line
  public move(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    points: [Point, Point],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    pinchAround: Point | null,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    e: TouchEvent,
  ) {
    return;
  } // eslint-disable-line

  public touchstart(e: TouchEvent, points: Point[], mapTouches: Touch[]) {
    if (this.firstTwoTouches || mapTouches.length < 2) {
      return;
    }

    this.firstTwoTouches = [mapTouches[0].identifier, mapTouches[1].identifier];

    // implemented by child classes
    this.start([points[0], points[1]]);
  }

  public touchmove(e: TouchEvent, points: Point[], mapTouches: Touch[]) {
    if (!this.firstTwoTouches) {
      return;
    }

    e.preventDefault();

    const [idA, idB] = this.firstTwoTouches;
    const a = getTouchById(mapTouches, points, idA);
    const b = getTouchById(mapTouches, points, idB);
    if (!a || !b) {
      return;
    }
    const pinchAround = this.aroundCenter ? null : a.add(b).div(2);

    // implemented by child classes
    return this.move([a, b], pinchAround, e);
  }

  public touchend(e: TouchEvent, points: Point[], mapTouches: Touch[]) {
    if (!this.firstTwoTouches) {
      return;
    }

    const [idA, idB] = this.firstTwoTouches;
    const a = getTouchById(mapTouches, points, idA);
    const b = getTouchById(mapTouches, points, idB);
    if (a && b) {
      return;
    }

    if (this.active) {
      DOM.suppressClick();
    }

    this.reset();
  }

  public touchcancel() {
    this.reset();
  }

  public enable(options?: { around?: 'center' }) {
    this.enabled = true;
    this.aroundCenter = !!options && options.around === 'center';
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

function getTouchById(mapTouches: Touch[], points: Point[], identifier: number) {
  for (let i = 0; i < mapTouches.length; i++) {
    if (mapTouches[i].identifier === identifier) {
      return points[i];
    }
  }
}
