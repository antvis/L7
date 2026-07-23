import type { IMapService } from '@antv/l7-core';

type EventHandler = (...args: any[]) => void;

interface EventBinding {
  target: IMapService | HTMLElement | Window | Document;
  event: string;
  handler: EventHandler;
}

/**
 * 事件管理器，用于统一管理事件绑定和解绑
 * 解决组件销毁时事件未正确清理导致的内存泄漏问题
 */
export class EventManager {
  private bindings: EventBinding[] = [];

  /**
   * 绑定事件
   * @param target 事件目标对象
   * @param event 事件名称
   * @param handler 事件处理函数
   */
  on(target: IMapService, event: string, handler: EventHandler): this;
  on(target: HTMLElement, event: string, handler: EventHandler): this;
  on(target: Window, event: string, handler: EventHandler): this;
  on(target: Document, event: string, handler: EventHandler): this;
  on(target: any, event: string, handler: EventHandler): this {
    this.bindings.push({ target, event, handler });

    // 根据目标类型选择绑定方式
    if (this.isMapService(target)) {
      target.on(event, handler);
    } else {
      target.addEventListener(event, handler);
    }
    return this;
  }

  /**
   * 解绑指定事件
   * @param target 事件目标对象
   * @param event 事件名称
   * @param handler 事件处理函数
   */
  off(target: IMapService, event: string, handler: EventHandler): this;
  off(target: HTMLElement, event: string, handler: EventHandler): this;
  off(target: Window, event: string, handler: EventHandler): this;
  off(target: Document, event: string, handler: EventHandler): this;
  off(target: any, event: string, handler: EventHandler): this {
    const index = this.bindings.findIndex(
      (b) => b.target === target && b.event === event && b.handler === handler,
    );

    if (index > -1) {
      this.bindings.splice(index, 1);

      if (this.isMapService(target)) {
        target.off(event, handler);
      } else {
        target.removeEventListener(event, handler);
      }
    }
    return this;
  }

  /**
   * 清除所有绑定的事件
   */
  clear(): void {
    this.bindings.forEach(({ target, event, handler }) => {
      if (this.isMapService(target)) {
        target.off(event, handler);
      } else {
        target.removeEventListener(event, handler);
      }
    });
    this.bindings = [];
  }

  /**
   * 获取当前绑定的事件数量
   */
  size(): number {
    return this.bindings.length;
  }

  /**
   * 判断目标是否为 MapService
   */
  private isMapService(target: any): target is IMapService {
    return target && typeof target.on === 'function' && typeof target.off === 'function';
  }
}

export default EventManager;
