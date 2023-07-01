// @ts-ignore
import { EventEmitter } from 'eventemitter3';
import { merge } from 'lodash';
import { IPaddingOptions } from './geo/edge_insets';
import LngLat, { LngLatLike } from './geo/lng_lat';
import LngLatBounds, { LngLatBoundsLike } from './geo/lng_lat_bounds';
import Point, { PointLike } from './geo/point';
import Transform from './geo/transform';
import { Event } from './handler/events/event';
import { IMapOptions } from './interface';
import {
  clamp,
  ease as defaultEasing,
  extend,
  interpolate,
  now,
  pick,
  prefersReducedMotion,
  wrap,
} from './util';
type CallBack = (_: number) => void;

export interface ICameraOptions {
  center?: LngLatLike;
  zoom?: number;
  bearing?: number;
  pitch?: number;
  around?: LngLatLike;
  padding?: IPaddingOptions;
}

export interface IAnimationOptions {
  duration?: number;
  easing?: (_: number) => number;
  offset?: PointLike;
  animate?: boolean;
  essential?: boolean;
  linear?: boolean;
}

export default class Camera extends EventEmitter {
  public transform: Transform;
  // public requestRenderFrame: (_: any) => number;
  // public cancelRenderFrame: (_: number) => void;
  protected options: IMapOptions;
  protected moving: boolean;
  protected zooming: boolean;
  protected rotating: boolean;
  protected pitching: boolean;
  protected padding: boolean;

  private bearingSnap: number;
  private easeEndTimeoutID: number;
  private easeStart: number;
  private easeOptions: {
    duration: number;
    easing: (_: number) => number;
  };
  private easeId: string | void;
  private onEaseFrame: (_: number) => void;
  private onEaseEnd: (easeId?: string) => void;
  private easeFrameId: number;
  private pitchEnabled: boolean;
  private rotateEnabled: boolean;

  constructor(options: IMapOptions) {
    super();
    this.options = options;
    const { minZoom, maxZoom, minPitch, maxPitch, renderWorldCopies } = options;
    this.moving = false;
    this.zooming = false;
    this.bearingSnap = options.bearingSnap;
    this.pitchEnabled = options.pitchEnabled;
    this.rotateEnabled = options.rotateEnabled;
    this.transform = new Transform(
      minZoom,
      maxZoom,
      minPitch,
      maxPitch,
      renderWorldCopies,
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public requestRenderFrame(cb: CallBack): number {
    return 0;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public cancelRenderFrame(_: number): void {
    return;
  }

  public getCenter() {
    const { lng, lat } = this.transform.center;
    return new LngLat(lng, lat);
  }

  public getZoom(): number {
    return this.transform.zoom;
  }

  public getPitch(): number {
    return this.transform.pitch;
  }

  public setCenter(center: LngLatLike, eventData?: any) {
    return this.jumpTo({ center }, eventData);
  }

  public setPitch(pitch: number, eventData?: any) {
    this.jumpTo({ pitch }, eventData);
    return this;
  }

  public getBearing(): number {
    return this.transform.bearing;
  }

  public panTo(
    lnglat: LngLatLike,
    options?: IAnimationOptions,
    eventData?: any,
  ) {
    return this.easeTo(
      merge(
        {
          center: lnglat,
        },
        options,
      ),
      eventData,
    );
  }

  public panBy(
    offset: PointLike,
    options?: IAnimationOptions,
    eventData?: any,
  ) {
    offset = Point.convert(offset).mult(-1);
    return this.panTo(
      this.transform.center,
      extend({ offset }, options || {}),
      eventData,
    );
  }
  public zoomOut(options?: IAnimationOptions, eventData?: any) {
    this.zoomTo(this.getZoom() - 1, options, eventData);
    return this;
  }

  public setBearing(bearing: number, eventData?: any) {
    this.jumpTo({ bearing }, eventData);
    return this;
  }
  public setZoom(zoom: number, eventData?: any) {
    this.jumpTo({ zoom }, eventData);
    return this;
  }

  public zoomIn(options?: IAnimationOptions, eventData?: any) {
    this.zoomTo(this.getZoom() + 1, options, eventData);
    return this;
  }

  public zoomTo(zoom: number, options?: IAnimationOptions, eventData?: any) {
    return this.easeTo(
      merge(
        {
          zoom,
        },
        options,
      ),
      eventData,
    );
  }

  public getPadding(): IPaddingOptions {
    return this.transform.padding;
  }

  public setPadding(padding: IPaddingOptions, eventData?: any) {
    this.jumpTo({ padding }, eventData);
    return this;
  }

  public rotateTo(
    bearing: number,
    options?: IAnimationOptions,
    eventData?: any,
  ) {
    return this.easeTo(
      merge(
        {
          bearing,
        },
        options,
      ),
      eventData,
    );
  }

  public resetNorth(options?: IAnimationOptions, eventData?: any) {
    this.rotateTo(0, merge({ duration: 1000 }, options), eventData);
    return this;
  }

  public resetNorthPitch(options?: IAnimationOptions, eventData?: any) {
    this.easeTo(
      merge(
        {
          bearing: 0,
          pitch: 0,
          duration: 1000,
        },
        options,
      ),
      eventData,
    );
    return this;
  }
  public fitBounds(
    bounds: LngLatBoundsLike,
    options?: IAnimationOptions & ICameraOptions,
    eventData?: any,
  ) {
    return this.fitInternal(
      // @ts-ignore
      this.cameraForBounds(bounds, options),
      options,
      eventData,
    );
  }
  public cameraForBounds(
    bounds: LngLatBoundsLike,
    options?: ICameraOptions,
  ): void | (ICameraOptions & IAnimationOptions) {
    bounds = LngLatBounds.convert(bounds);
    return this.cameraForBoxAndBearing(
      bounds.getNorthWest(),
      bounds.getSouthEast(),
      0,
      // @ts-ignore
      options,
    );
  }

  public snapToNorth(options?: IAnimationOptions, eventData?: any) {
    if (Math.abs(this.getBearing()) < this.bearingSnap) {
      return this.resetNorth(options, eventData);
    }
    return this;
  }

  public jumpTo(options: ICameraOptions = {}, eventData?: any) {
    this.stop();

    const tr = this.transform;
    let zoomChanged = false;
    let bearingChanged = false;
    let pitchChanged = false;

    if (options.zoom !== undefined && tr.zoom !== +options.zoom) {
      zoomChanged = true;
      tr.zoom = +options.zoom;
    }

    if (options.center !== undefined) {
      tr.center = LngLat.convert(options.center);
    }

    if (options.bearing !== undefined && tr.bearing !== +options.bearing) {
      bearingChanged = true;
      tr.bearing = +options.bearing;
    }
    if (options.pitch !== undefined && tr.pitch !== +options.pitch) {
      pitchChanged = true;
      tr.pitch = +options.pitch;
    }

    if (options.padding !== undefined && !tr.isPaddingEqual(options.padding)) {
      tr.padding = options.padding;
    }

    this.emit('movestart', new Event('movestart', eventData));
    this.emit('move', new Event('move', eventData));

    if (zoomChanged) {
      this.emit('zoomstart', new Event('zoomstart', eventData));
      this.emit('zoom', new Event('zoom', eventData));
      this.emit('zoomend', new Event('zoomend', eventData));
    }

    if (bearingChanged) {
      this.emit('rotatestart', new Event('rotatestart', eventData));
      this.emit('rotate', new Event('rotate', eventData));
      this.emit('rotateend', new Event('rotateend', eventData));
    }

    if (pitchChanged) {
      this.emit('pitchstart', new Event('pitchstart', eventData));
      this.emit('pitch', new Event('pitch', eventData));
      this.emit('pitchend', new Event('pitchend', eventData));
    }

    return this.emit('moveend', new Event('moveend', eventData));
  }

  public easeTo(
    options: ICameraOptions &
      IAnimationOptions & { easeId?: string; noMoveStart?: boolean } = {},
    eventData?: any,
  ) {
    options = merge(
      {
        offset: [0, 0],
        duration: 500,
        easing: defaultEasing,
      },
      options,
    );

    if (
      options.animate === false ||
      (!options.essential && prefersReducedMotion())
    ) {
      options.duration = 0;
    }

    const tr = this.transform;
    const startZoom = this.getZoom();
    const startBearing = this.getBearing();
    const startPitch = this.getPitch();
    const startPadding = this.getPadding();

    const zoom = options.zoom ? +options.zoom : startZoom;
    const bearing = options.bearing
      ? this.normalizeBearing(options.bearing, startBearing)
      : startBearing;
    const pitch = options.pitch ? +options.pitch : startPitch;
    const padding = options.padding ? options.padding : tr.padding;

    const offsetAsPoint = Point.convert(options.offset);
    let pointAtOffset = tr.centerPoint.add(offsetAsPoint);
    const locationAtOffset = tr.pointLocation(pointAtOffset);
    const center = LngLat.convert(options.center || locationAtOffset);
    this.normalizeCenter(center);

    const from = tr.project(locationAtOffset);
    const delta = tr.project(center).sub(from);
    const finalScale = tr.zoomScale(zoom - startZoom);

    let around: LngLat;
    let aroundPoint: Point;

    if (options.around) {
      around = LngLat.convert(options.around);
      aroundPoint = tr.locationPoint(around);
    }

    const currently = {
      moving: this.moving,
      zooming: this.zooming,
      rotating: this.rotating,
      pitching: this.pitching,
    };

    this.zooming = this.zooming || zoom !== startZoom;
    this.rotating = this.rotating || startBearing !== bearing;
    this.pitching = this.pitching || pitch !== startPitch;
    this.padding = !tr.isPaddingEqual(padding);

    this.easeId = options.easeId;
    this.prepareEase(eventData, options.noMoveStart, currently);

    clearTimeout(this.easeEndTimeoutID);

    this.ease(
      (k) => {
        if (this.zooming) {
          tr.zoom = interpolate(startZoom, zoom, k);
        }
        if (this.rotating && this.rotateEnabled) {
          tr.bearing = interpolate(startBearing, bearing, k);
        }
        if (this.pitching && this.pitchEnabled) {
          tr.pitch = interpolate(startPitch, pitch, k);
        }
        if (this.padding) {
          tr.interpolatePadding(startPadding, padding, k);
          // When padding is being applied, Transform#centerPoint is changing continously,
          // thus we need to recalculate offsetPoint every fra,e
          pointAtOffset = tr.centerPoint.add(offsetAsPoint);
        }

        if (around) {
          tr.setLocationAtPoint(around, aroundPoint);
        } else {
          const scale = tr.zoomScale(tr.zoom - startZoom);
          const base =
            zoom > startZoom
              ? Math.min(2, finalScale)
              : Math.max(0.5, finalScale);
          const speedup = Math.pow(base, 1 - k);
          const newCenter = tr.unproject(
            from.add(delta.mult(k * speedup)).mult(scale),
          );
          tr.setLocationAtPoint(
            tr.renderWorldCopies ? newCenter.wrap() : newCenter,
            pointAtOffset,
          );
        }

        this.fireMoveEvents(eventData);
      },
      (interruptingEaseId?: string) => {
        this.afterEase(eventData, interruptingEaseId);
      },
      // @ts-ignore
      options,
    );

    return this;
  }
  public flyTo(options: any = {}, eventData?: any) {
    // Fall through to jumpTo if user has set prefers-reduced-motion
    if (!options.essential && prefersReducedMotion()) {
      const coercedOptions = pick(options, [
        'center',
        'zoom',
        'bearing',
        'pitch',
        'around',
      ]) as ICameraOptions;
      return this.jumpTo(coercedOptions, eventData);
    }

    this.stop();

    options = merge(
      {
        offset: [0, 0],
        speed: 1.2,
        curve: 1.42,
        easing: defaultEasing,
      },
      options,
    );
    const tr = this.transform;
    const startZoom = this.getZoom();
    const startBearing = this.getBearing();
    const startPitch = this.getPitch();
    const startPadding = this.getPadding();

    const zoom = options.zoom
      ? clamp(+options.zoom, tr.minZoom, tr.maxZoom)
      : startZoom;
    const bearing = options.bearing
      ? this.normalizeBearing(options.bearing, startBearing)
      : startBearing;
    const pitch = options.pitch ? +options.pitch : startPitch;
    const padding = 'padding' in options ? options.padding : tr.padding;

    const scale = tr.zoomScale(zoom - startZoom);
    const offsetAsPoint = Point.convert(options.offset);
    let pointAtOffset = tr.centerPoint.add(offsetAsPoint);
    const locationAtOffset = tr.pointLocation(pointAtOffset);
    const center = LngLat.convert(options.center || locationAtOffset);
    this.normalizeCenter(center);

    const from = tr.project(locationAtOffset);
    const delta = tr.project(center).sub(from);

    let rho = options.curve;

    // w₀: Initial visible span, measured in pixels at the initial scale.
    const w0 = Math.max(tr.width, tr.height);
    // w₁: Final visible span, measured in pixels with respect to the initial scale.
    const w1 = w0 / scale;
    // Length of the flight path as projected onto the ground plane, measured in pixels from
    // the world image origin at the initial scale.
    const u1 = delta.mag();

    if ('minZoom' in options) {
      const minZoom = clamp(
        Math.min(options.minZoom, startZoom, zoom),
        tr.minZoom,
        tr.maxZoom,
      );
      // w<sub>m</sub>: Maximum visible span, measured in pixels with respect to the initial
      // scale.
      const wMax = w0 / tr.zoomScale(minZoom - startZoom);
      rho = Math.sqrt((wMax / u1) * 2);
    }

    // ρ²
    const rho2 = rho * rho;

    /**
     * rᵢ: Returns the zoom-out factor at one end of the animation.
     *
     * @param i 0 for the ascent or 1 for the descent.
     * @private
     */
    function r(i: number) {
      const b =
        (w1 * w1 - w0 * w0 + (i ? -1 : 1) * rho2 * rho2 * u1 * u1) /
        (2 * (i ? w1 : w0) * rho2 * u1);
      return Math.log(Math.sqrt(b * b + 1) - b);
    }

    function sinh(n: number) {
      return (Math.exp(n) - Math.exp(-n)) / 2;
    }
    function cosh(n: number) {
      return (Math.exp(n) + Math.exp(-n)) / 2;
    }
    function tanh(n: number) {
      return sinh(n) / cosh(n);
    }

    // r₀: Zoom-out factor during ascent.
    const r0 = r(0);

    // w(s): Returns the visible span on the ground, measured in pixels with respect to the
    // initial scale. Assumes an angular field of view of 2 arctan ½ ≈ 53°.
    let w: (_: number) => number = (s) => {
      return cosh(r0) / cosh(r0 + rho * s);
    };

    // u(s): Returns the distance along the flight path as projected onto the ground plane,
    // measured in pixels from the world image origin at the initial scale.
    let u: (_: number) => number = (s) => {
      return (w0 * ((cosh(r0) * tanh(r0 + rho * s) - sinh(r0)) / rho2)) / u1;
    };

    // S: Total length of the flight path, measured in ρ-screenfuls.
    let S = (r(1) - r0) / rho;

    // When u₀ = u₁, the optimal path doesn’t require both ascent and descent.
    if (Math.abs(u1) < 0.000001 || !isFinite(S)) {
      // Perform a more or less instantaneous transition if the path is too short.
      if (Math.abs(w0 - w1) < 0.000001) {
        return this.easeTo(options, eventData);
      }

      const k = w1 < w0 ? -1 : 1;
      S = Math.abs(Math.log(w1 / w0)) / rho;

      u = () => {
        return 0;
      };
      w = (s) => {
        return Math.exp(k * rho * s);
      };
    }

    if ('duration' in options) {
      options.duration = +options.duration;
    } else {
      const V =
        'screenSpeed' in options ? +options.screenSpeed / rho : +options.speed;
      options.duration = (1000 * S) / V;
    }

    if (options.maxDuration && options.duration > options.maxDuration) {
      options.duration = 0;
    }

    this.zooming = true;
    this.rotating = startBearing !== bearing;
    this.pitching = pitch !== startPitch;
    this.padding = !tr.isPaddingEqual(padding);

    this.prepareEase(eventData, false);

    this.ease(
      (k) => {
        // s: The distance traveled along the flight path, measured in ρ-screenfuls.
        const s = k * S;
        // @ts-ignore
        const easeScale = 1 / w(s);
        tr.zoom = k === 1 ? zoom : startZoom + tr.scaleZoom(easeScale);

        if (this.rotating) {
          tr.bearing = interpolate(startBearing, bearing, k);
        }
        if (this.pitching) {
          tr.pitch = interpolate(startPitch, pitch, k);
        }
        if (this.padding) {
          tr.interpolatePadding(startPadding, padding, k);
          // When padding is being applied, Transform#centerPoint is changing continously,
          // thus we need to recalculate offsetPoint every frame
          pointAtOffset = tr.centerPoint.add(offsetAsPoint);
        }

        const newCenter =
          k === 1
            ? center
            : tr.unproject(from.add(delta.mult(u(s))).mult(easeScale));
        tr.setLocationAtPoint(
          tr.renderWorldCopies ? newCenter.wrap() : newCenter,
          pointAtOffset,
        );

        this.fireMoveEvents(eventData);
      },
      () => this.afterEase(eventData),
      options,
    );

    return this;
  }
  public fitScreenCoordinates(
    p0: PointLike,
    p1: PointLike,
    bearing: number,
    options?: IAnimationOptions & ICameraOptions,
    eventData?: any,
  ) {
    return this.fitInternal(
      // @ts-ignore
      this.cameraForBoxAndBearing(
        this.transform.pointLocation(Point.convert(p0)),
        this.transform.pointLocation(Point.convert(p1)),
        bearing,
        // @ts-ignore
        options,
      ),
      options,
      eventData,
    );
  }
  public stop(allowGestures?: boolean, easeId?: string) {
    if (this.easeFrameId) {
      this.cancelRenderFrame(this.easeFrameId);
      // @ts-ignore
      delete this.easeFrameId;
      // @ts-ignore
      delete this.onEaseFrame;
    }

    if (this.onEaseEnd) {
      // The _onEaseEnd function might emit events which trigger new
      // animation, which sets a new _onEaseEnd. Ensure we don't delete
      // it unintentionally.
      const onEaseEnd = this.onEaseEnd;
      // @ts-ignore
      delete this.onEaseEnd;
      onEaseEnd.call(this, easeId);
    }
    // if (!allowGestures) {
    //     const handlers = (this: any).handlers;
    //     if (handlers) handlers.stop();
    // }
    return this;
  }
  public renderFrameCallback = () => {
    const t = Math.min((now() - this.easeStart) / this.easeOptions.duration, 1);
    this.onEaseFrame(this.easeOptions.easing(t));
    if (t < 1) {
      // this.easeFrameId = window.requestAnimationFrame(this.renderFrameCallback);
      this.easeFrameId = this.requestRenderFrame(this.renderFrameCallback);
    } else {
      this.stop();
    }
  };
  private normalizeBearing(bearing: number, currentBearing: number) {
    bearing = wrap(bearing, -180, 180);
    const diff = Math.abs(bearing - currentBearing);
    if (Math.abs(bearing - 360 - currentBearing) < diff) {
      bearing -= 360;
    }
    if (Math.abs(bearing + 360 - currentBearing) < diff) {
      bearing += 360;
    }
    return bearing;
  }

  private normalizeCenter(center: LngLat) {
    const tr = this.transform;
    if (!tr.renderWorldCopies || tr.lngRange) {
      return;
    }

    const delta = center.lng - tr.center.lng;
    center.lng += delta > 180 ? -360 : delta < -180 ? 360 : 0;
  }

  private fireMoveEvents(eventData?: any) {
    this.emit('move', new Event('move', eventData));
    if (this.zooming) {
      this.emit('zoom', new Event('zoom', eventData));
    }
    if (this.rotating) {
      this.emit('rotate', new Event('rotate', eventData));
    }
    if (this.pitching) {
      this.emit('rotate', new Event('pitch', eventData));
    }
  }
  private prepareEase(
    eventData: object | undefined,
    noMoveStart: boolean = false,
    currently: { [key: string]: boolean } = {},
  ) {
    this.moving = true;

    if (!noMoveStart && !currently.moving) {
      this.emit('movestart', new Event('movestart', eventData));
    }
    if (this.zooming && !currently.zooming) {
      this.emit('zoomstart', new Event('zoomstart', eventData));
    }
    if (this.rotating && !currently.rotating) {
      this.emit('rotatestart', new Event('rotatestart', eventData));
    }
    if (this.pitching && !currently.pitching) {
      this.emit('pitchstart', new Event('pitchstart', eventData));
    }
  }

  private afterEase(eventData: object | undefined, easeId?: string) {
    // if this easing is being stopped to start another easing with
    // the same id then don't fire any events to avoid extra start/stop events
    if (this.easeId && easeId && this.easeId === easeId) {
      return;
    }
    // @ts-ignore
    delete this.easeId;

    const wasZooming = this.zooming;
    const wasRotating = this.rotating;
    const wasPitching = this.pitching;
    this.moving = false;
    this.zooming = false;
    this.rotating = false;
    this.pitching = false;
    this.padding = false;

    if (wasZooming) {
      this.emit('zoomend', new Event('zoomend', eventData));
    }
    if (wasRotating) {
      this.emit('rotateend', new Event('rotateend', eventData));
    }
    if (wasPitching) {
      this.emit('pitchend', new Event('pitchend', eventData));
    }
    this.emit('moveend', new Event('moveend', eventData));
  }

  private ease(
    frame: (_: number) => void,
    finish: () => void,
    options: {
      animate: boolean;
      duration: number;
      easing: (_: number) => number;
    },
  ) {
    if (options.animate === false || options.duration === 0) {
      frame(1);
      finish();
    } else {
      this.easeStart = now();
      this.easeOptions = options;
      this.onEaseFrame = frame;
      this.onEaseEnd = finish;
      this.easeFrameId = this.requestRenderFrame(this.renderFrameCallback);
    }
  }

  private cameraForBoxAndBearing(
    p0: LngLatLike,
    p1: LngLatLike,
    bearing: number,
    options?: ICameraOptions & {
      offset: [number, number];
      maxZoom: number;
      padding: IPaddingOptions;
    },
  ): void | (ICameraOptions & IAnimationOptions) {
    const defaultPadding = {
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
    };
    options = merge(
      {
        padding: defaultPadding,
        offset: [0, 0],
        maxZoom: this.transform.maxZoom,
      },
      options,
    );

    if (typeof options.padding === 'number') {
      const p = options.padding;
      options.padding = {
        top: p,
        bottom: p,
        right: p,
        left: p,
      };
    }

    options.padding = merge(defaultPadding, options.padding);
    const tr = this.transform;
    const edgePadding = tr.padding as IPaddingOptions;

    // We want to calculate the upper right and lower left of the box defined by p0 and p1
    // in a coordinate system rotate to match the destination bearing.
    const p0world = tr.project(LngLat.convert(p0));
    const p1world = tr.project(LngLat.convert(p1));
    const p0rotated = p0world.rotate((-bearing * Math.PI) / 180);
    const p1rotated = p1world.rotate((-bearing * Math.PI) / 180);

    const upperRight = new Point(
      Math.max(p0rotated.x, p1rotated.x),
      Math.max(p0rotated.y, p1rotated.y),
    );
    const lowerLeft = new Point(
      Math.min(p0rotated.x, p1rotated.x),
      Math.min(p0rotated.y, p1rotated.y),
    );

    // Calculate zoom: consider the original bbox and padding.
    const size = upperRight.sub(lowerLeft);
    const scaleX =
      (tr.width -
        // @ts-ignore
        (edgePadding.left +
          // @ts-ignore
          edgePadding.right +
          // @ts-ignore
          options.padding.left +
          // @ts-ignore
          options.padding.right)) /
      size.x;
    const scaleY =
      (tr.height -
        // @ts-ignore
        (edgePadding.top +
          // @ts-ignore
          edgePadding.bottom +
          // @ts-ignore
          options.padding.top +
          // @ts-ignore
          options.padding.bottom)) /
      size.y;

    if (scaleY < 0 || scaleX < 0) {
      return;
    }

    const zoom = Math.min(
      tr.scaleZoom(tr.scale * Math.min(scaleX, scaleY)),
      options.maxZoom,
    );

    // Calculate center: apply the zoom, the configured offset, as well as offset that exists as a result of padding.
    const offset = Point.convert(options.offset);
    // @ts-ignore
    const paddingOffsetX = (options.padding.left - options.padding.right) / 2;
    // @ts-ignore
    const paddingOffsetY = (options.padding.top - options.padding.bottom) / 2;
    const offsetAtInitialZoom = new Point(
      offset.x + paddingOffsetX,
      offset.y + paddingOffsetY,
    );
    const offsetAtFinalZoom = offsetAtInitialZoom.mult(
      tr.scale / tr.zoomScale(zoom),
    );

    const center = tr.unproject(
      p0world.add(p1world).div(2).sub(offsetAtFinalZoom),
    );

    return {
      center,
      zoom,
      bearing,
    };
  }

  private fitInternal(
    calculatedOptions?: ICameraOptions & IAnimationOptions,
    options?: IAnimationOptions & ICameraOptions,
    eventData?: any,
  ) {
    // cameraForBounds warns + returns undefined if unable to fit:
    if (!calculatedOptions) {
      return this;
    }

    options = merge(calculatedOptions, options);
    // Explictly remove the padding field because, calculatedOptions already accounts for padding by setting zoom and center accordingly.
    delete options.padding;
    // @ts-ignore
    return options.linear
      ? this.easeTo(options, eventData)
      : this.flyTo(options, eventData);
  }
}
