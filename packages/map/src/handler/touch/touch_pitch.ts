// @ts-ignore
import Point from '../../geo/point';
import TwoTouchHandler from './two_touch';

function isVertical(vector: { x: number; y: number }) {
  return Math.abs(vector.y) > Math.abs(vector.x);
}

const ALLOWED_SINGLE_TOUCH_TIME = 100;

export default class TouchPitchHandler extends TwoTouchHandler {
  public valid: boolean | void;
  public firstMove: number;
  public lastPoints: [Point, Point];

  public reset() {
    super.reset();
    this.valid = undefined;
    delete this.firstMove;
    delete this.lastPoints;
  }

  public start(points: [Point, Point]) {
    this.lastPoints = points;
    if (isVertical(points[0].sub(points[1]))) {
      // fingers are more horizontal than vertical
      this.valid = false;
    }
  }

  public move(points: [Point, Point], center: Point, e: TouchEvent) {
    const vectorA = points[0].sub(this.lastPoints[0]);
    const vectorB = points[1].sub(this.lastPoints[1]);

    this.valid = this.gestureBeginsVertically(vectorA, vectorB, e.timeStamp);
    if (!this.valid) {
      return;
    }

    this.lastPoints = points;
    this.active = true;
    const yDeltaAverage = (vectorA.y + vectorB.y) / 2;
    const degreesPerPixelMoved = -0.5;
    return {
      pitchDelta: yDeltaAverage * degreesPerPixelMoved,
    };
  }

  public gestureBeginsVertically(
    vectorA: Point,
    vectorB: Point,
    timeStamp: number,
  ) {
    if (this.valid !== undefined) {
      return this.valid;
    }

    const threshold = 2;
    const movedA = vectorA.mag() >= threshold;
    const movedB = vectorB.mag() >= threshold;

    // neither finger has moved a meaningful amount, wait
    if (!movedA && !movedB) {
      return;
    }

    // One finger has moved and the other has not.
    // If enough time has passed, decide it is not a pitch.
    if (!movedA || !movedB) {
      if (this.firstMove === undefined) {
        this.firstMove = timeStamp;
      }

      if (timeStamp - this.firstMove < ALLOWED_SINGLE_TOUCH_TIME) {
        // still waiting for a movement from the second finger
        return undefined;
      } else {
        return false;
      }
    }

    const isSameDirection = vectorA.y > 0 === vectorB.y > 0;
    return isVertical(vectorA) && isVertical(vectorB) && isSameDirection;
  }
}
