import { DOM, getBBoxFromPoints } from '@antv/l7-utils';
import { EventEmitter } from 'eventemitter3';
import type { Scene } from './index';

export const BoxSelectEventList = ['selectstart', 'selecting', 'selectend'];

export type BoxSelectOptions = {
  className?: string;
};

// TODO: 将 BoxSelect 模块放在哪里比较合适
export default class BoxSelect extends EventEmitter {
  protected scene: Scene;
  protected options: BoxSelectOptions;

  protected isEnable = false;
  protected box: HTMLElement;
  protected startEvent: any;
  protected endEvent: any;

  constructor(scene: Scene, options: BoxSelectOptions = {}) {
    super();

    this.scene = scene;
    this.options = options;
  }

  public get container() {
    return this.scene.getMapService().getMarkerContainer();
  }

  public enable() {
    if (this.isEnable) {
      return;
    }
    const { className } = this.options;
    this.scene.setMapStatus({
      dragEnable: false,
    });
    this.container.style.cursor = 'crosshair';
    if (!this.box) {
      const box = DOM.create('div', undefined, this.container) as HTMLDivElement;
      box.classList.add('l7-select-box');
      if (className) {
        box.classList.add(className);
      }
      box.style.display = 'none';
      this.box = box;
    }
    this.scene.on('dragstart', this.onDragStart);
    this.scene.on('dragging', this.onDragging);
    this.scene.on('dragend', this.onDragEnd);
    this.isEnable = true;
  }

  public disable() {
    if (!this.isEnable) {
      return;
    }
    this.scene.setMapStatus({
      dragEnable: true,
    });
    this.container.style.cursor = 'auto';
    this.scene.off('dragstart', this.onDragStart);
    this.scene.off('dragging', this.onDragging);
    this.scene.off('dragend', this.onDragEnd);
    this.isEnable = false;
  }

  protected onDragStart = (e: any) => {
    this.box.style.display = 'block';
    this.startEvent = this.endEvent = e;
    this.syncBoxBound();
    this.emit('selectstart', this.getLngLatBox(), this.startEvent, this.endEvent);
  };

  protected onDragging = (e: any) => {
    this.endEvent = e;
    this.syncBoxBound();
    this.emit('selecting', this.getLngLatBox(), this.startEvent, this.endEvent);
  };

  protected onDragEnd = (e: any) => {
    this.endEvent = e;
    this.box.style.display = 'none';
    this.emit('selectend', this.getLngLatBox(), this.startEvent, this.endEvent);
  };

  protected syncBoxBound() {
    const { x: x1, y: y1 } = this.startEvent;
    const { x: x2, y: y2 } = this.endEvent;
    const left = Math.min(x1, x2);
    const top = Math.min(y1, y2);
    const width = Math.abs(x1 - x2);
    const height = Math.abs(y1 - y2);
    this.box.style.top = `${top}px`;
    this.box.style.left = `${left}px`;
    this.box.style.width = `${width}px`;
    this.box.style.height = `${height}px`;
  }

  protected getLngLatBox() {
    const {
      lngLat: { lng: lng1, lat: lat1 },
    } = this.startEvent;
    const {
      lngLat: { lng: lng2, lat: lat2 },
    } = this.endEvent;
    return getBBoxFromPoints([
      [lng1, lat1],
      [lng2, lat2],
    ]);
  }
}
