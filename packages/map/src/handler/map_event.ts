// @ts-ignore
import type { EarthMap } from '../earthmap';
import type Point from '../geo/point';
import type { Map } from '../map';
import { MapMouseEvent, MapTouchEvent, MapWheelEvent } from './events';

export default class MapEventHandler {
  private mousedownPos: Point;
  private clickTolerance: number;
  private map: Map | EarthMap;

  constructor(map: Map | EarthMap, options: { clickTolerance: number }) {
    this.map = map;
    this.clickTolerance = options.clickTolerance;
  }

  public reset() {
    // @ts-ignore
    delete this.mousedownPos;
  }

  public wheel(e: WheelEvent) {
    // If mapEvent.preventDefault() is called by the user, prevent handlers such as:
    // - ScrollZoom
    return this.firePreventable(new MapWheelEvent(e.type, this.map, e));
  }

  public mousedown(e: MouseEvent, point: Point) {
    this.mousedownPos = point;
    // If mapEvent.preventDefault() is called by the user, prevent handlers such as:
    // - MousePan
    // - MouseRotate
    // - MousePitch
    // - DblclickHandler
    return this.firePreventable(new MapMouseEvent(e.type, this.map, e));
  }

  public mouseup(e: MouseEvent) {
    this.map.emit(e.type, new MapMouseEvent(e.type, this.map, e));
  }

  public click(e: MouseEvent, point: Point) {
    if (this.mousedownPos && this.mousedownPos.dist(point) >= this.clickTolerance) {
      return;
    }
    this.map.emit(e.type, new MapMouseEvent(e.type, this.map, e));
  }

  public dblclick(e: MouseEvent) {
    // If mapEvent.preventDefault() is called by the user, prevent handlers such as:
    // - DblClickZoom
    return this.firePreventable(new MapMouseEvent(e.type, this.map, e));
  }

  public mouseover(e: MouseEvent) {
    this.map.emit(e.type, new MapMouseEvent(e.type, this.map, e));
  }

  public mouseout(e: MouseEvent) {
    this.map.emit(e.type, new MapMouseEvent(e.type, this.map, e));
  }

  public touchstart(e: TouchEvent) {
    // If mapEvent.preventDefault() is called by the user, prevent handlers such as:
    // - TouchPan
    // - TouchZoom
    // - TouchRotate
    // - TouchPitch
    // - TapZoom
    // - SwipeZoom
    return this.firePreventable(new MapTouchEvent(e.type, this.map, e));
  }

  public touchmove(e: TouchEvent) {
    this.map.emit(e.type, new MapTouchEvent(e.type, this.map, e));
  }

  public touchend(e: TouchEvent) {
    this.map.emit(e.type, new MapTouchEvent(e.type, this.map, e));
  }

  public touchcancel(e: TouchEvent) {
    this.map.emit(e.type, new MapTouchEvent(e.type, this.map, e));
  }

  public firePreventable(mapEvent: MapMouseEvent | MapTouchEvent | MapWheelEvent) {
    this.map.emit(mapEvent.type, mapEvent);
    if (mapEvent.defaultPrevented) {
      // returning an object marks the handler as active and resets other handlers
      return {};
    }
  }

  public isEnabled() {
    return true;
  }

  public isActive() {
    return false;
  }
  public enable() {
    return false;
  }
  public disable() {
    return false;
  }
}
