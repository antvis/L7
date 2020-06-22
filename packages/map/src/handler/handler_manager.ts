// @ts-ignore
// tslint:disable-next-line: no-submodule-imports
import merge from 'lodash/merge';
import Point from '../geo/point';
import { Map } from '../map';
import DOM from '../utils/dom';
import BlockableMapEventHandler from './blockable_map_event';
import BoxZoomHandler from './box_zoom';
import ClickZoomHandler from './click_zoom';
import { Event } from './events/event';
import RenderFrameEvent from './events/render_event';
import HandlerInertia from './handler_inertia';
import { IHandler, IHandlerResult } from './IHandler';
import KeyboardHandler from './keyboard';
import MapEventHandler from './map_event';
import {
  MousePanHandler,
  MousePitchHandler,
  MouseRotateHandler,
} from './mouse';
import ScrollZoomHandler from './scroll_zoom';
import DoubleClickZoomHandler from './shim/dblclick_zoom';
import DragPanHandler from './shim/drag_pan';
import DragRotateHandler from './shim/drag_rotate';
import TouchZoomRotateHandler from './shim/touch_zoom_rotate';
import TapDragZoomHandler from './tap/tap_drag_zoom';
import TapZoomHandler from './tap/tap_zoom';
import {
  TouchPanHandler,
  TouchPitchHandler,
  TouchRotateHandler,
  TouchZoomHandler,
} from './touch';

export type InputEvent = MouseEvent | TouchEvent | KeyboardEvent | WheelEvent;

const isMoving = (p: any) => p.zoom || p.drag || p.pitch || p.rotate;

function hasChange(result: IHandlerResult) {
  return (
    (result.panDelta && result.panDelta.mag()) ||
    result.zoomDelta ||
    result.bearingDelta ||
    result.pitchDelta
  );
}

export interface IHandlerOptions {
  interactive: boolean;
  boxZoom: boolean;
  dragRotate: boolean;
  dragPan: boolean;
  keyboard: boolean;
  doubleClickZoom: boolean;
  touchZoomRotate: boolean;
  touchPitch: boolean;
  trackResize: boolean;
  renderWorldCopies: boolean;
  bearingSnap: number;
  clickTolerance: number;
  pitchWithRotate: boolean;
}

class HandlerManager {
  private map: Map;
  private el: HTMLElement;
  private handlers: Array<{
    handlerName: string;
    handler: IHandler;
    allowed: any;
  }>;
  private eventsInProgress: any;
  private frameId: number;
  private inertia: HandlerInertia;
  private bearingSnap: number;
  private handlersById: { [key: string]: IHandler };
  private updatingCamera: boolean;
  private changes: Array<[IHandlerResult, any, any]>;
  private previousActiveHandlers: { [key: string]: IHandler };
  private bearingChanged: boolean;
  private listeners: Array<
    [HTMLElement, string, void | { passive?: boolean; capture?: boolean }]
  >;

  constructor(map: Map, options: IHandlerOptions) {
    this.map = map;
    this.el = this.map.getCanvasContainer();
    this.handlers = [];
    this.handlersById = {};
    this.changes = [];

    this.inertia = new HandlerInertia(map);
    this.bearingSnap = options.bearingSnap;
    this.previousActiveHandlers = {};

    // Track whether map is currently moving, to compute start/move/end events
    this.eventsInProgress = {};

    this.addDefaultHandlers(options);

    const el = this.el;

    this.listeners = [
      // Bind touchstart and touchmove with passive: false because, even though
      // they only fire a map events and therefore could theoretically be
      // passive, binding with passive: true causes iOS not to respect
      // e.preventDefault() in _other_ handlers, even if they are non-passive
      // (see https://bugs.webkit.org/show_bug.cgi?id=184251)
      [el, 'touchstart', { passive: false }],
      [el, 'touchmove', { passive: false }],
      [el, 'touchend', undefined],
      [el, 'touchcancel', undefined],

      [el, 'mousedown', undefined],
      [el, 'mousemove', undefined],
      [el, 'mouseup', undefined],

      // Bind window-level event listeners for move and up/end events. In the absence of
      // the pointer capture API, which is not supported by all necessary platforms,
      // window-level event listeners give us the best shot at capturing events that
      // fall outside the map canvas element. Use `{capture: true}` for the move event
      // to prevent map move events from being fired during a drag.
      // @ts-ignore
      [window.document, 'mousemove', { capture: true }],
      // @ts-ignore
      [window.document, 'mouseup', undefined],

      [el, 'mouseover', undefined],
      [el, 'mouseout', undefined],
      [el, 'dblclick', undefined],
      [el, 'click', undefined],

      [el, 'keydown', { capture: false }],
      [el, 'keyup', undefined],

      [el, 'wheel', { passive: false }],
      [el, 'contextmenu', undefined],
      // @ts-ignore
      [window, 'blur', undefined],
    ];
    for (const [target, type, listenerOptions] of this.listeners) {
      // @ts-ignore
      DOM.addEventListener(
        target,
        type,
        // @ts-ignore
        target === window.document ? this.handleWindowEvent : this.handleEvent,
        listenerOptions,
      );
    }
  }
  public destroy() {
    for (const [target, type, listenerOptions] of this.listeners) {
      // @ts-ignore
      DOM.removeEventListener(
        target,
        type,
        // @ts-ignore
        target === window.document ? this.handleWindowEvent : this.handleEvent,
        listenerOptions,
      );
    }
  }

  public stop() {
    // do nothing if this method was triggered by a gesture update
    if (this.updatingCamera) {
      return;
    }

    for (const { handler } of this.handlers) {
      handler.reset();
    }
    this.inertia.clear();
    this.fireEvents({}, {});
    this.changes = [];
  }

  public isActive() {
    for (const { handler } of this.handlers) {
      if (handler.isActive()) {
        return true;
      }
    }
    return false;
  }

  public isZooming() {
    return !!this.eventsInProgress.zoom || this.map.scrollZoom.isZooming();
  }
  public isRotating() {
    return !!this.eventsInProgress.rotate;
  }

  public isMoving() {
    return Boolean(isMoving(this.eventsInProgress)) || this.isZooming();
  }

  public handleWindowEvent = (e: InputEvent) => {
    this.handleEvent(e, `${e.type}Window`);
  };

  public handleEvent = (
    e: InputEvent | RenderFrameEvent,
    eventName?: string,
  ) => {
    if (e.type === 'blur') {
      this.stop();
      return;
    }
    this.updatingCamera = true;
    const inputEvent = e.type === 'renderFrame' ? undefined : (e as InputEvent);

    /*
     * We don't call e.preventDefault() for any events by default.
     * Handlers are responsible for calling it where necessary.
     */

    const mergedIHandlerResult: IHandlerResult = { needsRenderFrame: false };
    const eventsInProgress: { [key: string]: any } = {};
    const activeHandlers: { [key: string]: any } = {};
    // @ts-ignore
    const mapTouches = e.touches
      ? // @ts-ignore
        this.getMapTouches(e.touches as Touch[])
      : undefined;
    const points = mapTouches
      ? DOM.touchPos(this.el, mapTouches)
      : DOM.mousePos(this.el, e as MouseEvent);

    for (const { handlerName, handler, allowed } of this.handlers) {
      if (!handler.isEnabled()) {
        continue;
      }
      let data: IHandlerResult;
      if (this.blockedByActive(activeHandlers, allowed, handlerName)) {
        handler.reset();
      } else {
        const handerName = eventName || e.type;
        // @ts-ignore
        if (handler && handler[handerName]) {
          // @ts-ignore
          data = handler[handerName](e, points, mapTouches);
          this.mergeIHandlerResult(
            mergedIHandlerResult,
            eventsInProgress,
            data,
            handlerName,
            inputEvent,
          );
          if (data && data.needsRenderFrame) {
            this.triggerRenderFrame();
          }
        }
      }
      // @ts-ignore
      if (data || handler.isActive()) {
        activeHandlers[handlerName] = handler;
      }
    }

    const deactivatedHandlers: { [key: string]: any } = {};
    for (const name in this.previousActiveHandlers) {
      if (!activeHandlers[name]) {
        deactivatedHandlers[name] = inputEvent;
      }
    }
    this.previousActiveHandlers = activeHandlers;
    if (
      Object.keys(deactivatedHandlers).length ||
      hasChange(mergedIHandlerResult)
    ) {
      this.changes.push([
        mergedIHandlerResult,
        eventsInProgress,
        deactivatedHandlers,
      ]);
      this.triggerRenderFrame();
    }

    if (Object.keys(activeHandlers).length || hasChange(mergedIHandlerResult)) {
      this.map.stop(true);
    }

    this.updatingCamera = false;

    const { cameraAnimation } = mergedIHandlerResult;
    if (cameraAnimation) {
      this.inertia.clear();
      this.fireEvents({}, {});
      this.changes = [];
      cameraAnimation(this.map);
    }
  };

  public mergeIHandlerResult(
    mergedIHandlerResult: IHandlerResult,
    eventsInProgress: { [key: string]: any },
    HandlerResult: IHandlerResult,
    name: string,
    e?: InputEvent,
  ) {
    if (!HandlerResult) {
      return;
    }

    merge(mergedIHandlerResult, HandlerResult);

    const eventData = {
      handlerName: name,
      originalEvent: HandlerResult.originalEvent || e,
    };

    // track which handler changed which camera property
    if (HandlerResult.zoomDelta !== undefined) {
      eventsInProgress.zoom = eventData;
    }
    if (HandlerResult.panDelta !== undefined) {
      eventsInProgress.drag = eventData;
    }
    if (HandlerResult.pitchDelta !== undefined) {
      eventsInProgress.pitch = eventData;
    }
    if (HandlerResult.bearingDelta !== undefined) {
      eventsInProgress.rotate = eventData;
    }
  }

  public triggerRenderFrame() {
    if (this.frameId === undefined) {
      this.frameId = this.map.requestRenderFrame((timeStamp: number) => {
        delete this.frameId;
        this.handleEvent(new RenderFrameEvent('renderFrame', { timeStamp }));
        this.applyChanges();
      });
    }
  }

  private addDefaultHandlers(options: IHandlerOptions) {
    const map = this.map;
    const el = map.getCanvasContainer();
    this.add('mapEvent', new MapEventHandler(map, options));

    const boxZoom = (map.boxZoom = new BoxZoomHandler(map, options));
    this.add('boxZoom', boxZoom);

    const tapZoom = new TapZoomHandler();
    const clickZoom = new ClickZoomHandler();
    map.doubleClickZoom = new DoubleClickZoomHandler(clickZoom, tapZoom);
    this.add('tapZoom', tapZoom);
    this.add('clickZoom', clickZoom);

    const tapDragZoom = new TapDragZoomHandler();
    this.add('tapDragZoom', tapDragZoom);

    const touchPitch = (map.touchPitch = new TouchPitchHandler());
    this.add('touchPitch', touchPitch);

    const mouseRotate = new MouseRotateHandler(options);
    const mousePitch = new MousePitchHandler(options);
    map.dragRotate = new DragRotateHandler(options, mouseRotate, mousePitch);
    this.add('mouseRotate', mouseRotate, ['mousePitch']);
    this.add('mousePitch', mousePitch, ['mouseRotate']);

    const mousePan = new MousePanHandler(options);
    const touchPan = new TouchPanHandler(options);
    map.dragPan = new DragPanHandler(el, mousePan, touchPan);
    this.add('mousePan', mousePan);
    this.add('touchPan', touchPan, ['touchZoom', 'touchRotate']);

    const touchRotate = new TouchRotateHandler();
    const touchZoom = new TouchZoomHandler();
    map.touchZoomRotate = new TouchZoomRotateHandler(
      el,
      touchZoom,
      touchRotate,
      tapDragZoom,
    );
    this.add('touchRotate', touchRotate, ['touchPan', 'touchZoom']);
    this.add('touchZoom', touchZoom, ['touchPan', 'touchRotate']);

    const scrollZoom = (map.scrollZoom = new ScrollZoomHandler(map, this));
    this.add('scrollZoom', scrollZoom, ['mousePan']);

    const keyboard = (map.keyboard = new KeyboardHandler());
    this.add('keyboard', keyboard);

    this.add('blockableMapEvent', new BlockableMapEventHandler(map));

    for (const name of [
      'boxZoom',
      'doubleClickZoom',
      'tapDragZoom',
      'touchPitch',
      'dragRotate',
      'dragPan',
      'touchZoomRotate',
      'scrollZoom',
      'keyboard',
    ]) {
      // @ts-ignore
      if (options.interactive && options[name]) {
        // @ts-ignore
        map[name].enable(options[name]);
      }
    }
  }

  private add(handlerName: string, handler: IHandler, allowed?: string[]) {
    this.handlers.push({ handlerName, handler, allowed });
    this.handlersById[handlerName] = handler;
  }

  private blockedByActive(
    activeHandlers: { [key: string]: IHandler },
    allowed: string[],
    myName: string,
  ) {
    for (const name in activeHandlers) {
      if (name === myName) {
        continue;
      }
      if (!allowed || allowed.indexOf(name) < 0) {
        return true;
      }
    }
    return false;
  }

  private getMapTouches(touches: Touch[]): Touch[] {
    const mapTouches = [];
    for (const t of touches) {
      const target = t.target as Node;
      if (this.el.contains(target)) {
        mapTouches.push(t);
      }
    }
    return mapTouches;
  }

  private applyChanges() {
    const combined: { [key: string]: any } = {};
    const combinedEventsInProgress = {};
    const combinedDeactivatedHandlers = {};

    for (const [change, eventsInProgress, deactivatedHandlers] of this
      .changes) {
      if (change.panDelta) {
        combined.panDelta = (combined.panDelta || new Point(0, 0))._add(
          change.panDelta,
        );
      }
      if (change.zoomDelta) {
        combined.zoomDelta = (combined.zoomDelta || 0) + change.zoomDelta;
      }
      if (change.bearingDelta) {
        combined.bearingDelta =
          (combined.bearingDelta || 0) + change.bearingDelta;
      }
      if (change.pitchDelta) {
        combined.pitchDelta = (combined.pitchDelta || 0) + change.pitchDelta;
      }
      if (change.around !== undefined) {
        combined.around = change.around;
      }
      if (change.pinchAround !== undefined) {
        combined.pinchAround = change.pinchAround;
      }
      if (change.noInertia) {
        combined.noInertia = change.noInertia;
      }

      merge(combinedEventsInProgress, eventsInProgress);
      merge(combinedDeactivatedHandlers, deactivatedHandlers);
    }

    this.updateMapTransform(
      combined,
      combinedEventsInProgress,
      combinedDeactivatedHandlers,
    );
    this.changes = [];
  }

  private updateMapTransform(
    combinedResult: any,
    combinedEventsInProgress: any,
    deactivatedHandlers: any,
  ) {
    const map = this.map;
    const tr = map.transform;

    if (!hasChange(combinedResult)) {
      return this.fireEvents(combinedEventsInProgress, deactivatedHandlers);
    }
    const {
      panDelta,
      zoomDelta,
      bearingDelta,
      pitchDelta,
      pinchAround,
    } = combinedResult;
    let { around } = combinedResult;

    if (pinchAround !== undefined) {
      around = pinchAround;
    }

    // stop any ongoing camera animations (easeTo, flyTo)
    map.stop(true);

    around = around || map.transform.centerPoint;
    const loc = tr.pointLocation(panDelta ? around.sub(panDelta) : around);
    if (bearingDelta) {
      tr.bearing += bearingDelta;
    }
    if (pitchDelta) {
      tr.pitch += pitchDelta;
    }
    if (zoomDelta) {
      tr.zoom += zoomDelta;
    }
    tr.setLocationAtPoint(loc, around);

    this.map.update();
    if (!combinedResult.noInertia) {
      this.inertia.record(combinedResult);
    }
    this.fireEvents(combinedEventsInProgress, deactivatedHandlers);
  }

  private fireEvents(
    newEventsInProgress: { [key: string]: any },
    deactivatedHandlers: { [key: string]: any },
  ) {
    const wasMoving = isMoving(this.eventsInProgress);
    const nowMoving = isMoving(newEventsInProgress);

    const startEvents: { [key: string]: any } = {};

    for (const eventName in newEventsInProgress) {
      if (newEventsInProgress[eventName]) {
        const { originalEvent } = newEventsInProgress[eventName];
        if (!this.eventsInProgress[eventName]) {
          startEvents[`${eventName}start`] = originalEvent;
        }

        this.eventsInProgress[eventName] = newEventsInProgress[eventName];
      }
    }

    // fire start events only after this.eventsInProgress has been updated
    if (!wasMoving && nowMoving) {
      this.fireEvent('movestart', nowMoving.originalEvent);
    }

    for (const name in startEvents) {
      if (startEvents[name]) {
        this.fireEvent(name, startEvents[name]);
      }
    }

    if (newEventsInProgress.rotate) {
      this.bearingChanged = true;
    }

    if (nowMoving) {
      this.fireEvent('move', nowMoving.originalEvent);
    }

    for (const eventName in newEventsInProgress) {
      if (newEventsInProgress[eventName]) {
        const { originalEvent } = newEventsInProgress[eventName];
        this.fireEvent(eventName, originalEvent);
      }
    }

    const endEvents: { [key: string]: any } = {};

    let originalEndEvent;
    for (const eventName in this.eventsInProgress) {
      if (this.eventsInProgress[eventName]) {
        const { handlerName, originalEvent } = this.eventsInProgress[eventName];
        if (!this.handlersById[handlerName].isActive()) {
          delete this.eventsInProgress[eventName];
          originalEndEvent = deactivatedHandlers[handlerName] || originalEvent;
          endEvents[`${eventName}end`] = originalEndEvent;
        }
      }
    }

    for (const name in endEvents) {
      if (endEvents[name]) {
        this.fireEvent(name, endEvents[name]);
      }
    }

    const stillMoving = isMoving(this.eventsInProgress);
    if ((wasMoving || nowMoving) && !stillMoving) {
      this.updatingCamera = true;
      const inertialEase = this.inertia.onMoveEnd(
        this.map.dragPan.inertiaOptions,
      );

      const shouldSnapToNorth = (bearing: number) =>
        bearing !== 0 &&
        -this.bearingSnap < bearing &&
        bearing < this.bearingSnap;

      if (inertialEase) {
        if (shouldSnapToNorth(inertialEase.bearing || this.map.getBearing())) {
          inertialEase.bearing = 0;
        }
        this.map.easeTo(inertialEase, { originalEvent: originalEndEvent });
      } else {
        this.map.emit(
          'moveend',
          new Event('moveend', { originalEvent: originalEndEvent }),
        );
        if (shouldSnapToNorth(this.map.getBearing())) {
          this.map.resetNorth();
        }
      }
      this.bearingChanged = false;
      this.updatingCamera = false;
    }
  }

  private fireEvent(type: string, e: any) {
    this.map.emit(type, new Event(type, e ? { originalEvent: e } : {}));
  }
}

export default HandlerManager;
