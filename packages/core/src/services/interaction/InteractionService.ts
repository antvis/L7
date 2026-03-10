import EventEmitter from 'eventemitter3';
import type { L7Container } from '../../inversify.config';
import type { ILngLat } from '../map/IMapService';
import type { IInteractionService, IInteractionTarget } from './IInteractionService';
import { InteractionEvent } from './IInteractionService';

// 配置常量
const CLICK_TIMEOUT = 250; // 单击判定超时（毫秒）
const DOUBLE_CLICK_DISTANCE = 10; // 双击判定距离（像素）
const PRESS_DURATION = 500; // 长按判定时长（毫秒）

// 拖拽事件映射
const DragEventMap: Record<string, string> = {
  pointerdown: 'dragstart',
  pointermove: 'dragging',
  pointerup: 'dragend',
  pointercancel: 'dragcancel',
  pointerleave: 'dragcancel',
};

/**
 * 交互服务 - 基于 Pointer Events API 统一处理鼠标和触摸事件
 *
 * 由于目前 L7 与地图结合的方案为双 canvas 而非共享 WebGL Context，
 * 事件监听注册在地图底图上。
 */
export default class InteractionService extends EventEmitter implements IInteractionService {
  public indragging: boolean = false;

  private readonly container: L7Container;

  // 拖拽状态
  private isDragging: boolean = false;
  private pointerId: number | null = null;

  // 单击/双击状态
  private clickTimer: ReturnType<typeof setTimeout> | null = null;
  private lastClickTime: number = 0;
  private lastClickXY: [number, number] = [-1, -1];

  // 长按状态
  private pressTimer: ReturnType<typeof setTimeout> | null = null;
  private pressStartPosition: {
    x: number;
    y: number;
    lngLat: ILngLat;
    target: PointerEvent;
  } | null = null;

  // 容器引用（用于移除事件监听）
  private $container: HTMLElement | null = null;

  // 缓存容器边界（性能优化）
  private containerBounds: {
    left: number;
    top: number;
    clientLeft: number;
    clientTop: number;
  } | null = null;

  constructor(container: L7Container) {
    super();
    this.container = container;
  }

  private get mapService() {
    return this.container.mapService;
  }

  public init(): void {
    const $container = this.mapService.getMapContainer();
    if (!$container) return;

    this.$container = $container;
    this.updateContainerBounds();

    // 使用 Pointer Events 统一处理鼠标和触摸
    $container.addEventListener('pointerdown', this.onPointerDown);
    $container.addEventListener('pointermove', this.onPointerMove);
    $container.addEventListener('pointerup', this.onPointerUp);
    $container.addEventListener('pointercancel', this.onPointerCancel);
    $container.addEventListener('pointerleave', this.onPointerLeave);

    // 额外监听 click/dblclick 用于区分单击和双击
    $container.addEventListener('click', this.onClick);
    $container.addEventListener('dblclick', this.onDoubleClick);

    // 监听右键菜单
    $container.addEventListener('contextmenu', this.onContextMenu);

    // 监听窗口滚动时更新容器边界
    window.addEventListener('scroll', this.updateContainerBounds, true);
    window.addEventListener('resize', this.updateContainerBounds);
  }

  public destroy(): void {
    // 清除所有计时器
    this.clearClickTimer();
    this.clearPressTimer();

    // 移除事件监听
    if (this.$container) {
      this.$container.removeEventListener('pointerdown', this.onPointerDown);
      this.$container.removeEventListener('pointermove', this.onPointerMove);
      this.$container.removeEventListener('pointerup', this.onPointerUp);
      this.$container.removeEventListener('pointercancel', this.onPointerCancel);
      this.$container.removeEventListener('pointerleave', this.onPointerLeave);
      this.$container.removeEventListener('click', this.onClick);
      this.$container.removeEventListener('dblclick', this.onDoubleClick);
      this.$container.removeEventListener('contextmenu', this.onContextMenu);
      this.$container = null;
    }

    window.removeEventListener('scroll', this.updateContainerBounds, true);
    window.removeEventListener('resize', this.updateContainerBounds);

    // 移除所有事件监听器
    this.removeAllListeners();
  }

  public triggerHover({ x, y }: { x: number; y: number }): void {
    this.emit(InteractionEvent.Hover, { x, y });
  }

  public triggerSelect(id: number): void {
    this.emit(InteractionEvent.Select, { featureId: id });
  }

  public triggerActive(id: number): void {
    this.emit(InteractionEvent.Active, { featureId: id });
  }

  // ==================== 私有方法 ====================

  private updateContainerBounds = (): void => {
    if (!this.$container) return;
    const rect = this.$container.getBoundingClientRect();
    this.containerBounds = {
      left: rect.left,
      top: rect.top,
      clientLeft: this.$container.clientLeft,
      clientTop: this.$container.clientTop,
    };
  };

  /**
   * 将客户端坐标转换为容器相对坐标
   */
  private clientToContainerCoords(clientX: number, clientY: number): { x: number; y: number } {
    if (!this.containerBounds) {
      this.updateContainerBounds();
    }
    if (!this.containerBounds) {
      return { x: clientX, y: clientY };
    }
    return {
      x: clientX - this.containerBounds.left - this.containerBounds.clientLeft,
      y: clientY - this.containerBounds.top - this.containerBounds.clientTop,
    };
  }

  /**
   * 创建交互目标对象
   */
  private createInteractionTarget(
    event: PointerEvent | MouseEvent,
    type: string,
  ): IInteractionTarget {
    const { x, y } = this.clientToContainerCoords(event.clientX, event.clientY);
    const lngLat = this.mapService.containerToLngLat([x, y]);
    return { x, y, lngLat, type, target: event };
  }

  /**
   * 判断两次点击是否为同一位置（双击判定）
   */
  private isSamePosition(x: number, y: number): boolean {
    return (
      Math.abs(this.lastClickXY[0] - x) < DOUBLE_CLICK_DISTANCE &&
      Math.abs(this.lastClickXY[1] - y) < DOUBLE_CLICK_DISTANCE
    );
  }

  // ==================== 计时器管理 ====================

  private clearClickTimer(): void {
    if (this.clickTimer) {
      clearTimeout(this.clickTimer);
      this.clickTimer = null;
    }
  }

  private clearPressTimer(): void {
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
      this.pressTimer = null;
    }
    this.pressStartPosition = null;
  }

  // ==================== 事件处理器 ====================

  private onPointerDown = (event: PointerEvent): void => {
    // 只处理主指针
    if (this.pointerId !== null) return;

    this.pointerId = event.pointerId;
    this.isDragging = true;
    this.indragging = true;

    // 发送拖拽开始事件
    const target = this.createInteractionTarget(event, DragEventMap['pointerdown']);
    this.emit(InteractionEvent.Drag, target);

    // 同时发送 mousedown 类型的 Hover 事件，保持向后兼容
    this.emit(InteractionEvent.Hover, this.createInteractionTarget(event, 'mousedown'));

    // 启动长按计时器
    this.startPressTimer(event);
  };

  private onPointerMove = (event: PointerEvent): void => {
    // 指针不匹配时忽略
    if (this.pointerId !== event.pointerId) {
      // 非拖拽状态下，发送 hover 事件
      if (!this.isDragging) {
        const target = this.createInteractionTarget(event, 'mousemove');
        this.emit(InteractionEvent.Hover, target);
      }
      return;
    }

    if (this.isDragging) {
      // 移动时取消长按
      this.clearPressTimer();

      const target = this.createInteractionTarget(event, DragEventMap['pointermove']);
      this.emit(InteractionEvent.Drag, target);
    }
  };

  private onPointerUp = (event: PointerEvent): void => {
    if (this.pointerId !== event.pointerId) return;

    if (this.isDragging) {
      const target = this.createInteractionTarget(event, DragEventMap['pointerup']);
      this.emit(InteractionEvent.Drag, target);
    }

    // 发送 mouseup 类型的 Hover 事件，保持向后兼容
    this.emit(InteractionEvent.Hover, this.createInteractionTarget(event, 'mouseup'));

    this.isDragging = false;
    this.indragging = false;
    this.pointerId = null;
    this.clearPressTimer();
  };

  private onPointerCancel = (event: PointerEvent): void => {
    if (this.pointerId !== event.pointerId) return;
    this.endDragging(event, 'pointercancel');
  };

  private onPointerLeave = (event: PointerEvent): void => {
    if (this.pointerId !== event.pointerId) return;
    this.endDragging(event, 'pointerleave');
  };

  private endDragging(event: PointerEvent, type: string): void {
    if (this.isDragging) {
      const target = this.createInteractionTarget(event, DragEventMap[type]);
      this.emit(InteractionEvent.Drag, target);
    }

    this.isDragging = false;
    this.indragging = false;
    this.pointerId = null;
    this.clearPressTimer();
  }

  private startPressTimer(event: PointerEvent): void {
    this.clearPressTimer();

    const { x, y } = this.clientToContainerCoords(event.clientX, event.clientY);
    const lngLat = this.mapService.containerToLngLat([x, y]);

    this.pressStartPosition = { x, y, lngLat, target: event };

    this.pressTimer = setTimeout(() => {
      if (this.pressStartPosition) {
        this.emit(InteractionEvent.Press, {
          x: this.pressStartPosition.x,
          y: this.pressStartPosition.y,
          lngLat: this.pressStartPosition.lngLat,
          type: 'press',
          target: this.pressStartPosition.target,
        });
        this.pressStartPosition = null;
      }
    }, PRESS_DURATION);
  }

  private onClick = (event: MouseEvent): void => {
    // 注意：不要调用 stopPropagation()，否则会阻止事件冒泡到底层地图（如 Mapbox）
    // 导致 l7-draw 等依赖地图原生事件的库无法正常工作

    const { x, y } = this.clientToContainerCoords(event.clientX, event.clientY);
    const lngLat = this.mapService.containerToLngLat([x, y]);
    const now = Date.now();

    // 检测双击
    if (now - this.lastClickTime < CLICK_TIMEOUT * 2 && this.isSamePosition(x, y)) {
      // 是双击，清除单击计时器
      this.clearClickTimer();
      this.lastClickTime = 0;
      this.lastClickXY = [-1, -1];

      // 双击事件由 onDoubleClick 处理，这里不重复发送
      return;
    }

    // 记录点击信息
    this.lastClickTime = now;
    this.lastClickXY = [x, y];

    // 延迟发送单击事件，等待可能的双击
    this.clearClickTimer();
    this.clickTimer = setTimeout(() => {
      // 发送 Click 事件
      this.emit(InteractionEvent.Click, {
        x,
        y,
        lngLat,
        type: 'click',
        target: event,
      });
      // 同时通过 Hover 事件发送，保持向后兼容
      this.emit(InteractionEvent.Hover, {
        x,
        y,
        lngLat,
        type: 'click',
        target: event,
      });
      this.clickTimer = null;
    }, CLICK_TIMEOUT);
  };

  private onDoubleClick = (event: MouseEvent): void => {
    // 注意：不要调用 stopPropagation()，否则会阻止事件冒泡到底层地图

    // 清除单击计时器
    this.clearClickTimer();

    const { x, y } = this.clientToContainerCoords(event.clientX, event.clientY);
    const lngLat = this.mapService.containerToLngLat([x, y]);

    // 重置双击检测状态
    this.lastClickTime = 0;
    this.lastClickXY = [-1, -1];

    // 发送 DblClick 事件
    this.emit(InteractionEvent.DblClick, {
      x,
      y,
      lngLat,
      type: 'dblclick',
      target: event,
    });
    // 同时通过 Hover 事件发送，保持向后兼容
    this.emit(InteractionEvent.Hover, {
      x,
      y,
      lngLat,
      type: 'dblclick',
      target: event,
    });
  };

  private onContextMenu = (event: MouseEvent): void => {
    const { x, y } = this.clientToContainerCoords(event.clientX, event.clientY);
    const lngLat = this.mapService.containerToLngLat([x, y]);

    this.emit(InteractionEvent.Hover, {
      x,
      y,
      lngLat,
      type: 'contextmenu',
      target: event,
    });
  };
}
