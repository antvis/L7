// @ts-ignore
import type Point from '../../geo/point';
import TwoTouchHandler from './two_touch';

const ROTATION_THRESHOLD = 25; // pixels along circumference of touch circle

function getBearingDelta(a: Point, b: Point) {
  return (a.angleWith(b) * 180) / Math.PI;
}

export default class TouchRotateHandler extends TwoTouchHandler {
  private minDiameter: number;

  public reset() {
    super.reset();
    // @ts-ignore
    delete this.minDiameter;
    // @ts-ignore
    delete this.startVector;
    // @ts-ignore
    delete this.vector;
  }

  public start(points: [Point, Point]) {
    this.startVector = this.vector = points[0].sub(points[1]);
    this.minDiameter = points[0].dist(points[1]);
  }

  public move(points: [Point, Point], pinchAround: Point) {
    const lastVector = this.vector;
    this.vector = points[0].sub(points[1]);

    if (!this.active && this.isBelowThreshold(this.vector)) {
      return;
    }
    this.active = true;

    return {
      bearingDelta: getBearingDelta(this.vector, lastVector),
      pinchAround,
    };
  }

  private isBelowThreshold(vector: Point) {
    /*
     * The threshold before a rotation actually happens is configured in
     * pixels alongth circumference of the circle formed by the two fingers.
     * This makes the threshold in degrees larger when the fingers are close
     * together and smaller when the fingers are far apart.
     *
     * Use the smallest diameter from the whole gesture to reduce sensitivity
     * when pinching in and out.
     */

    this.minDiameter = Math.min(this.minDiameter, vector.mag());
    const circumference = Math.PI * this.minDiameter;
    const threshold = (ROTATION_THRESHOLD / circumference) * 360;

    const bearingDeltaSinceStart = getBearingDelta(vector, this.startVector);
    return Math.abs(bearingDeltaSinceStart) < threshold;
  }
}
