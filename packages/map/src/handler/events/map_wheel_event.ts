import { Map } from '../../map';
import { Event } from './event';

export interface IMapBoxZoomEvent {
  type: 'boxzoomstart' | 'boxzoomend' | 'boxzoomcancel';
  target: Map;
  originalEvent: MouseEvent;
}
export default class MapWheelEvent extends Event {
  /**
   * The event type.
   */
  public type: 'wheel';

  /**
   * The DOM event which caused the map event.
   */
  public originalEvent: WheelEvent;

  public defaultPrevented: boolean;

  /**
   * The `Map` object that fired the event.
   */
  public target: Map;

  /**
   * @private
   */
  constructor(type: string, map: Map, originalEvent: WheelEvent) {
    super(type, { originalEvent });
    this.defaultPrevented = false;
  }

  /**
   * Prevents subsequent default processing of the event by the map.
   *
   * Calling this method will prevent the the behavior of {@link ScrollZoomHandler}.
   */
  private preventDefault() {
    this.defaultPrevented = true;
  }
}
