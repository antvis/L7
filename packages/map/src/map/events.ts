import { Event } from './util/evented';

import Point from '@mapbox/point-geometry';
import { DOM } from './util/dom';

import type { LngLat } from './geo/lng_lat';
import type { Map } from './map';

/**
 * `MapEventType` - a mapping between the event name and the event value.
 * These events are used with the {@link Map#on} method.
 * When using a `layerId` with {@link Map#on} method, please refer to {@link MapLayerEventType}.
 * The following example can be used for all the events.
 *
 * @group Event Related
 * @example
 * ```ts
 * // Initialize the map
 * let map = new Map({ // map options });
 * // Set an event listener
 * map.on('the-event-name', () => {
 *   console.log('An event has occurred!');
 * });
 * ```
 */
export type MapEventType = {
  /**
   * Fired when an error occurs. This is GL JS's primary error reporting
   * mechanism. We use an event instead of `throw` to better accommodate
   * asynchronous operations. If no listeners are bound to the `error` event, the
   * error will be printed to the console.
   */
  error: ErrorEvent;
  /**
   * Fired after the last frame rendered before the map enters an
   * "idle" state:
   *
   * - No camera transitions are in progress
   * - All currently requested tiles have loaded
   * - All fade/transition animations have completed
   */
  idle: MapLibreEvent;
  /**
   * Fired immediately after the map has been removed with {@link Map#remove}.
   */
  remove: MapLibreEvent;
  /**
   * Fired immediately after the map has been resized.
   */
  resize: MapLibreEvent;
  /**
   * Fired when the user cancels a "box zoom" interaction, or when the bounding box does not meet the minimum size threshold.
   * See {@link BoxZoomHandler}.
   */
  boxzoomcancel: MapLibreZoomEvent;
  /**
   * Fired when a "box zoom" interaction starts. See {@link BoxZoomHandler}.
   */
  boxzoomstart: MapLibreZoomEvent;
  /**
   * Fired when a "box zoom" interaction ends.  See {@link BoxZoomHandler}.
   */
  boxzoomend: MapLibreZoomEvent;
  /**
   * Fired when a [`touchcancel`](https://developer.mozilla.org/en-US/docs/Web/Events/touchcancel) event occurs within the map.
   */
  touchcancel: MapTouchEvent;
  /**
   * Fired when a [`touchmove`](https://developer.mozilla.org/en-US/docs/Web/Events/touchmove) event occurs within the map.
   * @see [Create a draggable point](https://maplibre.org/maplibre-gl-js/docs/examples/drag-a-point/)
   */
  touchmove: MapTouchEvent;
  /**
   * Fired when a [`touchend`](https://developer.mozilla.org/en-US/docs/Web/Events/touchend) event occurs within the map.
   * @see [Create a draggable point](https://maplibre.org/maplibre-gl-js/docs/examples/drag-a-point/)
   */
  touchend: MapTouchEvent;
  /**
   * Fired when a [`touchstart`](https://developer.mozilla.org/en-US/docs/Web/Events/touchstart) event occurs within the map.
   * @see [Create a draggable point](https://maplibre.org/maplibre-gl-js/docs/examples/drag-a-point/)
   */
  touchstart: MapTouchEvent;
  /**
   * Fired when a pointing device (usually a mouse) is pressed and released at the same point on the map.
   *
   * @see [Measure distances](https://maplibre.org/maplibre-gl-js/docs/examples/measure/)
   * @see [Center the map on a clicked symbol](https://maplibre.org/maplibre-gl-js/docs/examples/center-on-symbol/)
   */
  click: MapMouseEvent;
  /**
   * Fired when the right button of the mouse is clicked or the context menu key is pressed within the map.
   */
  contextmenu: MapMouseEvent;
  /**
   * Fired when a pointing device (usually a mouse) is pressed and released twice at the same point on the map in rapid succession.
   *
   * **Note:** Under normal conditions, this event will be preceded by two `click` events.
   */
  dblclick: MapMouseEvent;
  /**
   * Fired when a pointing device (usually a mouse) is moved while the cursor is inside the map.
   * As you move the cursor across the map, the event will fire every time the cursor changes position within the map.
   *
   * @see [Get coordinates of the mouse pointer](https://maplibre.org/maplibre-gl-js/docs/examples/mouse-position/)
   * @see [Highlight features under the mouse pointer](https://maplibre.org/maplibre-gl-js/docs/examples/hover-styles/)
   * @see [Display a popup on over](https://maplibre.org/maplibre-gl-js/docs/examples/popup-on-hover/)
   */
  mousemove: MapMouseEvent;
  /**
   * Fired when a pointing device (usually a mouse) is released within the map.
   *
   * @see [Create a draggable point](https://maplibre.org/maplibre-gl-js/docs/examples/drag-a-point/)
   */
  mouseup: MapMouseEvent;
  /**
   * Fired when a pointing device (usually a mouse) is pressed within the map.
   *
   * @see [Create a draggable point](https://maplibre.org/maplibre-gl-js/docs/examples/drag-a-point/)
   */
  mousedown: MapMouseEvent;
  /**
   * Fired when a point device (usually a mouse) leaves the map's canvas.
   */
  mouseout: MapMouseEvent;
  /**
   * Fired when a pointing device (usually a mouse) is moved within the map.
   * As you move the cursor across a web page containing a map,
   * the event will fire each time it enters the map or any child elements.
   *
   * @see [Get coordinates of the mouse pointer](https://maplibre.org/maplibre-gl-js/docs/examples/mouse-position/)
   * @see [Highlight features under the mouse pointer](https://maplibre.org/maplibre-gl-js/docs/examples/hover-styles/)
   * @see [Display a popup on hover](https://maplibre.org/maplibre-gl-js/docs/examples/popup-on-hover/)
   */
  mouseover: MapMouseEvent;
  /**
   * Fired just before the map begins a transition from one
   * view to another, as the result of either user interaction or methods such as {@link Map#jumpTo}.
   *
   */
  movestart: MapLibreEvent<MouseEvent | TouchEvent | WheelEvent | undefined>;
  /**
   * Fired repeatedly during an animated transition from one view to
   * another, as the result of either user interaction or methods such as {@link Map#flyTo}.
   *
   * @see [Display HTML clusters with custom properties](https://maplibre.org/maplibre-gl-js/docs/examples/cluster-html/)
   */
  move: MapLibreEvent<MouseEvent | TouchEvent | WheelEvent | undefined>;
  /**
   * Fired just after the map completes a transition from one
   * view to another, as the result of either user interaction or methods such as {@link Map#jumpTo}.
   *
   * @see [Display HTML clusters with custom properties](https://maplibre.org/maplibre-gl-js/docs/examples/cluster-html/)
   */
  moveend: MapLibreEvent<MouseEvent | TouchEvent | WheelEvent | undefined>;
  /**
   * Fired just before the map begins a transition from one zoom level to another,
   * as the result of either user interaction or methods such as {@link Map#flyTo}.
   */
  zoomstart: MapLibreEvent<MouseEvent | TouchEvent | WheelEvent | undefined>;
  /**
   * Fired repeatedly during an animated transition from one zoom level to another,
   * as the result of either user interaction or methods such as {@link Map#flyTo}.
   */
  zoom: MapLibreEvent<MouseEvent | TouchEvent | WheelEvent | undefined>;
  /**
   * Fired just after the map completes a transition from one zoom level to another,
   * as the result of either user interaction or methods such as {@link Map#flyTo}.
   */
  zoomend: MapLibreEvent<MouseEvent | TouchEvent | WheelEvent | undefined>;
  /**
   * Fired when a "drag to rotate" interaction starts. See {@link DragRotateHandler}.
   */
  rotatestart: MapLibreEvent<MouseEvent | TouchEvent | undefined>;
  /**
   * Fired repeatedly during a "drag to rotate" interaction. See {@link DragRotateHandler}.
   */
  rotate: MapLibreEvent<MouseEvent | TouchEvent | undefined>;
  /**
   * Fired when a "drag to rotate" interaction ends. See {@link DragRotateHandler}.
   */
  rotateend: MapLibreEvent<MouseEvent | TouchEvent | undefined>;
  /**
   * Fired when a "drag to pan" interaction starts. See {@link DragPanHandler}.
   */
  dragstart: MapLibreEvent<MouseEvent | TouchEvent | undefined>;
  /**
   * Fired repeatedly during a "drag to pan" interaction. See {@link DragPanHandler}.
   */
  drag: MapLibreEvent<MouseEvent | TouchEvent | undefined>;
  /**
   * Fired when a "drag to pan" interaction ends. See {@link DragPanHandler}.
   * @see [Create a draggable marker](https://maplibre.org/maplibre-gl-js/docs/examples/drag-a-marker/)
   */
  dragend: MapLibreEvent<MouseEvent | TouchEvent | undefined>;
  /**
   * Fired whenever the map's pitch (tilt) begins a change as
   * the result of either user interaction or methods such as {@link Map#flyTo} .
   */
  pitchstart: MapLibreEvent<MouseEvent | TouchEvent | undefined>;
  /**
   * Fired repeatedly during the map's pitch (tilt) animation between
   * one state and another as the result of either user interaction
   * or methods such as {@link Map#flyTo}.
   */
  pitch: MapLibreEvent<MouseEvent | TouchEvent | undefined>;
  /**
   * Fired immediately after the map's pitch (tilt) finishes changing as
   * the result of either user interaction or methods such as {@link Map#flyTo}.
   */
  pitchend: MapLibreEvent<MouseEvent | TouchEvent | undefined>;
  /**
   * Fired when a [`wheel`](https://developer.mozilla.org/en-US/docs/Web/Events/wheel) event occurs within the map.
   */
  wheel: MapWheelEvent;
};

/**
 * The base event for MapLibre
 *
 * @group Event Related
 */
export type MapLibreEvent<TOrig = unknown> = {
  type: keyof MapEventType;
  target: Map;
  originalEvent: TOrig;
};

/**
 * `MapMouseEvent` is the event type for mouse-related map events.
 *
 * @group Event Related
 *
 * @example
 * ```ts
 * // The `click` event is an example of a `MapMouseEvent`.
 * // Set up an event listener on the map.
 * map.on('click', (e) => {
 *   // The event object (e) contains information like the
 *   // coordinates of the point on the map that was clicked.
 *   console.log('A click event has occurred at ' + e.lngLat);
 * });
 * ```
 */
export class MapMouseEvent extends Event implements MapLibreEvent<MouseEvent> {
  /**
   * The event type
   */
  declare public type:
    | 'mousedown'
    | 'mouseup'
    | 'click'
    | 'dblclick'
    | 'mousemove'
    | 'mouseover'
    | 'mouseout'
    | 'contextmenu';

  /**
   * The `Map` object that fired the event.
   */
  target: Map;

  /**
   * The DOM event which caused the map event.
   */
  originalEvent: MouseEvent;

  /**
   * The pixel coordinates of the mouse cursor, relative to the map and measured from the top left corner.
   */
  point: Point;

  /**
   * The geographic location on the map of the mouse cursor.
   */
  lngLat: LngLat;

  /**
   * Prevents subsequent default processing of the event by the map.
   *
   * Calling this method will prevent the following default map behaviors:
   *
   *   * On `mousedown` events, the behavior of {@link DragPanHandler}
   *   * On `mousedown` events, the behavior of {@link DragRotateHandler}
   *   * On `mousedown` events, the behavior of {@link BoxZoomHandler}
   *   * On `dblclick` events, the behavior of {@link DoubleClickZoomHandler}
   *
   */
  preventDefault() {
    this._defaultPrevented = true;
  }

  /**
   * `true` if `preventDefault` has been called.
   */
  get defaultPrevented(): boolean {
    return this._defaultPrevented;
  }

  _defaultPrevented: boolean;

  constructor(type: string, map: Map, originalEvent: MouseEvent, data: any = {}) {
    super(type, data);
    const point = DOM.mousePos(map.getCanvasContainer(), originalEvent);
    const lngLat = map.unproject(point);
    this.point = point;
    this.lngLat = lngLat;
    this.originalEvent = originalEvent;
    this._defaultPrevented = false;
    this.target = map;
  }
}

/**
 * `MapTouchEvent` is the event type for touch-related map events.
 *
 * @group Event Related
 */
export class MapTouchEvent extends Event implements MapLibreEvent<TouchEvent> {
  /**
   * The event type.
   */
  declare public type: 'touchstart' | 'touchmove' | 'touchend' | 'touchcancel';

  /**
   * The `Map` object that fired the event.
   */
  target: Map;

  /**
   * The DOM event which caused the map event.
   */
  originalEvent: TouchEvent;

  /**
   * The geographic location on the map of the center of the touch event points.
   */
  lngLat: LngLat;

  /**
   * The pixel coordinates of the center of the touch event points, relative to the map and measured from the top left
   * corner.
   */
  point: Point;

  /**
   * The array of pixel coordinates corresponding to a
   * [touch event's `touches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/touches) property.
   */
  points: Array<Point>;

  /**
   * The geographical locations on the map corresponding to a
   * [touch event's `touches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/touches) property.
   */
  lngLats: Array<LngLat>;

  /**
   * Prevents subsequent default processing of the event by the map.
   *
   * Calling this method will prevent the following default map behaviors:
   *
   *   * On `touchstart` events, the behavior of {@link DragPanHandler}
   *   * On `touchstart` events, the behavior of {@link TwoFingersTouchZoomRotateHandler}
   *
   */
  preventDefault() {
    this._defaultPrevented = true;
  }

  /**
   * `true` if `preventDefault` has been called.
   */
  get defaultPrevented(): boolean {
    return this._defaultPrevented;
  }

  _defaultPrevented: boolean;

  constructor(type: string, map: Map, originalEvent: TouchEvent) {
    super(type);
    const touches = type === 'touchend' ? originalEvent.changedTouches : originalEvent.touches;
    const points = DOM.touchPos(map.getCanvasContainer(), touches);
    const lngLats = points.map((t) => map.unproject(t));
    const point = points.reduce(
      (prev, curr, i, arr) => {
        return prev.add(curr.div(arr.length));
      },
      new Point(0, 0),
    );
    const lngLat = map.unproject(point);

    this.target = map;
    this.points = points;
    this.point = point;
    this.lngLats = lngLats;
    this.lngLat = lngLat;
    this.originalEvent = originalEvent;
    this._defaultPrevented = false;
  }
}

/**
 * `MapWheelEvent` is the event type for the `wheel` map event.
 *
 * @group Event Related
 *
 */
export class MapWheelEvent extends Event {
  /**
   * The event type
   */
  declare public type: 'wheel';
  /**
   * The `Map` object that fired the event.
   */
  target: Map;

  /**
   * The DOM event which caused the map event.
   */
  originalEvent: WheelEvent;

  /**
   * Prevents subsequent default processing of the event by the map.
   *
   * Calling this method will prevent the behavior of {@link ScrollZoomHandler}.
   */
  preventDefault() {
    this._defaultPrevented = true;
  }

  /**
   * `true` if `preventDefault` has been called.
   */
  get defaultPrevented(): boolean {
    return this._defaultPrevented;
  }

  _defaultPrevented: boolean;

  /** */
  constructor(type: string, map: Map, originalEvent: WheelEvent) {
    super(type);
    this.target = map;
    this._defaultPrevented = false;
    this.originalEvent = originalEvent;
  }
}

/**
 * A `MapLibreZoomEvent` is the event type for the boxzoom-related map events emitted by the {@link BoxZoomHandler}.
 *
 * @group Event Related
 */
export type MapLibreZoomEvent = {
  /**
   * The type of boxzoom event. One of `boxzoomstart`, `boxzoomend` or `boxzoomcancel`
   */
  type: 'boxzoomstart' | 'boxzoomend' | 'boxzoomcancel';
  /**
   * The `Map` instance that triggered the event
   */
  target: Map;
  /**
   * The DOM event that triggered the boxzoom event. Can be a `MouseEvent` or `KeyboardEvent`
   */
  originalEvent: MouseEvent;
};
