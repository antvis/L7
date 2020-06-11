// @flow

import Point from '@mapbox/point-geometry';
import DOM from '../utils/dom';

const LEFT_BUTTON = 0;
const RIGHT_BUTTON = 2;

// the values for each button in MouseEvent.buttons
const BUTTONS_FLAGS = {
  [LEFT_BUTTON]: 1,
  [RIGHT_BUTTON]: 2,
};

function buttonStillPressed(e: MouseEvent, button: number) {
  const flag = BUTTONS_FLAGS[button];
  return e.buttons === undefined || (e.buttons & flag) !== flag;
}

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

export class MousePanHandler extends MouseHandler {
  public mousedown(e: MouseEvent, point: Point) {
    super.mousedown(e, point);
    if (this.lastPoint) {
      this.active = true;
    }
  }
  public _correctButton(e: MouseEvent, button: number) {
    return button === LEFT_BUTTON && !e.ctrlKey;
  }

  public _move(lastPoint: Point, point: Point) {
    return {
      around: point,
      panDelta: point.sub(lastPoint),
    };
  }
}

export class MouseRotateHandler extends MouseHandler {
  public _correctButton(e: MouseEvent, button: number) {
    return (button === LEFT_BUTTON && e.ctrlKey) || button === RIGHT_BUTTON;
  }

  public _move(lastPoint: Point, point: Point) {
    const degreesPerPixelMoved = 0.8;
    const bearingDelta = (point.x - lastPoint.x) * degreesPerPixelMoved;
    if (bearingDelta) {
      this.active = true;
      return { bearingDelta };
    }
  }

  public contextmenu(e: MouseEvent) {
    // prevent browser context menu when necessary; we don't allow it with rotation
    // because we can't discern rotation gesture start from contextmenu on Mac
    e.preventDefault();
  }
}

export class MousePitchHandler extends MouseHandler {
  public _correctButton(e: MouseEvent, button: number) {
    return (button === LEFT_BUTTON && e.ctrlKey) || button === RIGHT_BUTTON;
  }

  public _move(lastPoint: Point, point: Point) {
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
