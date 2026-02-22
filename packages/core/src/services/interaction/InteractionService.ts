import EventEmitter from 'eventemitter3';
import type { L7Container } from '../../inversify.config';
import type { ILngLat } from '../map/IMapService';
import type { IInteractionService } from './IInteractionService';
import { InteractionEvent } from './IInteractionService';

const DragEventMap: { [key: string]: string } = {
  pointerdown: 'dragstart',
  pointermove: 'dragging',
  pointerup: 'dragend',
  pointercancel: 'dragcancel',
};

/**
 * 由于目前 L7 与地图结合的方案为双 canvas 而非共享 WebGL Context，事件监听注册在地图底图上。
 * 除此之外，后续如果支持非地图场景，事件监听就需要注册在 L7 canvas 上。
 */
export default class InteractionService extends EventEmitter implements IInteractionService {
  public indragging: boolean = false;

  get mapService() {
    return this.container.mapService;
  }

  constructor(private readonly container: L7Container) {
    super();
  }

  private lastClickTime: number = 0;

  private lastClickXY: number[] = [-1, -1];

  private clickTimer: ReturnType<typeof setTimeout> | null = null;

  private $container: HTMLElement;

  // 拖拽状态
  private isDragging: boolean = false;
  private pointerId: number | null = null;

  // 长按状态
  private pressTimer: ReturnType<typeof setTimeout> | null = null;
  private pressStartTarget: { x: number; y: number; lngLat: ILngLat; target: PointerEvent } | null =
    null;

  public init() {
    // 注册事件在地图底图上
    this.addEventListenerOnMap();
    this.$container = this.mapService.getMapContainer() as HTMLElement;
  }

  public destroy() {
    this.removeEventListeners();
    this.off(InteractionEvent.Hover);
    if (this.clickTimer) {
      clearTimeout(this.clickTimer);
      this.clickTimer = null;
    }
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
      this.pressTimer = null;
    }
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
    const $container = this.mapService.getMapContainer();
    if ($container) {
      // Pointer events for drag handling
      $container.addEventListener('pointerdown', this.onPointerDown);
      $container.addEventListener('pointermove', this.onPointerMove);
      $container.addEventListener('pointerup', this.onPointerUp);
      $container.addEventListener('pointercancel', this.onPointerCancel);

      // Mouse events for hover
      $container.addEventListener('mousemove', this.onHover);
      $container.addEventListener('mousedown', this.onHover, true);
      $container.addEventListener('mouseup', this.onHover);
      $container.addEventListener('contextmenu', this.onHover);

      // Touch events
      $container.addEventListener('touchstart', this.onTouch);
      $container.addEventListener('touchend', this.onTouchEnd);
      $container.addEventListener('touchmove', this.onTouchMove);

      // Click and double click
      $container.addEventListener('click', this.onClick);
      $container.addEventListener('dblclick', this.onDoubleClick);
    }
  }

  private removeEventListeners() {
    const $container = this.mapService.getMapContainer();
    if ($container) {
      $container.removeEventListener('pointerdown', this.onPointerDown);
      $container.removeEventListener('pointermove', this.onPointerMove);
      $container.removeEventListener('pointerup', this.onPointerUp);
      $container.removeEventListener('pointercancel', this.onPointerCancel);

      $container.removeEventListener('mousemove', this.onHover);
      $container.removeEventListener('mousedown', this.onHover);
      $container.removeEventListener('mouseup', this.onHover);
      $container.removeEventListener('contextmenu', this.onHover);

      $container.removeEventListener('touchstart', this.onTouch);
      $container.removeEventListener('touchend', this.onTouchEnd);
      $container.removeEventListener('touchmove', this.onTouchMove);

      $container.removeEventListener('click', this.onClick);
      $container.removeEventListener('dblclick', this.onDoubleClick);
    }
  }

  private onPointerDown = (event: PointerEvent) => {
    // 只处理主指针（避免多点触控问题）
    if (this.pointerId !== null) return;

    this.pointerId = event.pointerId;
    this.isDragging = true;
    this.indragging = true;

    const interactionTarget = this.createInteractionTarget(event, 'pointerdown');
    interactionTarget.type = DragEventMap['pointerdown'];
    this.emit(InteractionEvent.Drag, interactionTarget);

    // 开始长按计时器
    this.startPressTimer(event);
  };

  private onPointerMove = (event: PointerEvent) => {
    if (this.pointerId !== event.pointerId) return;

    if (this.isDragging) {
      // 取消长按计时器（因为移动了）
      this.cancelPressTimer();

      const interactionTarget = this.createInteractionTarget(event, 'pointermove');
      interactionTarget.type = DragEventMap['pointermove'];
      this.emit(InteractionEvent.Drag, interactionTarget);
    }
  };

  private onPointerUp = (event: PointerEvent) => {
    if (this.pointerId !== event.pointerId) return;

    if (this.isDragging) {
      const interactionTarget = this.createInteractionTarget(event, 'pointerup');
      interactionTarget.type = DragEventMap['pointerup'];
      this.emit(InteractionEvent.Drag, interactionTarget);
    }

    this.isDragging = false;
    this.indragging = false;
    this.pointerId = null;
    this.cancelPressTimer();
  };

  private onPointerCancel = (event: PointerEvent) => {
    if (this.pointerId !== event.pointerId) return;

    if (this.isDragging) {
      const interactionTarget = this.createInteractionTarget(event, 'pointercancel');
      interactionTarget.type = DragEventMap['pointercancel'];
      this.emit(InteractionEvent.Drag, interactionTarget);
    }

    this.isDragging = false;
    this.indragging = false;
    this.pointerId = null;
    this.cancelPressTimer();
  };

  private startPressTimer(event: PointerEvent) {
    this.cancelPressTimer();
    const interactionTarget = this.createInteractionTarget(event, 'pointerdown');
    this.pressStartTarget = {
      x: interactionTarget.x,
      y: interactionTarget.y,
      lngLat: interactionTarget.lngLat,
      target: event,
    };

    // 长按 500ms 触发 press 事件
    this.pressTimer = setTimeout(() => {
      if (this.pressStartTarget) {
        this.emit(InteractionEvent.Hover, {
          x: this.pressStartTarget.x,
          y: this.pressStartTarget.y,
          lngLat: this.pressStartTarget.lngLat,
          type: 'press',
          target: this.pressStartTarget.target,
        });
        this.pressStartTarget = null;
      }
    }, 500);
  }

  private cancelPressTimer() {
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
      this.pressTimer = null;
    }
    this.pressStartTarget = null;
  }

  private createInteractionTarget(event: PointerEvent, type: string) {
    const $container = this.mapService.getMapContainer();
    let x = event.clientX;
    let y = event.clientY;

    if ($container) {
      const { top, left } = $container.getBoundingClientRect();
      x = x - left - $container.clientLeft;
      y = y - top - $container.clientTop;
    }

    const lngLat = this.mapService.containerToLngLat([x, y]);
    return { x, y, lngLat, type, target: event };
  }

  private onClick = (event: MouseEvent) => {
    event.stopPropagation();
    const { clientX, clientY } = event;
    const $container = this.mapService.getMapContainer();
    let x = clientX;
    let y = clientY;

    if ($container) {
      const { top, left } = $container.getBoundingClientRect();
      x = x - left - $container.clientLeft;
      y = y - top - $container.clientTop;
    }

    const lngLat = this.mapService.containerToLngLat([x, y]);
    this.handleSingleDoubleTap(x, y, lngLat, 'click');
  };

  private onDoubleClick = (event: MouseEvent) => {
    event.stopPropagation();
    const { clientX, clientY } = event;
    const $container = this.mapService.getMapContainer();
    let x = clientX;
    let y = clientY;

    if ($container) {
      const { top, left } = $container.getBoundingClientRect();
      x = x - left - $container.clientLeft;
      y = y - top - $container.clientTop;
    }

    const lngLat = this.mapService.containerToLngLat([x, y]);

    // 清除单击计时器
    if (this.clickTimer) {
      clearTimeout(this.clickTimer);
      this.clickTimer = null;
    }

    this.emit(InteractionEvent.Hover, { x, y, lngLat, type: 'dblclick', target: event });
  };

  private handleSingleDoubleTap(x: number, y: number, lngLat: ILngLat, type: string) {
    const nowTime = Date.now();
    if (
      nowTime - this.lastClickTime < 400 &&
      Math.abs(this.lastClickXY[0] - x) < 10 &&
      Math.abs(this.lastClickXY[1] - y) < 10
    ) {
      this.lastClickTime = 0;
      this.lastClickXY = [-1, -1];
      if (this.clickTimer) {
        clearTimeout(this.clickTimer);
        this.clickTimer = null;
      }
      this.emit(InteractionEvent.Hover, { x, y, lngLat, type: 'dblclick' });
    } else {
      this.lastClickTime = nowTime;
      this.lastClickXY = [x, y];
      // 延迟触发单击，等待可能的第二次点击
      this.clickTimer = setTimeout(() => {
        this.emit(InteractionEvent.Hover, { x, y, lngLat, type: 'click' });
        this.clickTimer = null;
      }, 400);
    }
  }

  private onTouch = (event: TouchEvent) => {
    const touch = event.touches[0];
    this.onHover({
      clientX: touch.clientX,
      clientY: touch.clientY,
      type: 'touchstart',
    } as MouseEvent);
  };

  private onTouchEnd = (event: TouchEvent) => {
    if (event.changedTouches.length > 0) {
      const touch = event.changedTouches[0];
      this.onHover({
        clientX: touch.clientX,
        clientY: touch.clientY,
        type: 'touchend',
      } as MouseEvent);
    }
  };

  private onTouchMove = (event: TouchEvent) => {
    const touch = event.changedTouches[0];
    this.onHover({
      clientX: touch.clientX,
      clientY: touch.clientY,
      type: 'touchmove',
    } as MouseEvent);
  };

  private onHover = (event: MouseEvent) => {
    const { clientX, clientY } = event;
    let x = clientX;
    let y = clientY;
    const type = event.type;
    const $container = this.mapService.getMapContainer();

    if ($container) {
      const { top, left } = $container.getBoundingClientRect();
      x = x - left - $container.clientLeft;
      y = y - top - $container.clientTop;
    }

    const lngLat = this.mapService.containerToLngLat([x, y]);

    if (type === 'click') {
      this.handleSingleDoubleTap(x, y, lngLat, type);
      return;
    }

    if (type === 'touch') {
      this.handleSingleDoubleTap(x, y, lngLat, type);
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
}
