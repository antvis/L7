import { DOM } from '@antv/l7-utils';
import Point from '@mapbox/point-geometry';
import { buttonStillPressed } from './util';
class MouseHandler {
  private enabled: boolean;
  private active: boolean;
  private lastPoint: Point;
  private eventButton: number;
  private moved: boolean;
  private clickTolerance: number;

  constructor(options: { clickTolerance: number }) {
    this.reset();
    this.clickTolerance = options.clickTolerance || 1;
  }

  public reset() {
    this.active = false;
    this.moved = false;
    delete this.lastPoint;
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

  private correctButton(e: MouseEvent, button: number) {
    // eslint-disable-line
    return false; // implemented by child
  }

  private move(lastPoint: Point, point: Point) {
    // eslint-disable-line
    return {}; // implemented by child
  }
}
