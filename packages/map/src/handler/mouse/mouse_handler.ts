// @ts-ignore
import Point from '../../geo/point';
import DOM from '../../utils/dom';
import { buttonStillPressed } from './util';
export default class MouseHandler {
  protected enabled: boolean;
  protected active: boolean;
  protected lastPoint: Point;
  protected eventButton: 1 | 2;
  protected moved: boolean;
  protected clickTolerance: number;

  constructor(options: { clickTolerance: number }) {
    this.reset();
    this.clickTolerance = options.clickTolerance || 1;
  }

  public reset() {
    this.active = false;
    this.moved = false;
    // @ts-ignore
    delete this.lastPoint;
    // @ts-ignore
    delete this.eventButton;
  }

  public mousedown(e: MouseEvent, point: Point) {
    if (this.lastPoint) {
      return;
    }

    const eventButton = DOM.mouseButton(e);
    if (!this.correctButton(e, eventButton)) {
      return;
    }

    this.lastPoint = point;
    this.eventButton = eventButton;
  }

  public mousemoveWindow(e: MouseEvent, point: Point) {
    const lastPoint = this.lastPoint;
    if (!lastPoint) {
      return;
    }
    e.preventDefault();

    if (buttonStillPressed(e, this.eventButton)) {
      // Some browsers don't fire a `mouseup` when the mouseup occurs outside
      // the window or iframe:
      // https://github.com/mapbox/mapbox-gl-js/issues/4622
      //
      // If the button is no longer pressed during this `mousemove` it may have
      // been released outside of the window or iframe.
      this.reset();
      return;
    }

    if (!this.moved && point.dist(lastPoint) < this.clickTolerance) {
      return;
    }
    this.moved = true;
    this.lastPoint = point;

    // implemented by child class
    return this.move(lastPoint, point);
  }

  public mouseupWindow(e: MouseEvent) {
    if (!this.lastPoint) {
      return;
    }
    const eventButton = DOM.mouseButton(e);
    if (eventButton !== this.eventButton) {
      return;
    }
    if (this.moved) {
      DOM.suppressClick();
    }
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected correctButton(e: MouseEvent, button: number) {
    // eslint-disable-line
    return false; // implemented by child
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected move(lastPoint: Point, point: Point) {
    // eslint-disable-line
    return; // implemented by child
  }
}
