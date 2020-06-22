// @ts-ignore
import Point from '../geo/point';
import { Map } from '../map';
import { MapMouseEvent, MapTouchEvent, MapWheelEvent } from './events';
export default class BlockableMapEventHandler {
  private map: Map;
  private delayContextMenu: boolean;
  private contextMenuEvent: MouseEvent;

  constructor(map: Map) {
    this.map = map;
  }

  public reset() {
    this.delayContextMenu = false;
    delete this.contextMenuEvent;
  }

  public mousemove(e: MouseEvent) {
    // mousemove map events should not be fired when interaction handlers (pan, rotate, etc) are active
    this.map.emit(e.type, new MapMouseEvent(e.type, this.map, e));
  }

  public mousedown() {
    this.delayContextMenu = true;
  }

  public mouseup() {
    this.delayContextMenu = false;
    if (this.contextMenuEvent) {
      this.map.emit(
        'contextmenu',
        new MapMouseEvent('contextmenu', this.map, this.contextMenuEvent),
      );
      delete this.contextMenuEvent;
    }
  }
  public contextmenu(e: MouseEvent) {
    if (this.delayContextMenu) {
      // Mac: contextmenu fired on mousedown; we save it until mouseup for consistency's sake
      this.contextMenuEvent = e;
    } else {
      // Windows: contextmenu fired on mouseup, so fire event now
      this.map.emit(e.type, new MapMouseEvent(e.type, this.map, e));
    }

    // prevent browser context menu when necessary
    if (this.map.listeners('contextmenu')) {
      e.preventDefault();
    }
  }

  public isEnabled() {
    return true;
  }

  public isActive() {
    return false;
  }
  public enable() {
    return true;
  }
  public disable() {
    return false;
  }
}
