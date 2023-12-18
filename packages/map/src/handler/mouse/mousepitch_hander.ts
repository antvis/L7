// @ts-ignore
import type Point from '../../geo/point';
import MouseHandler from './mouse_handler';
import { LEFT_BUTTON, RIGHT_BUTTON } from './util';
export default class MousePitchHandler extends MouseHandler {
  public correctButton(e: MouseEvent, button: number) {
    return (button === LEFT_BUTTON && e.ctrlKey) || button === RIGHT_BUTTON;
  }

  public move(lastPoint: Point, point: Point) {
    const degreesPerPixelMoved = -0.5;
    const pitchDelta = (point.y - lastPoint.y) * degreesPerPixelMoved;
    if (pitchDelta) {
      this.active = true;
      return { pitchDelta };
    }
  }

  public contextmenu(e: MouseEvent) {
    // prevent browser context menu when necessary; we don't allow it with rotation
    // because we can't discern rotation gesture start from contextmenu on Mac
    e.preventDefault();
  }
}
