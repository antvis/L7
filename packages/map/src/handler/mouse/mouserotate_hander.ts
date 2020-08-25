// @ts-ignore
import Point from '../../geo/point';
import MouseHandler from './mouse_handler';
import { LEFT_BUTTON, RIGHT_BUTTON } from './util';
export default class MouseRotateHandler extends MouseHandler {
  public contextmenu(e: MouseEvent) {
    // prevent browser context menu when necessary; we don't allow it with rotation
    // because we can't discern rotation gesture start from contextmenu on Mac
    e.preventDefault();
  }
  protected correctButton(e: MouseEvent, button: number) {
    return (button === LEFT_BUTTON && e.ctrlKey) || button === RIGHT_BUTTON;
  }

  protected move(lastPoint: Point, point: Point) {
    const degreesPerPixelMoved = 0.8;
    const bearingDelta = (point.x - lastPoint.x) * degreesPerPixelMoved;
    if (bearingDelta) {
      this.active = true;
      return { bearingDelta };
    }
  }
}
