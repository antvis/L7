// @ts-ignore
// tslint:disable-next-line:no-submodule-imports
import merge from 'lodash/merge';
import { EarthMap } from '../../earthmap';
import LngLat from '../../geo/lng_lat';
import Point from '../../geo/point';
import { Map } from '../../map';
import DOM from '../../utils/dom';
import { Event } from './event';
export default class MapMouseEvent extends Event {
  /**
   * `true` if `preventDefault` has been called.
   * @private
   */

  public type:
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
  constructor(
    type: string,
    map: Map | EarthMap,
    originalEvent: MouseEvent,
    data: any = {},
  ) {
    const point = DOM.mousePos(map.getCanvasContainer(), originalEvent);
    const lngLat = map.unproject(point);
    super(type, merge({ point, lngLat, originalEvent }, data));
    this.defaultPrevented = false;
    this.target = map;
  }
  public preventDefault() {
    this.defaultPrevented = true;
  }
}
