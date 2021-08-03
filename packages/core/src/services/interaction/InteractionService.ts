import EventEmitter from 'eventemitter3';
// import Hammer from 'hammerjs'; // l7 - mini
import { inject, injectable } from 'inversify';
// @ts-ignore
import { TYPES } from '../../types';
import { ILogService } from '../log/ILogService';
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
  @inject(TYPES.IMapService)
  private readonly mapService: IMapService;

  @inject(TYPES.ILogService)
  private readonly logger: ILogService;

  // private hammertime: HammerManager;// l7 - mini

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
    // if (this.hammertime) {// l7 - mini
    //   this.hammertime.destroy();// l7 - mini
    // }// l7 - mini
    // this.removeEventListenerOnMap();// l7 - mini
    // this.off(InteractionEvent.Hover);// l7 - mini
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

  private addEventListenerOnMap() {
    // const $containter = this.mapService.getMapContainer();// l7 - mini
    // if ($containter) {
    //   const hammertime = new Hammer.Manager($containter);
    //   hammertime.add(
    //     new Hammer.Tap({
    //       event: 'dblclick',
    //       taps: 2,
    //     }),
    //   );
    //   hammertime.add(
    //     new Hammer.Tap({
    //       event: 'click',
    //     }),
    //   );
    //   hammertime.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
    //   hammertime.add(new Hammer.Press({}));
    //   // hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    //   // hammertime.get('pinch').set({ enable: true });
    //   hammertime.on('dblclick click', this.onHammer);
    //   hammertime.on('panstart panmove panend pancancel', this.onDrag);
    //   // $containter.addEventListener('touchstart', this.onTouch);
    //   $containter.addEventListener('mousemove', this.onHover);
    //   // $containter.addEventListener('click', this.onHover);
    //   $containter.addEventListener('mousedown', this.onHover, true);
    //   $containter.addEventListener('mouseup', this.onHover);
    //   $containter.addEventListener('contextmenu', this.onHover);
    //   this.hammertime = hammertime;
    //   // TODO: 根据场景注册事件到 L7 canvas 上
    //   this.logger.debug('add event listeners on canvas');
    // }// l7 - mini
  }
  private removeEventListenerOnMap() {
    // const $containter = this.mapService.getMapContainer();// l7 - mini
    // if ($containter) {
    //   $containter.removeEventListener('mousemove', this.onHover);
    //   // this.hammertime.off('dblclick click', this.onHammer);
    //   this.hammertime.off('panstart panmove panend pancancel', this.onDrag);
    //   // $containter.removeEventListener('touchstart', this.onTouch);
    //   // $containter.removeEventListener('click', this.onHover);
    //   $containter.removeEventListener('mousedown', this.onHover);
    //   $containter.removeEventListener('mouseup', this.onHover);
    //   // $containter.removeEventListener('dblclick', this.onHover);
    //   $containter.removeEventListener('contextmenu', this.onHover);
    // }// l7 - mini
  }
  // @ts-ignore
  private onDrag = (target: HammerInput) => {
    const interactionTarget = this.interactionEvent(target);
    interactionTarget.type = DragEventMap[interactionTarget.type];
    this.emit(InteractionEvent.Drag, interactionTarget);
  };
  // @ts-ignore
  private onHammer = (target: HammerInput) => {
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
  // @ts-ignore
  private interactionEvent(target: HammerInput) {
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
      const { top, left } = $containter.getBoundingClientRect();
      x = x - left - $containter.clientLeft;
      y = y - top - $containter.clientTop;
    }
    const lngLat = this.mapService.containerToLngLat([x, y]);

    if (type === 'click') {
      if ('ontouchstart' in document.documentElement === true) {
        return;
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
