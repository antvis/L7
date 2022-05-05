import { $window, isMini } from '@antv/l7-utils';
import EventEmitter from 'eventemitter3';
import { inject, injectable } from 'inversify';
import Hammer from 'l7hammerjs';
import 'reflect-metadata';
// @ts-ignore
import { TYPES } from '../../types';
import { ILngLat, IMapService } from '../map/IMapService';
import { IInteractionService, InteractionEvent } from './IInteractionService';
const DragEventMap: { [key: string]: string } = {
  panstart: 'dragstart',
  panmove: 'dragging',
  panend: 'dragend',
  pancancel: 'dragcancel',
};
/**
 * 由于目前 L7 与地图结合的方案为双 canvas 而非共享 WebGL Context，事件监听注册在地图底图上。
 * 除此之外，后续如果支持非地图场景，事件监听就需要注册在 L7 canvas 上。
 */
@injectable()
export default class InteractionService extends EventEmitter
  implements IInteractionService {
  public indragging: boolean = false;
  @inject(TYPES.IMapService)
  private readonly mapService: IMapService;
  // @ts-ignore
  // private hammertime: HammerManager;
  private hammertime: any;

  private lastClickTime: number = 0;

  private lastClickXY: number[] = [-1, -1];

  private clickTimer: number;

  private $containter: HTMLElement;

  public init() {
    // 注册事件在地图底图上
    this.addEventListenerOnMap();
    this.$containter = this.mapService.getMapContainer() as HTMLElement;
  }

  public destroy() {
    if (this.hammertime) {
      this.hammertime.destroy();
    }
    this.removeEventListenerOnMap();
    this.off(InteractionEvent.Hover);
  }

  public triggerHover({ x, y }: { x: number; y: number }) {
    this.emit(InteractionEvent.Hover, { x, y });
  }
  public triggerSelect(id: number): void {
    this.emit(InteractionEvent.Select, { featureId: id });
  }

  public triggerActive(id: number): void {
    this.emit(InteractionEvent.Active, { featureId: id });
  }

  public handleMiniEvent(e: any) {
    // @ts-ignore
    this.onHover({
      clientX: e.touches[0].pageX,
      clientY: e.touches[0].pageY,
      type: 'touch',
    });
  }

  private addEventListenerOnMap() {
    const $containter = this.mapService.getMapContainer();
    if ($containter) {
      if (isMini) {
        $window.document.addEventListener(
          'touchstart',
          this.handleMiniEvent.bind(this),
        );
      } else {
        const hammertime = new Hammer.Manager($containter);
        // $containter.addEventListener('mousemove', this.onHover);
        // $containter.addEventListener('click', this.onHover);
        hammertime.add(
          new Hammer.Tap({
            event: 'dblclick',
            taps: 2,
          }),
        );
        hammertime.add(
          new Hammer.Tap({
            event: 'click',
          }),
        );
        hammertime.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
        hammertime.add(new Hammer.Press({}));
        // hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL });
        // hammertime.get('pinch').set({ enable: true });
        hammertime.on('dblclick click', this.onHammer);
        hammertime.on('panstart panmove panend pancancel', this.onDrag);
        // $containter.addEventListener('touchstart', this.onTouch);
        $containter.addEventListener('mousemove', this.onHover);
        // $containter.addEventListener('click', this.onHover);
        $containter.addEventListener('mousedown', this.onHover, true);
        $containter.addEventListener('mouseup', this.onHover);
        $containter.addEventListener('contextmenu', this.onHover);
        this.hammertime = hammertime;
      }

      // // TODO: 根据场景注册事件到 L7 canvas 上
    }
  }
  private removeEventListenerOnMap() {
    if (isMini) {
      $window.document.removeEventListener(
        'touchstart',
        this.handleMiniEvent.bind(this),
      );
    } else {
      const $containter = this.mapService.getMapContainer();
      if ($containter) {
        $containter.removeEventListener('mousemove', this.onHover);
        // this.hammertime.off('dblclick click', this.onHammer);
        this.hammertime.off('panstart panmove panend pancancel', this.onDrag);
        // $containter.removeEventListener('touchstart', this.onTouch);
        // $containter.removeEventListener('click', this.onHover);
        $containter.removeEventListener('mousedown', this.onHover);
        $containter.removeEventListener('mouseup', this.onHover);
        // $containter.removeEventListener('dblclick', this.onHover);
        $containter.removeEventListener('contextmenu', this.onHover);
      }
    }
  }

  private onDrag = (target: any) => {
    const interactionTarget = this.interactionEvent(target);
    interactionTarget.type = DragEventMap[interactionTarget.type];
    interactionTarget.type === 'dragging'
      ? (this.indragging = true)
      : (this.indragging = false);
    this.emit(InteractionEvent.Drag, interactionTarget);
  };

  private onHammer = (target: any) => {
    target.srcEvent.stopPropagation();
    const interactionTarget = this.interactionEvent(target);
    this.emit(InteractionEvent.Hover, interactionTarget);
  };
  private onTouch = (target: TouchEvent) => {
    const touch = target.touches[0];
    // @ts-ignore
    this.onHover({
      x: touch.pageX,
      y: touch.pageY,
      type: 'touch',
    });
  };

  private interactionEvent(target: any) {
    const { type, pointerType } = target;
    let clientX;
    let clientY;
    if (pointerType === 'touch') {
      clientY = Math.floor(target.pointers[0].clientY);
      clientX = Math.floor(target.pointers[0].clientX);
    } else {
      clientY = Math.floor((target.srcEvent as MouseEvent).y);
      clientX = Math.floor((target.srcEvent as MouseEvent).x);
    }

    const $containter = this.mapService.getMapContainer();
    if ($containter) {
      const { top, left } = $containter.getBoundingClientRect();
      clientX -= left;
      clientY -= top;
    }
    const lngLat = this.mapService.containerToLngLat([clientX, clientY]);
    return { x: clientX, y: clientY, lngLat, type, target: target.srcEvent };
  }
  private onHover = (event: MouseEvent) => {
    const { clientX, clientY } = event;
    let x = clientX;
    let y = clientY;
    const type = event.type;
    const $containter = this.mapService.getMapContainer();
    if ($containter) {
      if (isMini) {
        // l7 - mini
        // @ts-ignore
        x = x - $containter.left - 0;
        // @ts-ignore
        y = y - $containter.top - 0;
      } else {
        const { top, left } = $containter.getBoundingClientRect();
        x = x - left - $containter.clientLeft;
        y = y - top - $containter.clientTop;
      }
    }
    const lngLat = this.mapService.containerToLngLat([x, y]);

    if (type === 'click') {
      if (!isMini) {
        // l7 - mini
        if ('ontouchstart' in document.documentElement === true) {
          return;
        }
      }
      this.isDoubleTap(x, y, lngLat);
      return;
    }
    if (type === 'touch') {
      this.isDoubleTap(x, y, lngLat);
      return;
    }
    if (type !== 'click' && type !== 'dblclick') {
      this.emit(InteractionEvent.Hover, {
        x,
        y,
        lngLat,
        type,
        target: event,
      });
    }
  };

  private isDoubleTap(x: number, y: number, lngLat: ILngLat) {
    const nowTime = new Date().getTime();
    let type = 'click';
    if (
      nowTime - this.lastClickTime < 400 &&
      Math.abs(this.lastClickXY[0] - x) < 10 &&
      Math.abs(this.lastClickXY[1] - y) < 10
    ) {
      this.lastClickTime = 0;
      this.lastClickXY = [-1, -1];
      if (this.clickTimer) {
        clearTimeout(this.clickTimer);
      }
      type = 'dblclick';
      this.emit(InteractionEvent.Hover, { x, y, lngLat, type });
    } else {
      this.lastClickTime = nowTime;
      this.lastClickXY = [x, y];
      // @ts-ignore
      this.clickTimer = setTimeout(() => {
        type = 'click';
        this.emit(InteractionEvent.Hover, { x, y, lngLat, type });
      }, 400);
    }
  }
}
