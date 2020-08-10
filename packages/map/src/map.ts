import { DOM } from '@antv/l7-utils';
import { merge } from 'lodash';
import Camera from './camera';
import './css/l7.css';
import LngLat, { LngLatLike } from './geo/lng_lat';
import LngLatBounds, { LngLatBoundsLike } from './geo/lng_lat_bounds';
// @ts-ignore
import Point, { PointLike } from './geo/point';
import BoxZoomHandler from './handler/box_zoom';
import HandlerManager from './handler/handler_manager';
import KeyboardHandler from './handler/keyboard';

import ScrollZoomHandler from './handler/scroll_zoom';
import DoubleClickZoomHandler from './handler/shim/dblclick_zoom';
import DragPanHandler from './handler/shim/drag_pan';
import DragRotateHandler from './handler/shim/drag_rotate';
import TouchZoomRotateHandler from './handler/shim/touch_zoom_rotate';
import { TouchPitchHandler } from './handler/touch';
import Hash from './hash';
import { IMapOptions } from './interface';
import { renderframe } from './util';
import { PerformanceUtils } from './utils/performance';
import TaskQueue, { TaskID } from './utils/task_queue';
type CallBack = (_: number) => void;
const defaultMinZoom = -2;
const defaultMaxZoom = 22;

// the default values, but also the valid range
const defaultMinPitch = 0;
const defaultMaxPitch = 60;

const DefaultOptions: IMapOptions = {
  hash: false,
  zoom: -1,
  center: [112, 32],
  pitch: 0,
  bearing: 0,
  interactive: true,
  minZoom: defaultMinZoom,
  maxZoom: defaultMaxZoom,
  minPitch: defaultMinPitch,
  maxPitch: defaultMaxPitch,
  scrollZoom: true,
  boxZoom: true,
  dragRotate: true,
  dragPan: true,
  keyboard: true,
  doubleClickZoom: true,
  touchZoomRotate: true,
  touchPitch: true,
  bearingSnap: 7,
  clickTolerance: 3,
  pitchWithRotate: true,
  trackResize: true,
  renderWorldCopies: true,
};
export class Map extends Camera {
  public doubleClickZoom: DoubleClickZoomHandler;
  public dragRotate: DragRotateHandler;
  public dragPan: DragPanHandler;
  public touchZoomRotate: TouchZoomRotateHandler;
  public scrollZoom: ScrollZoomHandler;
  public keyboard: KeyboardHandler;
  public touchPitch: TouchPitchHandler;
  public boxZoom: BoxZoomHandler;
  public handlers: HandlerManager;

  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private canvasContainer: HTMLElement;
  private renderTaskQueue: TaskQueue = new TaskQueue();
  private frame: { cancel: () => void } | null;
  private trackResize: boolean = true;
  private hash: Hash | undefined;
  constructor(options: Partial<IMapOptions>) {
    super(merge({}, DefaultOptions, options));
    this.initContainer();
    this.resize();
    this.handlers = new HandlerManager(this, this.options);
    // this.on('move', () => this.update());
    // this.on('moveend', () => this.update());
    // this.on('zoom', () => {
    //   console.log('zoom');
    // });

    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.onWindowOnline, false);
      window.addEventListener('resize', this.onWindowResize, false);
      window.addEventListener('orientationchange', this.onWindowResize, false);
    }

    const hashName =
      (typeof options.hash === 'string' && options.hash) || undefined;
    if (options.hash) {
      this.hash = new Hash(hashName).addTo(this) as Hash;
    }

    // don't set position from options if set through hash
    if (!this.hash || !this.hash.onHashChange()) {
      this.jumpTo({
        center: options.center,
        zoom: options.zoom,
        bearing: options.bearing,
        pitch: options.pitch,
      });

      if (options.bounds) {
        this.resize();
        this.fitBounds(
          options.bounds,
          merge({}, options.fitBoundsOptions, { duration: 0 }),
        );
      }
    }
  }

  public resize(eventData?: any) {
    const dimensions = this.containerDimensions();
    const width = dimensions[0];
    const height = dimensions[1];

    // this.resizeCanvas(width, height);
    this.transform.resize(width, height);
    const fireMoving = !this.moving;
    if (fireMoving) {
      this.stop();
      this.emit('movestart', new Event('movestart', eventData));
      this.emit('move', new Event('move', eventData));
    }

    this.emit('resize', new Event('resize', eventData));

    if (fireMoving) {
      this.emit('moveend', new Event('moveend', eventData));
    }

    return this;
  }

  public getContainer() {
    return this.container;
  }

  public getCanvas() {
    return this.canvas;
  }

  public getCanvasContainer() {
    return this.canvasContainer;
  }

  public project(lngLat: LngLatLike) {
    return this.transform.locationPoint(LngLat.convert(lngLat));
  }

  public unproject(point: PointLike) {
    return this.transform.pointLocation(Point.convert(point));
  }

  public getBounds(): LngLatBounds {
    return this.transform.getBounds();
  }

  public getMaxBounds(): LngLatBounds | null {
    return this.transform.getMaxBounds();
  }

  public setMaxBounds(bounds: LngLatBoundsLike) {
    this.transform.setMaxBounds(LngLatBounds.convert(bounds));
  }

  public setStyle(style: any) {
    return;
  }
  public setMinZoom(minZoom?: number) {
    minZoom =
      minZoom === null || minZoom === undefined ? defaultMinZoom : minZoom;
    if (minZoom >= defaultMinZoom && minZoom <= this.transform.maxZoom) {
      this.transform.minZoom = minZoom;
      if (this.getZoom() < minZoom) {
        this.setZoom(minZoom);
      }

      return this;
    } else {
      throw new Error(
        `minZoom must be between ${defaultMinZoom} and the current maxZoom, inclusive`,
      );
    }
  }

  public getMinZoom() {
    return this.transform.minZoom;
  }

  public setMaxZoom(maxZoom?: number) {
    maxZoom =
      maxZoom === null || maxZoom === undefined ? defaultMaxZoom : maxZoom;

    if (maxZoom >= this.transform.minZoom) {
      this.transform.maxZoom = maxZoom;
      if (this.getZoom() > maxZoom) {
        this.setZoom(maxZoom);
      }

      return this;
    } else {
      throw new Error('maxZoom must be greater than the current minZoom');
    }
  }
  public getMaxZoom() {
    return this.transform.maxZoom;
  }

  public setMinPitch(minPitch?: number) {
    minPitch =
      minPitch === null || minPitch === undefined ? defaultMinPitch : minPitch;

    if (minPitch < defaultMinPitch) {
      throw new Error(
        `minPitch must be greater than or equal to ${defaultMinPitch}`,
      );
    }

    if (minPitch >= defaultMinPitch && minPitch <= this.transform.maxPitch) {
      this.transform.minPitch = minPitch;
      if (this.getPitch() < minPitch) {
        this.setPitch(minPitch);
      }

      return this;
    } else {
      throw new Error(
        `minPitch must be between ${defaultMinPitch} and the current maxPitch, inclusive`,
      );
    }
  }

  public getMinPitch() {
    return this.transform.minPitch;
  }

  public setMaxPitch(maxPitch?: number) {
    maxPitch =
      maxPitch === null || maxPitch === undefined ? defaultMaxPitch : maxPitch;

    if (maxPitch > defaultMaxPitch) {
      throw new Error(
        `maxPitch must be less than or equal to ${defaultMaxPitch}`,
      );
    }

    if (maxPitch >= this.transform.minPitch) {
      this.transform.maxPitch = maxPitch;
      if (this.getPitch() > maxPitch) {
        this.setPitch(maxPitch);
      }

      return this;
    } else {
      throw new Error('maxPitch must be greater than the current minPitch');
    }
  }

  public getMaxPitch() {
    return this.transform.maxPitch;
  }

  public getRenderWorldCopies() {
    return this.transform.renderWorldCopies;
  }

  public setRenderWorldCopies(renderWorldCopies?: boolean) {
    this.transform.renderWorldCopies = !!renderWorldCopies;
  }

  public remove() {
    if (this.frame) {
      this.frame.cancel();
      this.frame = null;
    }
    this.renderTaskQueue.clear();
  }

  public requestRenderFrame(cb: CallBack): TaskID {
    this.update();
    return this.renderTaskQueue.add(cb);
  }

  public cancelRenderFrame(id: TaskID) {
    return this.renderTaskQueue.remove(id);
  }

  public triggerRepaint() {
    if (!this.frame) {
      this.frame = renderframe((paintStartTimeStamp: number) => {
        PerformanceUtils.frame(paintStartTimeStamp);
        this.frame = null;
        this.update(paintStartTimeStamp);
      });
    }
  }

  public update(time?: number) {
    if (!this.frame) {
      this.frame = renderframe((paintStartTimeStamp: number) => {
        PerformanceUtils.frame(paintStartTimeStamp);
        this.frame = null;
        this.renderTaskQueue.run(time);
      });
    }
  }

  private initContainer() {
    if (typeof this.options.container === 'string') {
      this.container = window.document.getElementById(
        this.options.container,
      ) as HTMLElement;
      if (!this.container) {
        throw new Error(`Container '${this.options.container}' not found.`);
      }
    } else if (this.options.container instanceof HTMLElement) {
      this.container = this.options.container;
    } else {
      throw new Error(
        "Invalid type: 'container' must be a String or HTMLElement.",
      );
    }

    const container = this.container;
    container.classList.add('l7-map');

    const canvasContainer = (this.canvasContainer = DOM.create(
      'div',
      'l7-canvas-container',
      container,
    ));
    if (this.options.interactive) {
      canvasContainer.classList.add('l7-interactive');
    }

    // this.canvas = DOM.create(
    //   'canvas',
    //   'l7-canvas',
    //   canvasContainer,
    // ) as HTMLCanvasElement;
    // this.canvas.setAttribute('tabindex', '-');
    // this.canvas.setAttribute('aria-label', 'Map');
  }

  private containerDimensions(): [number, number] {
    let width = 0;
    let height = 0;
    if (this.container) {
      width = this.container.clientWidth || 400;
      height = this.container.clientHeight || 300;
    }
    return [width, height];
  }

  private resizeCanvas(width: number, height: number) {
    const pixelRatio = window.devicePixelRatio || 1;
    this.canvas.width = pixelRatio * width;
    this.canvas.height = pixelRatio * height;

    // Maintain the same canvas size, potentially downscaling it for HiDPI displays
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
  }

  private onWindowOnline = () => {
    this.update();
  };

  private onWindowResize = (event: Event) => {
    if (this.trackResize) {
      this.resize({ originalEvent: event }).update();
    }
  };
}
