// @ts-ignore
import { EarthMap } from '../earthmap';
import Point from '../geo/point';
import { Map } from '../map';
export interface IHandlerResult {
  panDelta?: Point;
  zoomDelta?: number;
  bearingDelta?: number;
  pitchDelta?: number;
  around?: Point | null;
  pinchAround?: Point | null;
  cameraAnimation?: (map: Map | EarthMap) => any;
  originalEvent?: any;
  // Makes the manager trigger a frame; allowing the handler to return multiple results over time (see scrollzoom).
  needsRenderFrame?: boolean;
  noInertia?: boolean;
}

export interface IHandler {
  // Handlers can optionally implement these methods.
  // They are called with dom events whenever those dom evens are received.
  touchstart?: (
    e: TouchEvent,
    points: Point[],
    mapTouches: Touch[],
  ) => IHandlerResult | void;
  touchmove?: (
    e: TouchEvent,
    points: Point[],
    mapTouches: Touch[],
  ) => IHandlerResult | void;
  touchend?: (
    e: TouchEvent,
    points: Point[],
    mapTouches: Touch[],
  ) => IHandlerResult | void;
  touchcancel?: (
    e: TouchEvent,
    points: Point[],
    mapTouches: Touch[],
  ) => IHandlerResult | void;
  mousedown?: (e: MouseEvent, point: Point) => IHandlerResult | void;
  mousemove?: (e: MouseEvent, point: Point) => IHandlerResult | void;
  mouseup?: (e: MouseEvent, point: Point) => IHandlerResult | void;
  dblclick?: (e: MouseEvent, point: Point) => IHandlerResult | void;
  wheel?: (e: WheelEvent, point: Point) => IHandlerResult | void;
  keydown?: (e: KeyboardEvent) => IHandlerResult | void;
  keyup?: (e: KeyboardEvent) => IHandlerResult | void;

  // `renderFrame` is the only non-dom event. It is called during render
  // frames and can be used to smooth camera changes (see scroll handler).
  renderFrame?: () => IHandlerResult | void;
  enable(options?: any): void;
  disable(): void;
  isEnabled(): boolean;
  isActive(): boolean;

  // `reset` can be called by the manager at any time and must reset everything to it's original state
  reset(): void;
}
