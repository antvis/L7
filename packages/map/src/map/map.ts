import Point from '@mapbox/point-geometry';
import { Camera } from './camera';
import type { MapEventType } from './events';
import { LngLat } from './geo/lng_lat';
import { LngLatBounds } from './geo/lng_lat_bounds';
import { Transform } from './geo/transform';
import { HandlerManager } from './handler_manager';
import { browser } from './util/browser';
import { DOM } from './util/dom';
import type { Listener } from './util/evented';
import { Event } from './util/evented';
import { TaskQueue } from './util/task_queue';
import type { Complete } from './util/util';
import { extend, uniqueId } from './util/util';

import './css/l7.css';

import { lodashUtil } from '@antv/l7-utils';
import type { CameraOptions, FitBoundsOptions, PointLike } from './camera';
import type { LngLatLike } from './geo/lng_lat';
import type { LngLatBoundsLike } from './geo/lng_lat_bounds';
import type { BoxZoomHandler } from './handler/box_zoom';
import type { CooperativeGesturesHandler, GestureOptions } from './handler/cooperative_gestures';
import type { KeyboardHandler } from './handler/keyboard';
import type { ScrollZoomHandler } from './handler/scroll_zoom';
import type { DoubleClickZoomHandler } from './handler/shim/dblclick_zoom';
import type { DragPanHandler, DragPanOptions } from './handler/shim/drag_pan';
import type { DragRotateHandler } from './handler/shim/drag_rotate';
import type { TwoFingersTouchZoomRotateHandler } from './handler/shim/two_fingers_touch';
import type { AroundCenterOptions, TwoFingersTouchPitchHandler } from './handler/two_fingers_touch';
import type { TaskID } from './util/task_queue';

/**
 * The {@link Map} options object.
 */
export type MapOptions = {
  /**
   * If `false`, no mouse, touch, or keyboard listeners will be attached to the map, so it will not respond to interaction.
   * @defaultValue true
   */
  interactive?: boolean;
  /**
   * The HTML element in which MapLibre GL JS will render the map, or the element's string `id`. The specified element must have no children.
   */
  container: HTMLElement | string;
  /**
   * The threshold, measured in degrees, that determines when the map's
   * bearing will snap to north. For example, with a `bearingSnap` of 7, if the user rotates
   * the map within 7 degrees of north, the map will automatically snap to exact north.
   * @defaultValue 7
   */
  bearingSnap?: number;
  /**
   * If set, the map will be constrained to the given bounds.
   */
  maxBounds?: LngLatBoundsLike;
  /**
   * If `true`, the "scroll to zoom" interaction is enabled. {@link AroundCenterOptions} are passed as options to {@link ScrollZoomHandler#enable}.
   * @defaultValue true
   */
  scrollZoom?: boolean | AroundCenterOptions;
  /**
   * The minimum zoom level of the map (0-24).
   * @defaultValue 0
   */
  minZoom?: number | null;
  /**
   * The maximum zoom level of the map (0-24).
   * @defaultValue 22
   */
  maxZoom?: number | null;
  /**
   * The minimum pitch of the map (0-85). Values greater than 60 degrees are experimental and may result in rendering issues. If you encounter any, please raise an issue with details in the MapLibre project.
   * @defaultValue 0
   */
  minPitch?: number | null;
  /**
   * The maximum pitch of the map (0-85). Values greater than 60 degrees are experimental and may result in rendering issues. If you encounter any, please raise an issue with details in the MapLibre project.
   * @defaultValue 60
   */
  maxPitch?: number | null;
  /**
   * If `true`, the "box zoom" interaction is enabled (see {@link BoxZoomHandler}).
   * @defaultValue true
   */
  boxZoom?: boolean;
  /**
   * If `true`, the "drag to rotate" interaction is enabled (see {@link DragRotateHandler}).
   * @defaultValue true
   */
  dragRotate?: boolean;
  /**
   * If `true`, the "drag to pan" interaction is enabled. An `Object` value is passed as options to {@link DragPanHandler#enable}.
   * @defaultValue true
   */
  dragPan?: boolean | DragPanOptions;
  /**
   * If `true`, keyboard shortcuts are enabled (see {@link KeyboardHandler}).
   * @defaultValue true
   */
  keyboard?: boolean;
  /**
   * If `true`, the "double click to zoom" interaction is enabled (see {@link DoubleClickZoomHandler}).
   * @defaultValue true
   */
  doubleClickZoom?: boolean;
  /**
   * If `true`, the "pinch to rotate and zoom" interaction is enabled. An `Object` value is passed as options to {@link TwoFingersTouchZoomRotateHandler#enable}.
   * @defaultValue true
   */
  touchZoomRotate?: boolean | AroundCenterOptions;
  /**
   * If `true`, the "drag to pitch" interaction is enabled. An `Object` value is passed as options to {@link TwoFingersTouchPitchHandler#enable}.
   * @defaultValue true
   */
  touchPitch?: boolean | AroundCenterOptions;
  /**
   * If `true` or set to an options object, the map is only accessible on desktop while holding Command/Ctrl and only accessible on mobile with two fingers. Interacting with the map using normal gestures will trigger an informational screen. With this option enabled, "drag to pitch" requires a three-finger gesture. Cooperative gestures are disabled when a map enters fullscreen using {@link FullscreenControl}.
   * @defaultValue false
   */
  cooperativeGestures?: GestureOptions;
  /**
   * If `true`, the map will automatically resize when the browser window resizes.
   * @defaultValue true
   */
  trackResize?: boolean;
  /**
   * The initial geographical centerpoint of the map. If `center` is not specified in the constructor options, MapLibre GL JS will look for it in the map's style object. If it is not specified in the style, either, it will default to `[0, 0]` Note: MapLibre GL JS uses longitude, latitude coordinate order (as opposed to latitude, longitude) to match GeoJSON.
   * @defaultValue [0, 0]
   */
  center?: LngLatLike;
  /**
   * The initial zoom level of the map. If `zoom` is not specified in the constructor options, MapLibre GL JS will look for it in the map's style object. If it is not specified in the style, either, it will default to `0`.
   * @defaultValue 0
   */
  zoom?: number;
  /**
   * The initial bearing (rotation) of the map, measured in degrees counter-clockwise from north. If `bearing` is not specified in the constructor options, MapLibre GL JS will look for it in the map's style object. If it is not specified in the style, either, it will default to `0`.
   * @defaultValue 0
   */
  bearing?: number;
  /**
   * The initial pitch (tilt) of the map, measured in degrees away from the plane of the screen (0-85). If `pitch` is not specified in the constructor options, MapLibre GL JS will look for it in the map's style object. If it is not specified in the style, either, it will default to `0`. Values greater than 60 degrees are experimental and may result in rendering issues. If you encounter any, please raise an issue with details in the MapLibre project.
   * @defaultValue 0
   */
  pitch?: number;
  /**
   * If `true`, multiple copies of the world will be rendered side by side beyond -180 and 180 degrees longitude. If set to `false`:
   *
   * - When the map is zoomed out far enough that a single representation of the world does not fill the map's entire
   * container, there will be blank space beyond 180 and -180 degrees longitude.
   * - Features that cross 180 and -180 degrees longitude will be cut in two (with one portion on the right edge of the
   * map and the other on the left edge of the map) at every zoom level.
   * @defaultValue true
   */
  renderWorldCopies?: boolean;
  /**
   * Controls the duration of the fade-in/fade-out animation for label collisions after initial map load, in milliseconds. This setting affects all symbol layers. This setting does not affect the duration of runtime styling transitions or raster tile cross-fading.
   * @defaultValue 300
   */
  fadeDuration?: number;
  /**
   * The max number of pixels a user can shift the mouse pointer during a click for it to be considered a valid click (as opposed to a mouse drag).
   * @defaultValue 3
   */
  clickTolerance?: number;
  /**
   * The initial bounds of the map. If `bounds` is specified, it overrides `center` and `zoom` constructor options.
   */
  bounds?: LngLatBoundsLike;
  /**
   * A {@link FitBoundsOptions} options object to use _only_ when fitting the initial `bounds` provided above.
   */
  fitBoundsOptions?: FitBoundsOptions;
  /**
   * If `false`, the map's pitch (tilt) control with "drag to rotate" interaction will be disabled.
   * @defaultValue true
   */
  pitchWithRotate?: boolean;
};

// This type is used inside map since all properties are assigned a default value.
export type CompleteMapOptions = Complete<MapOptions>;

const defaultMinZoom = -2;
const defaultMaxZoom = 22;

// the default values, but also the valid range
const defaultMinPitch = 0;
const defaultMaxPitch = 60;

// use this variable to check maxPitch for validity
const maxPitchThreshold = 85;

const defaultOptions: Readonly<Partial<MapOptions>> = {
  interactive: true,
  bearingSnap: 7,

  scrollZoom: true,
  minZoom: defaultMinZoom,
  maxZoom: defaultMaxZoom,
  minPitch: defaultMinPitch,
  maxPitch: defaultMaxPitch,

  boxZoom: true,
  dragRotate: true,
  dragPan: true,
  keyboard: true,
  doubleClickZoom: true,
  touchZoomRotate: true,
  touchPitch: true,
  cooperativeGestures: false,

  trackResize: true,

  center: [0, 0],
  zoom: 0,
  bearing: 0,
  pitch: 0,

  renderWorldCopies: true,
  fadeDuration: 300,
  clickTolerance: 3,
  pitchWithRotate: true,
};

/**
 * The `Map` object represents the map on your page. It exposes methods
 * and properties that enable you to programmatically change the map,
 * and fires events as users interact with it.
 *
 * You create a `Map` by specifying a `container` and other options, see {@link MapOptions} for the full list.
 * Then MapLibre GL JS initializes the map on the page and returns your `Map` object.
 *
 * @group Main
 *
 * @example
 * ```ts
 * let map = new Map({
 *   container: 'map',
 *   center: [-122.420679, 37.772537],
 *   zoom: 13,
 * });
 * ```
 */
export class Map extends Camera {
  _container: HTMLElement;
  _canvasContainer: HTMLElement;
  _interactive: boolean;
  _frameRequest: AbortController;

  _loaded: boolean;
  _idleTriggered = false;
  // accounts for placement finishing as well
  _fullyLoaded: boolean;
  _trackResize: boolean;
  _resizeObserver: ResizeObserver;
  _preserveDrawingBuffer: boolean;
  _failIfMajorPerformanceCaveat: boolean;
  _fadeDuration: number;
  _crossSourceCollisions: boolean;
  _crossFadingFactor = 1;
  _collectResourceTiming: boolean;
  _renderTaskQueue = new TaskQueue();
  _mapId = uniqueId();
  _removed: boolean;
  _clickTolerance: number;

  /**
   * The map's {@link ScrollZoomHandler}, which implements zooming in and out with a scroll wheel or trackpad.
   * Find more details and examples using `scrollZoom` in the {@link ScrollZoomHandler} section.
   */
  scrollZoom: ScrollZoomHandler;

  /**
   * The map's {@link BoxZoomHandler}, which implements zooming using a drag gesture with the Shift key pressed.
   * Find more details and examples using `boxZoom` in the {@link BoxZoomHandler} section.
   */
  boxZoom: BoxZoomHandler;

  /**
   * The map's {@link DragRotateHandler}, which implements rotating the map while dragging with the right
   * mouse button or with the Control key pressed. Find more details and examples using `dragRotate`
   * in the {@link DragRotateHandler} section.
   */
  dragRotate: DragRotateHandler;

  /**
   * The map's {@link DragPanHandler}, which implements dragging the map with a mouse or touch gesture.
   * Find more details and examples using `dragPan` in the {@link DragPanHandler} section.
   */
  dragPan: DragPanHandler;

  /**
   * The map's {@link KeyboardHandler}, which allows the user to zoom, rotate, and pan the map using keyboard
   * shortcuts. Find more details and examples using `keyboard` in the {@link KeyboardHandler} section.
   */
  keyboard: KeyboardHandler;

  /**
   * The map's {@link DoubleClickZoomHandler}, which allows the user to zoom by double clicking.
   * Find more details and examples using `doubleClickZoom` in the {@link DoubleClickZoomHandler} section.
   */
  doubleClickZoom: DoubleClickZoomHandler;

  /**
   * The map's {@link TwoFingersTouchZoomRotateHandler}, which allows the user to zoom or rotate the map with touch gestures.
   * Find more details and examples using `touchZoomRotate` in the {@link TwoFingersTouchZoomRotateHandler} section.
   */
  touchZoomRotate: TwoFingersTouchZoomRotateHandler;

  /**
   * The map's {@link TwoFingersTouchPitchHandler}, which allows the user to pitch the map with touch gestures.
   * Find more details and examples using `touchPitch` in the {@link TwoFingersTouchPitchHandler} section.
   */
  touchPitch: TwoFingersTouchPitchHandler;

  /**
   * The map's {@link CooperativeGesturesHandler}, which allows the user to see cooperative gesture info when user tries to zoom in/out.
   * Find more details and examples using `cooperativeGestures` in the {@link CooperativeGesturesHandler} section.
   */
  cooperativeGestures: CooperativeGesturesHandler;

  constructor(options: MapOptions) {
    const resolvedOptions = { ...defaultOptions, ...options } as CompleteMapOptions;

    if (
      resolvedOptions.minZoom != null &&
      resolvedOptions.maxZoom != null &&
      resolvedOptions.minZoom > resolvedOptions.maxZoom
    ) {
      throw new Error('maxZoom must be greater than or equal to minZoom');
    }

    if (
      resolvedOptions.minPitch != null &&
      resolvedOptions.maxPitch != null &&
      resolvedOptions.minPitch > resolvedOptions.maxPitch
    ) {
      throw new Error('maxPitch must be greater than or equal to minPitch');
    }

    if (resolvedOptions.minPitch != null && resolvedOptions.minPitch < defaultMinPitch) {
      throw new Error(`minPitch must be greater than or equal to ${defaultMinPitch}`);
    }

    if (resolvedOptions.maxPitch != null && resolvedOptions.maxPitch > maxPitchThreshold) {
      throw new Error(`maxPitch must be less than or equal to ${maxPitchThreshold}`);
    }

    const transform = new Transform(
      resolvedOptions.minZoom!,
      resolvedOptions.maxZoom!,
      resolvedOptions.minPitch!,
      resolvedOptions.maxPitch!,
      resolvedOptions.renderWorldCopies,
    );
    super(transform, { bearingSnap: resolvedOptions.bearingSnap! });

    this._interactive = resolvedOptions.interactive!;
    this._trackResize = resolvedOptions.trackResize === true;
    this._bearingSnap = resolvedOptions.bearingSnap!;
    this._fadeDuration = resolvedOptions.fadeDuration!;
    this._clickTolerance = resolvedOptions.clickTolerance!;

    if (typeof resolvedOptions.container === 'string') {
      this._container = document.getElementById(resolvedOptions.container)!;
      if (!this._container) {
        throw new Error(`Container '${resolvedOptions.container}' not found.`);
      }
    } else if (resolvedOptions.container instanceof HTMLElement) {
      this._container = resolvedOptions.container;
    } else {
      throw new Error("Invalid type: 'container' must be a String or HTMLElement.");
    }

    if (resolvedOptions.maxBounds) {
      this.setMaxBounds(resolvedOptions.maxBounds);
    }

    this._setupContainer();

    this.on('move', () => this._update())
      .on('moveend', () => this._update())
      .on('zoom', () => this._update())
      .once('idle', () => {
        this._idleTriggered = true;
      });

    if (typeof window !== 'undefined') {
      let initialResizeEventCaptured = false;
      const throttledResizeCallback = lodashUtil.throttle((entries: ResizeObserverEntry[]) => {
        if (this._trackResize && !this._removed) {
          this.resize(entries)._update();
        }
      }, 50);
      this._resizeObserver = new ResizeObserver((entries) => {
        if (!initialResizeEventCaptured) {
          initialResizeEventCaptured = true;
          return;
        }
        throttledResizeCallback(entries);
      });
      this._resizeObserver.observe(this._container);
    }

    this.handlers = new HandlerManager(this, resolvedOptions);

    this.jumpTo({
      center: resolvedOptions.center,
      zoom: resolvedOptions.zoom,
      bearing: resolvedOptions.bearing,
      pitch: resolvedOptions.pitch,
    });

    if (resolvedOptions.bounds) {
      this.resize();
      this.fitBounds(
        resolvedOptions.bounds,
        extend({}, resolvedOptions.fitBoundsOptions, { duration: 0 }),
      );
    }

    this.resize();
  }

  /**
   * @internal
   * Returns a unique number for this map instance which is used for the MapLoadEvent
   * to make sure we only fire one event per instantiated map object.
   * @returns the uniq map ID
   */
  _getMapId() {
    return this._mapId;
  }

  calculateCameraOptionsFromTo(
    from: LngLat,
    altitudeFrom: number,
    to: LngLat,
    altitudeTo?: number,
  ): CameraOptions {
    return super.calculateCameraOptionsFromTo(from, altitudeFrom, to, altitudeTo);
  }

  /**
   * Resizes the map according to the dimensions of its
   * `container` element.
   *
   * Checks if the map container size changed and updates the map if it has changed.
   * This method must be called after the map's `container` is resized programmatically
   * or when the map is shown after being initially hidden with CSS.
   *
   * Triggers the following events: `movestart`, `move`, `moveend`, and `resize`.
   *
   * @param eventData - Additional properties to be passed to `movestart`, `move`, `resize`, and `moveend`
   * events that get triggered as a result of resize. This can be useful for differentiating the
   * source of an event (for example, user-initiated or programmatically-triggered events).
   * @example
   * Resize the map when the map container is shown after being initially hidden with CSS.
   * ```ts
   * let mapDiv = document.getElementById('map');
   * if (mapDiv.style.visibility === true) map.resize();
   * ```
   */
  resize(eventData?: any): Map {
    const dimensions = this._containerDimensions();
    const width = dimensions[0];
    const height = dimensions[1];

    this.transform.resize(width, height);
    this._requestedCameraState?.resize(width, height);

    const fireMoving = !this._moving;
    if (fireMoving) {
      this.stop();
      this.fire(new Event('movestart', eventData)).fire(new Event('move', eventData));
    }

    this.fire(new Event('resize', eventData));

    if (fireMoving) this.fire(new Event('moveend', eventData));

    return this;
  }

  /**
   * Returns the map's geographical bounds. When the bearing or pitch is non-zero, the visible region is not
   * an axis-aligned rectangle, and the result is the smallest bounds that encompasses the visible region.
   * @returns The geographical bounds of the map as {@link LngLatBounds}.
   * @example
   * ```ts
   * let bounds = map.getBounds();
   * ```
   */
  getBounds(): LngLatBounds {
    return this.transform.getBounds();
  }

  /**
   * Returns the maximum geographical bounds the map is constrained to, or `null` if none set.
   * @returns The map object.
   * @example
   * ```ts
   * let maxBounds = map.getMaxBounds();
   * ```
   */
  getMaxBounds(): LngLatBounds | null {
    return this.transform.getMaxBounds();
  }

  /**
   * Sets or clears the map's geographical bounds.
   *
   * Pan and zoom operations are constrained within these bounds.
   * If a pan or zoom is performed that would
   * display regions outside these bounds, the map will
   * instead display a position and zoom level
   * as close as possible to the operation's request while still
   * remaining within the bounds.
   *
   * @param bounds - The maximum bounds to set. If `null` or `undefined` is provided, the function removes the map's maximum bounds.
   * @example
   * Define bounds that conform to the `LngLatBoundsLike` object as set the max bounds.
   * ```ts
   * let bounds = [
   *   [-74.04728, 40.68392], // [west, south]
   *   [-73.91058, 40.87764]  // [east, north]
   * ];
   * map.setMaxBounds(bounds);
   * ```
   */
  setMaxBounds(bounds?: LngLatBoundsLike | null): Map {
    this.transform.setMaxBounds(bounds && LngLatBounds.convert(bounds));
    return this._update();
  }

  /**
   * Sets or clears the map's minimum zoom level.
   * If the map's current zoom level is lower than the new minimum,
   * the map will zoom to the new minimum.
   *
   * It is not always possible to zoom out and reach the set `minZoom`.
   * Other factors such as map height may restrict zooming. For example,
   * if the map is 512px tall it will not be possible to zoom below zoom 0
   * no matter what the `minZoom` is set to.
   *
   * A {@link ErrorEvent} event will be fired if minZoom is out of bounds.
   *
   * @param minZoom - The minimum zoom level to set (-2 - 24).
   * If `null` or `undefined` is provided, the function removes the current minimum zoom (i.e. sets it to -2).
   * @example
   * ```ts
   * map.setMinZoom(12.25);
   * ```
   */
  setMinZoom(minZoom?: number | null): Map {
    minZoom = minZoom === null || minZoom === undefined ? defaultMinZoom : minZoom;

    if (minZoom >= defaultMinZoom && minZoom <= this.transform.maxZoom) {
      this.transform.minZoom = minZoom;
      this._update();

      if (this.getZoom() < minZoom) this.setZoom(minZoom);

      return this;
    } else
      throw new Error(
        `minZoom must be between ${defaultMinZoom} and the current maxZoom, inclusive`,
      );
  }

  /**
   * Returns the map's minimum allowable zoom level.
   *
   * @returns minZoom
   * @example
   * ```ts
   * let minZoom = map.getMinZoom();
   * ```
   */
  getMinZoom(): number {
    return this.transform.minZoom;
  }

  /**
   * Sets or clears the map's maximum zoom level.
   * If the map's current zoom level is higher than the new maximum,
   * the map will zoom to the new maximum.
   *
   * A {@link ErrorEvent} event will be fired if minZoom is out of bounds.
   *
   * @param maxZoom - The maximum zoom level to set.
   * If `null` or `undefined` is provided, the function removes the current maximum zoom (sets it to 22).
   * @example
   * ```ts
   * map.setMaxZoom(18.75);
   * ```
   */
  setMaxZoom(maxZoom?: number | null): Map {
    maxZoom = maxZoom === null || maxZoom === undefined ? defaultMaxZoom : maxZoom;

    if (maxZoom >= this.transform.minZoom) {
      this.transform.maxZoom = maxZoom;

      if (this.getZoom() > maxZoom) this.setZoom(maxZoom);

      return this;
    } else throw new Error('maxZoom must be greater than the current minZoom');
  }

  /**
   * Returns the map's maximum allowable zoom level.
   *
   * @returns The maxZoom
   * @example
   * ```ts
   * let maxZoom = map.getMaxZoom();
   * ```
   */
  getMaxZoom(): number {
    return this.transform.maxZoom;
  }

  /**
   * Sets or clears the map's minimum pitch.
   * If the map's current pitch is lower than the new minimum,
   * the map will pitch to the new minimum.
   *
   * A {@link ErrorEvent} event will be fired if minPitch is out of bounds.
   *
   * @param minPitch - The minimum pitch to set (0-85). Values greater than 60 degrees are experimental and may result in rendering issues. If you encounter any, please raise an issue with details in the MapLibre project.
   * If `null` or `undefined` is provided, the function removes the current minimum pitch (i.e. sets it to 0).
   */
  setMinPitch(minPitch?: number | null): Map {
    minPitch = minPitch === null || minPitch === undefined ? defaultMinPitch : minPitch;

    if (minPitch < defaultMinPitch) {
      throw new Error(`minPitch must be greater than or equal to ${defaultMinPitch}`);
    }

    if (minPitch >= defaultMinPitch && minPitch <= this.transform.maxPitch) {
      this.transform.minPitch = minPitch;

      if (this.getPitch() < minPitch) this.setPitch(minPitch);

      return this;
    } else
      throw new Error(
        `minPitch must be between ${defaultMinPitch} and the current maxPitch, inclusive`,
      );
  }

  /**
   * Returns the map's minimum allowable pitch.
   *
   * @returns The minPitch
   */
  getMinPitch(): number {
    return this.transform.minPitch;
  }

  /**
   * Sets or clears the map's maximum pitch.
   * If the map's current pitch is higher than the new maximum,
   * the map will pitch to the new maximum.
   *
   * A {@link ErrorEvent} event will be fired if maxPitch is out of bounds.
   *
   * @param maxPitch - The maximum pitch to set (0-85). Values greater than 60 degrees are experimental and may result in rendering issues. If you encounter any, please raise an issue with details in the MapLibre project.
   * If `null` or `undefined` is provided, the function removes the current maximum pitch (sets it to 60).
   */
  setMaxPitch(maxPitch?: number | null): Map {
    maxPitch = maxPitch === null || maxPitch === undefined ? defaultMaxPitch : maxPitch;

    if (maxPitch > maxPitchThreshold) {
      throw new Error(`maxPitch must be less than or equal to ${maxPitchThreshold}`);
    }

    if (maxPitch >= this.transform.minPitch) {
      this.transform.maxPitch = maxPitch;

      if (this.getPitch() > maxPitch) this.setPitch(maxPitch);

      return this;
    } else throw new Error('maxPitch must be greater than the current minPitch');
  }

  /**
   * Returns the map's maximum allowable pitch.
   *
   * @returns The maxPitch
   */
  getMaxPitch(): number {
    return this.transform.maxPitch;
  }

  /**
   * Returns the state of `renderWorldCopies`. If `true`, multiple copies of the world will be rendered side by side beyond -180 and 180 degrees longitude. If set to `false`:
   *
   * - When the map is zoomed out far enough that a single representation of the world does not fill the map's entire
   * container, there will be blank space beyond 180 and -180 degrees longitude.
   * - Features that cross 180 and -180 degrees longitude will be cut in two (with one portion on the right edge of the
   * map and the other on the left edge of the map) at every zoom level.
   * @returns The renderWorldCopies
   * @example
   * ```ts
   * let worldCopiesRendered = map.getRenderWorldCopies();
   * ```
   * @see [Render world copies](https://maplibre.org/maplibre-gl-js/docs/examples/render-world-copies/)
   */
  getRenderWorldCopies(): boolean {
    return this.transform.renderWorldCopies;
  }

  /**
   * Sets the state of `renderWorldCopies`.
   *
   * @param renderWorldCopies - If `true`, multiple copies of the world will be rendered side by side beyond -180 and 180 degrees longitude. If set to `false`:
   *
   * - When the map is zoomed out far enough that a single representation of the world does not fill the map's entire
   * container, there will be blank space beyond 180 and -180 degrees longitude.
   * - Features that cross 180 and -180 degrees longitude will be cut in two (with one portion on the right edge of the
   * map and the other on the left edge of the map) at every zoom level.
   *
   * `undefined` is treated as `true`, `null` is treated as `false`.
   * @example
   * ```ts
   * map.setRenderWorldCopies(true);
   * ```
   */
  setRenderWorldCopies(renderWorldCopies?: boolean | null) {
    this.transform.renderWorldCopies = renderWorldCopies;
  }

  /**
   * Returns a [Point](https://github.com/mapbox/point-geometry) representing pixel coordinates, relative to the map's `container`,
   * that correspond to the specified geographical location.
   *
   * @param lnglat - The geographical location to project.
   * @returns The [Point](https://github.com/mapbox/point-geometry) corresponding to `lnglat`, relative to the map's `container`.
   * @example
   * ```ts
   * let coordinate = [-122.420679, 37.772537];
   * let point = map.project(coordinate);
   * ```
   */
  project(lnglat: LngLatLike): Point {
    return this.transform.locationPoint(LngLat.convert(lnglat));
  }

  /**
   * Returns a {@link LngLat} representing geographical coordinates that correspond
   * to the specified pixel coordinates.
   *
   * @param point - The pixel coordinates to unproject.
   * @returns The {@link LngLat} corresponding to `point`.
   * @example
   * ```ts
   * map.on('click', (e) => {
   *   // When the map is clicked, get the geographic coordinate.
   *   let coordinate = map.unproject(e.point);
   * });
   * ```
   */
  unproject(point: PointLike): LngLat {
    return this.transform.pointLocation(Point.convert(point));
  }

  /**
   * Returns true if the map is panning, zooming, rotating, or pitching due to a camera animation or user gesture.
   * @returns true if the map is moving.
   * @example
   * ```ts
   * let isMoving = map.isMoving();
   * ```
   */
  isMoving(): boolean {
    return this._moving || this.handlers?.isMoving();
  }

  /**
   * Returns true if the map is zooming due to a camera animation or user gesture.
   * @returns true if the map is zooming.
   * @example
   * ```ts
   * let isZooming = map.isZooming();
   * ```
   */
  isZooming(): boolean {
    return this._zooming || this.handlers?.isZooming();
  }

  /**
   * Returns true if the map is rotating due to a camera animation or user gesture.
   * @returns true if the map is rotating.
   * @example
   * ```ts
   * map.isRotating();
   * ```
   */
  isRotating(): boolean {
    return this._rotating || this.handlers?.isRotating();
  }

  /**
   * Overload of the `on` method that allows to listen to events without specifying a layer.
   * @event
   * @param type - The type of the event.
   * @param listener - The listener callback.
   */
  on<T extends keyof MapEventType>(type: T, listener: (ev: MapEventType[T] & Object) => void): this;
  /**
   * Overload of the `on` method that allows to listen to events without specifying a layer.
   * @event
   * @param type - The type of the event.
   * @param listener - The listener callback.
   */
  on(type: keyof MapEventType | string, listener: Listener): this;
  on(type: keyof MapEventType | string, listener: Listener): this {
    return super.on(type, listener);
  }

  /**
   * Overload of the `once` method that allows to listen to events without specifying a layer.
   * @event
   * @param type - The type of the event.
   * @param listener - The listener callback.
   */
  once<T extends keyof MapEventType>(
    type: T,
    listener?: (ev: MapEventType[T] & Object) => void,
  ): this | Promise<any>;
  /**
   * Overload of the `once` method that allows to listen to events without specifying a layer.
   * @event
   * @param type - The type of the event.
   * @param listener - The listener callback.
   */
  once(type: keyof MapEventType | string, listener?: Listener): this | Promise<any>;
  once(type: keyof MapEventType | string, listener?: Listener): this | Promise<any> {
    return super.once(type, listener);
  }

  /**
   * Overload of the `off` method that allows to listen to events without specifying a layer.
   * @event
   * @param type - The type of the event.
   * @param listener - The function previously installed as a listener.
   */
  off<T extends keyof MapEventType>(
    type: T,
    listener: (ev: MapEventType[T] & Object) => void,
  ): this;
  /**
   * Overload of the `off` method that allows to listen to events without specifying a layer.
   * @event
   * @param type - The type of the event.
   * @param listener - The function previously installed as a listener.
   */
  off(type: keyof MapEventType | string, listener: Listener): this;
  off(type: keyof MapEventType | string, listener: Listener): this {
    return super.off(type, listener);
  }

  /**
   * Returns the map's containing HTML element.
   *
   * @returns The map's container.
   */
  getContainer(): HTMLElement {
    return this._container;
  }

  /**
   * Returns the HTML element containing the map's `<canvas>` element.
   *
   * If you want to add non-GL overlays to the map, you should append them to this element.
   *
   * This is the element to which event bindings for map interactivity (such as panning and zooming) are
   * attached. It will receive bubbled events from child elements such as the `<canvas>`, but not from
   * map controls.
   *
   * @returns The container of the map's `<canvas>`.
   * @see [Create a draggable point](https://maplibre.org/maplibre-gl-js/docs/examples/drag-a-point/)
   */
  getCanvasContainer(): HTMLElement {
    return this._canvasContainer;
  }

  _containerDimensions() {
    let width = 0;
    let height = 0;

    if (this._container) {
      width = this._container.clientWidth || 400;
      height = this._container.clientHeight || 300;
    }

    return [width, height];
  }

  _setupContainer() {
    const container = this._container;
    container.classList.add('l7-map');

    const canvasContainer = (this._canvasContainer = DOM.create(
      'div',
      'l7-canvas-container',
      container,
    ));
    if (this._interactive) {
      canvasContainer.classList.add('l7-interactive');
    }

    this._container.addEventListener('scroll', this._onMapScroll, false);
  }

  _onMapScroll = (event: any) => {
    if (event.target !== this._container) return;

    // Revert any scroll which would move the canvas outside of the view
    this._container.scrollTop = 0;
    this._container.scrollLeft = 0;
    return false;
  };

  /**
   * @internal
   * Update this map's style and sources, and re-render the map.
   *
   * @param updateStyle - mark the map's style for reprocessing as
   * well as its sources
   */
  _update() {
    this.triggerRepaint();

    return this;
  }

  /**
   * @internal
   * Request that the given callback be executed during the next render
   * frame.  Schedule a render frame if one is not already scheduled.
   *
   * @returns An id that can be used to cancel the callback
   */
  _requestRenderFrame(callback: () => void): TaskID {
    this._update();
    return this._renderTaskQueue.add(callback);
  }

  _cancelRenderFrame(id: TaskID) {
    this._renderTaskQueue.remove(id);
  }

  /**
   * @internal
   * Call when a (re-)render of the map is required:
   *
   * - The style has changed (`setPaintProperty()`, etc.)
   * - Source data has changed (e.g. tiles have finished loading)
   * - The map has is moving (or just finished moving)
   * - A transition is in progress
   *
   * @param paintStartTimeStamp - The time when the animation frame began executing.
   */
  _render(paintStartTimeStamp: number) {
    this._renderTaskQueue.run(paintStartTimeStamp);
    // A task queue callback may have fired a user event which may have removed the map
    if (this._removed) return;

    this.fire(new Event('render'));

    if (!this.isMoving()) {
      this.fire(new Event('idle'));
    }

    return this;
  }

  /**
   * Clean up and release all internal resources associated with this map.
   *
   * This includes DOM elements, event bindings, web workers, and WebGL resources.
   *
   * Use this method when you are done using the map and wish to ensure that it no
   * longer consumes browser resources. Afterwards, you must not call any other
   * methods on the map.
   */
  remove() {
    if (this._frameRequest) {
      this._frameRequest.abort();
      this._frameRequest = null;
    }
    this._renderTaskQueue.clear();
    this.handlers.destroy();
    delete this.handlers;

    this._resizeObserver?.disconnect();
    DOM.remove(this._canvasContainer);
    this._container.classList.remove('l7-map');

    this._removed = true;
    this.fire(new Event('remove'));
  }

  /**
   * Trigger the rendering of a single frame. Use this method with custom layers to
   * repaint the map when the layer changes. Calling this multiple times before the
   * next frame is rendered will still result in only a single frame being rendered.
   * @example
   * ```ts
   * map.triggerRepaint();
   * ```
   */
  triggerRepaint() {
    if (!this._frameRequest) {
      this._frameRequest = new AbortController();
      browser
        .frameAsync(this._frameRequest)
        .then((paintStartTimeStamp: number) => {
          this._frameRequest = null;
          this._render(paintStartTimeStamp);
        })
        .catch(() => {}); // ignore abort error
    }
  }

  /**
   * Returns the elevation for the point where the camera is looking.
   * This value corresponds to:
   * "meters above sea level" * "exaggeration"
   * @returns The elevation.
   */
  getCameraTargetElevation(): number {
    return this.transform.elevation;
  }
}
