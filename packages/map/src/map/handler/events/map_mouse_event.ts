// @ts-ignore
// tslint:disable-next-line:no-submodule-imports
import type { EarthMap } from '../../earthmap';
import type LngLat from '../../geo/lng_lat';
import type Point from '../../geo/point';
import type { Map } from '../../map';
import DOM from '../../utils/dom';
import { Event } from './event';

export default class MapMouseEvent extends Event {
  /**
   * `true` if `preventDefault` has been called.
   * @private
   */

  public declare type:
    | 'mousedown'
    | 'mouseup'
    | 'click'
    | 'dblclick'
    | 'mousemove'
    | 'mouseover'
    | 'mouseenter'
    | 'mouseleave'
    | 'mouseout'
    | 'contextmenu';

  /**
   * The `Map` object that fired the event.
   */
  public target: Map | EarthMap;

  /**
   * The DOM event which caused the map event.
   */
  public originalEvent: MouseEvent;

  /**
   * The pixel coordinates of the mouse cursor, relative to the map and measured from the top left corner.
   */
  public point: Point;

  /**
   * The geographic location on the map of the mouse cursor.
   */
  public lngLat: LngLat;

  public defaultPrevented: boolean;

  /**
   * @private
   */
  constructor(type: string, map: Map | EarthMap, originalEvent: MouseEvent) {
    super(type);
    const point = DOM.mousePos(map.getCanvasContainer(), originalEvent);
    const lngLat = map.unproject(point);

    this.point = point;
    this.lngLat = lngLat;
    this.originalEvent = originalEvent;
    this.defaultPrevented = false;
    this.target = map;
  }
  public preventDefault() {
    this.defaultPrevented = true;
  }
}
