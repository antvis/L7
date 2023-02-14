// @ts-ignore
import Point from '../../geo/point';
import TwoTouchHandler from './two_touch';

const ZOOM_THRESHOLD = 0.1;
function getZoomDelta(distance: number, lastDistance: number) {
  return Math.log(distance / lastDistance) / Math.LN2;
}
export default class TouchZoomHandler extends TwoTouchHandler {
  private distance: number;
  private startDistance: number;

  public reset() {
    super.reset();
    // @ts-ignore
    delete this.distance;
    // @ts-ignore
    delete this.startDistance;
  }

  public start(points: [Point, Point]) {
    this.startDistance = this.distance = points[0].dist(points[1]);
  }

  public move(points: [Point, Point], pinchAround: Point) {
    const lastDistance = this.distance;
    this.distance = points[0].dist(points[1]);
    if (
      !this.active &&
      Math.abs(getZoomDelta(this.distance, this.startDistance)) < ZOOM_THRESHOLD
    ) {
      return;
    }
    this.active = true;
    return {
      zoomDelta: getZoomDelta(this.distance, lastDistance),
      pinchAround,
    };
  }
}
