// @ts-ignore
import type { EarthMap } from '../earthmap';
import LngLat from '../geo/lng_lat';
import type Point from '../geo/point';
import type { Map } from '../map';
import { bezier, ease, interpolate, now } from '../util';
import DOM from '../utils/dom';
import type HandlerManager from './handler_manager';

// deltaY value for mouse scroll wheel identification
const wheelZoomDelta = 4.000244140625;

// These magic numbers control the rate of zoom. Trackpad events fire at a greater
// frequency than mouse scroll wheel, so reduce the zoom rate per wheel tick
const defaultZoomRate = 1 / 100;
const wheelZoomRate = 1 / 450;

// upper bound on how much we scale the map in any single render frame; this
// is used to limit zoom rate in the case of very fast scrolling
const maxScalePerFrame = 2;

/**
 * The `ScrollZoomHandler` allows the user to zoom the map by scrolling.
 */
class ScrollZoomHandler {
  private map: Map | EarthMap;
  private el: HTMLElement;
  private enabled: boolean;
  private active: boolean;
  private zooming: boolean;
  private aroundCenter: boolean;
  private around: LngLat;
  private aroundPoint: Point;
  private type: 'wheel' | 'trackpad' | null;
  private lastValue: number;
  private timeout: number | null; // used for delayed-handling of a single wheel movement
  private finishTimeout: number; // used to delay final '{move,zoom}end' events

  private lastWheelEvent: any;
  private lastWheelEventTime: number;

  private startZoom: number;
  private targetZoom: number;
  private delta: number;
  private easing: (time: number) => number;
  private prevEase: {
    start: number;
    duration: number;
    easing: (_: number) => number;
  };

  private frameId: boolean | null;
  private handler: HandlerManager;

  private defaultZoomRate: number;
  private wheelZoomRate: number;

  /**
   * @private
   */
  constructor(map: Map | EarthMap, handler: HandlerManager) {
    this.map = map;
    this.el = map.getCanvasContainer();
    this.handler = handler;

    this.delta = 0;
    this.defaultZoomRate = defaultZoomRate;
    this.wheelZoomRate = wheelZoomRate;
  }

  /**
   * Set the zoom rate of a trackpad
   * @param {number} [zoomRate=1/100] The rate used to scale trackpad movement to a zoom value.
   * @example
   * // Speed up trackpad zoom
   * map.scrollZoom.setZoomRate(1/25);
   */
  public setZoomRate(zoomRate: number) {
    this.defaultZoomRate = zoomRate;
  }

  /**
   * Set the zoom rate of a mouse wheel
   * @param {number} [wheelZoomRate=1/450] The rate used to scale mouse wheel movement to a zoom value.
   * @example
   * // Slow down zoom of mouse wheel
   * map.scrollZoom.setWheelZoomRate(1/600);
   */
  public setWheelZoomRate(zoomRate: number) {
    this.wheelZoomRate = zoomRate;
  }

  /**
   * Returns a Boolean indicating whether the "scroll to zoom" interaction is enabled.
   *
   * @returns {boolean} `true` if the "scroll to zoom" interaction is enabled.
   */
  public isEnabled() {
    return !!this.enabled;
  }

  /*
   * Active state is turned on and off with every scroll wheel event and is set back to false before the map
   * render is called, so _active is not a good candidate for determining if a scroll zoom animation is in
   * progress.
   */
  public isActive() {
    return !!this.active || this.finishTimeout !== undefined;
  }

  public isZooming() {
    return !!this.zooming;
  }

  /**
   * Enables the "scroll to zoom" interaction.
   *
   * @param {Object} [options] Options object.
   * @param {string} [options.around] If "center" is passed, map will zoom around center of map
   *
   * @example
   *   map.scrollZoom.enable();
   * @example
   *  map.scrollZoom.enable({ around: 'center' })
   */
  public enable(options?: any) {
    if (this.isEnabled()) {
      return;
    }
    this.enabled = true;
    this.aroundCenter = options && options.around === 'center';
  }

  /**
   * Disables the "scroll to zoom" interaction.
   *
   * @example
   *   map.scrollZoom.disable();
   */
  public disable() {
    if (!this.isEnabled()) {
      return;
    }
    this.enabled = false;
  }

  public wheel(e: WheelEvent) {
    if (!this.isEnabled()) {
      return;
    }
    // Remove `any` cast when https://github.com/facebook/flow/issues/4879 is fixed.
    let value = e.deltaMode === window.WheelEvent.DOM_DELTA_LINE ? e.deltaY * 40 : e.deltaY;
    const nowTime = now();
    const timeDelta = nowTime - (this.lastWheelEventTime || 0);

    this.lastWheelEventTime = nowTime;

    if (value !== 0 && value % wheelZoomDelta === 0) {
      // This one is definitely a mouse wheel event.
      this.type = 'wheel';
    } else if (value !== 0 && Math.abs(value) < 4) {
      // This one is definitely a trackpad event because it is so small.
      this.type = 'trackpad';
    } else if (timeDelta > 400) {
      // This is likely a new scroll action.
      this.type = null;
      this.lastValue = value;

      // Start a timeout in case this was a singular event, and dely it by up to 40ms.
      // @ts-ignore
      this.timeout = setTimeout(this.onTimeout, 40, e);
    } else if (!this.type) {
      // This is a repeating event, but we don't know the type of event just yet.
      // If the delta per time is small, we assume it's a fast trackpad; otherwise we switch into wheel mode.
      this.type = Math.abs(timeDelta * value) < 200 ? 'trackpad' : 'wheel';

      // Make sure our delayed event isn't fired again, because we accumulate
      // the previous event (which was less than 40ms ago) into this event.
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
        value += this.lastValue;
      }
    }

    // Slow down zoom if shift key is held for more precise zooming
    if (e.shiftKey && value) {
      value = value / 4;
    }
    // Only fire the callback if we actually know what type of scrolling device the user uses.
    if (this.type) {
      this.lastWheelEvent = e;
      this.delta -= value;
      if (!this.active) {
        this.start(e);
      }
    }

    e.preventDefault();
  }

  public renderFrame() {
    return this.onScrollFrame();
  }

  public reset() {
    this.active = false;
  }

  private onScrollFrame = () => {
    if (!this.frameId) {
      return;
    }
    this.frameId = null;

    if (!this.isActive()) {
      return;
    }
    const tr = this.map.transform;

    // if we've had scroll events since the last render frame, consume the
    // accumulated delta, and update the target zoom level accordingly
    if (this.delta !== 0) {
      // For trackpad events and single mouse wheel ticks, use the default zoom rate
      const zoomRate =
        this.type === 'wheel' && Math.abs(this.delta) > wheelZoomDelta
          ? this.wheelZoomRate
          : this.defaultZoomRate;
      // Scale by sigmoid of scroll wheel delta.
      let scale = maxScalePerFrame / (1 + Math.exp(-Math.abs(this.delta * zoomRate)));

      if (this.delta < 0 && scale !== 0) {
        scale = 1 / scale;
      }

      const fromScale =
        typeof this.targetZoom === 'number' ? tr.zoomScale(this.targetZoom) : tr.scale;
      this.targetZoom = Math.min(tr.maxZoom, Math.max(tr.minZoom, tr.scaleZoom(fromScale * scale)));

      // if this is a mouse wheel, refresh the starting zoom and easing
      // function we're using to smooth out the zooming between wheel
      // events
      if (this.type === 'wheel') {
        this.startZoom = tr.zoom;
        this.easing = this.smoothOutEasing(200);
      }

      this.delta = 0;
    }

    const targetZoom = typeof this.targetZoom === 'number' ? this.targetZoom : tr.zoom;
    const startZoom = this.startZoom;
    const easing = this.easing;

    let finished = false;
    let zoom;
    if (this.type === 'wheel' && startZoom && easing) {
      const t = Math.min((now() - this.lastWheelEventTime) / 200, 1);
      const k = easing(t);
      zoom = interpolate(startZoom, targetZoom, k);
      if (t < 1) {
        if (!this.frameId) {
          this.frameId = true;
        }
      } else {
        finished = true;
      }
    } else {
      zoom = targetZoom;
      finished = true;
    }

    this.active = true;

    if (finished) {
      this.active = false;
      // @ts-ignore
      this.finishTimeout = setTimeout(() => {
        this.zooming = false;
        this.handler.triggerRenderFrame();
        // @ts-ignore
        delete this.targetZoom;
        // @ts-ignore
        delete this.finishTimeout;
      }, 200);
    }

    return {
      noInertia: true,
      needsRenderFrame: !finished,
      zoomDelta: zoom - tr.zoom,
      around: this.aroundPoint,
      originalEvent: this.lastWheelEvent,
    };
  };

  private onTimeout(initialEvent: any) {
    this.type = 'wheel';
    this.delta -= this.lastValue;
    if (!this.active && this.start) {
      this.start(initialEvent);
    }
  }

  private start(e: any) {
    if (!this.delta) {
      return;
    }

    if (this.frameId) {
      this.frameId = null;
    }

    this.active = true;
    if (!this.isZooming()) {
      this.zooming = true;
    }

    if (this.finishTimeout) {
      clearTimeout(this.finishTimeout);
      // @ts-ignore
      delete this.finishTimeout;
    }

    const pos = DOM.mousePos(this.el, e);

    this.around = LngLat.convert(
      this.aroundCenter ? this.map.getCenter() : this.map.unproject(pos),
    );
    this.aroundPoint = this.map.transform.locationPoint(this.around);
    if (!this.frameId) {
      this.frameId = true;
      this.handler.triggerRenderFrame();
    }
  }

  private smoothOutEasing(duration: number) {
    let easing = ease;

    if (this.prevEase) {
      const preEase = this.prevEase;
      const t = (now() - preEase.start) / preEase.duration;
      const speed = preEase.easing(t + 0.01) - preEase.easing(t);

      // Quick hack to make new bezier that is continuous with last
      const x = (0.27 / Math.sqrt(speed * speed + 0.0001)) * 0.01;
      const y = Math.sqrt(0.27 * 0.27 - x * x);

      easing = bezier(x, y, 0.25, 1);
    }

    this.prevEase = {
      start: now(),
      duration,
      easing,
    };

    return easing;
  }
}

export default ScrollZoomHandler;
