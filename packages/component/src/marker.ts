import type {
  ILngLat,
  IMapService,
  IMarkerContainerAndBounds,
  IMarkerOption,
  IPoint,
  IPopup,
  L7Container,
} from '@antv/l7-core';
import { DOM, anchorTranslate, anchorType, applyAnchorClass, bindAll, isPC } from '@antv/l7-utils';
import { EventEmitter } from 'eventemitter3';

//  marker 支持 dragger 未完成
export default class Marker extends EventEmitter {
  private markerOption: IMarkerOption;
  private popup: IPopup;
  private mapsService: IMapService<unknown>;
  private lngLat: ILngLat;
  private scene: L7Container;
  private added: boolean = false;
  private preLngLat = { lng: 0, lat: 0 };
  // tslint:disable-next-line: no-empty
  public getMarkerLayerContainerSize(): IMarkerContainerAndBounds | void {}

  constructor(option?: Partial<IMarkerOption>) {
    super();
    this.markerOption = {
      ...this.getDefault(),
      ...option,
    };
    bindAll(['update', 'onMove', 'onMapClick', 'updatePositionWhenZoom'], this);
    this.init();
  }

  public getDefault() {
    return {
      element: undefined, // DOM element
      anchor: anchorType.BOTTOM,
      offsets: [0, 0],
      color: '#5B8FF9',
      draggable: false,
      overflowHide: true,
    };
  }

  public addTo(scene: L7Container) {
    this.scene = scene;
    this.mapsService = scene.mapService;
    const { element } = this.markerOption;
    this.mapsService.getMarkerContainer().appendChild(element as HTMLElement);
    this.registerMarkerEvent(element as HTMLElement);
    this.mapsService.on('camerachange', this.update); // 注册高德1.x 的地图事件监听
    this.update();
    this.updateDraggable();
    this.added = true;
    this.emit('added');
    return this;
  }

  public remove() {
    if (this.mapsService) {
      this.mapsService.off('click', this.onMapClick);
      this.mapsService.off('move', this.update);
      this.mapsService.off('moveend', this.update);
      this.mapsService.off('camerachange', this.update);
    }
    this.unRegisterMarkerEvent();
    this.removeAllListeners();
    const { element } = this.markerOption;
    if (element) {
      DOM.remove(element);
    }
    if (this.popup) {
      this.popup.remove();
    }
    return this;
  }

  public setLnglat(lngLat: ILngLat | IPoint) {
    this.lngLat = lngLat as ILngLat;
    if (Array.isArray(lngLat)) {
      this.lngLat = {
        lng: lngLat[0],
        lat: lngLat[1],
      };
    }

    if (this.popup) {
      this.popup.setLnglat(this.lngLat);
    }
    this.update();
    return this;
  }

  public getLnglat(): ILngLat {
    return this.lngLat;
  }

  public getElement(): HTMLElement {
    return this.markerOption.element as HTMLElement;
  }

  public setElement(el: HTMLElement): this {
    if (!this.added) {
      this.once('added', () => {
        this.setElement(el);
      });
      return this;
    }
    const { element } = this.markerOption;
    if (element) {
      DOM.remove(element);
    }
    this.markerOption.element = el;
    this.init();
    this.mapsService.getMarkerContainer().appendChild(el as HTMLElement);
    this.registerMarkerEvent(el as HTMLElement);
    this.updateDraggable();
    this.update();
    return this;
  }

  public openPopup(): this {
    if (!this.added) {
      this.once('added', () => {
        this.openPopup();
      });
      return this;
    }
    const popup = this.popup;
    if (!popup) {
      return this;
    }
    if (!popup.isOpen()) {
      popup.addTo(this.scene);
    }
    return this;
  }

  public closePopup(): this {
    if (!this.added) {
      this.once('added', () => {
        this.closePopup();
      });
    }
    const popup = this.popup;
    if (popup) {
      popup.remove();
    }
    return this;
  }

  public setPopup(popup: IPopup) {
    this.popup = popup;
    if (this.lngLat) {
      this.popup.setLnglat(this.lngLat);
    }
    return this;
  }

  public togglePopup() {
    const popup = this.popup;
    if (!popup) {
      return this;
    } else if (popup.isOpen()) {
      popup.remove();
    } else {
      popup.addTo(this.scene);
    }
    return this;
  }

  public getPopup() {
    return this.popup;
  }

  public getOffset(): number[] {
    return this.markerOption.offsets;
  }

  public setDraggable(draggable: boolean) {
    this.markerOption.draggable = draggable;
    this.updateDraggable();
  }

  public getDraggable() {
    return this.markerOption.draggable;
  }

  public getExtData() {
    return this.markerOption.extData;
  }

  public setExtData(data: any) {
    this.markerOption.extData = data;
  }

  private update() {
    if (!this.mapsService) {
      return;
    }
    const { element, anchor } = this.markerOption;
    this.updatePosition();
    DOM.setTransform(element as HTMLElement, `${anchorTranslate[anchor]}`);
  }
  //天地图在开始缩放时触发 更新目标位置时添加过渡效果
  private updatePositionWhenZoom(ev: { map: any; center: any; zoom: any }) {
    if (!this.mapsService) {
      return;
    }
    const { element, offsets } = this.markerOption;
    const { lng, lat } = this.lngLat;
    if (element) {
      element.style.display = 'block';
      element.style.whiteSpace = 'nowrap';
      const { containerHeight, containerWidth, bounds } =
        this.getMarkerLayerContainerSize() || this.getCurrentContainerSize();
      if (!bounds) {
        return;
      }
      const map = ev.map;
      const center = ev.center;
      const zoom = ev.zoom;
      const projectedCenter = map.DE(this.lngLat, zoom, center);
      projectedCenter.x = Math.round(projectedCenter.x + offsets[0]);
      projectedCenter.y = Math.round(projectedCenter.y - offsets[1]);
      // 当前可视区域包含跨日界线
      if (Math.abs(bounds[0][0]) > 180 || Math.abs(bounds[1][0]) > 180) {
        if (projectedCenter.x > containerWidth) {
          // 日界线右侧点左移
          const newPos = this.mapsService.lngLatToContainer([lng - 360, lat]);
          projectedCenter.x = newPos.x;
        }
        if (projectedCenter.x < 0) {
          // 日界线左侧点右移
          const newPos = this.mapsService.lngLatToContainer([lng + 360, lat]);
          projectedCenter.x = newPos.x;
        }
      }
      if (
        projectedCenter.x > containerWidth ||
        projectedCenter.x < 0 ||
        projectedCenter.y > containerHeight ||
        projectedCenter.y < 0
      ) {
        element.style.display = 'none';
      }
      element.style.left = projectedCenter.x + 'px';
      element.style.top = projectedCenter.y + 'px';
      element.style.transition =
        'left 0.25s cubic-bezier(0,0,0.25,1), top 0.25s cubic-bezier(0,0,0.25,1)';
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onMapClick(e: MouseEvent) {
    const { element } = this.markerOption;
    if (this.popup && element) {
      this.togglePopup();
    }
  }

  private getCurrentContainerSize() {
    const container = this.mapsService.getContainer();
    return {
      containerHeight: container?.scrollHeight || 0,
      containerWidth: container?.scrollWidth || 0,
      bounds: this.mapsService.getBounds(),
    };
  }

  private updateDraggable() {
    const { element } = this.markerOption;
    element?.removeEventListener('mousedown', this.onMarkerDragStart);
    this.mapsService.off('mousemove', this.onMarkerDragMove);
    document.removeEventListener('mouseup', this.onMarkerDragEnd);
    if (this.markerOption.draggable) {
      element?.addEventListener('mousedown', this.onMarkerDragStart);
    }
  }

  private onMarkerDragStart = (e: MouseEvent) => {
    const mapContainer = this.mapsService.getContainer();
    if (!mapContainer) {
      return;
    }
    this.mapsService.setMapStatus({
      dragEnable: false,
      zoomEnable: false,
    });
    const { left: containerX, top: containerY } = mapContainer.getClientRects()[0]!;
    const { x: clickX, y: clickY } = e;
    this.preLngLat = this.mapsService.containerToLngLat([clickX - containerX, clickY - containerY]);
    this.mapsService.on('mousemove', this.onMarkerDragMove);
    document.addEventListener('mouseup', this.onMarkerDragEnd);
    this.emit('dragstart', this.lngLat);
  };

  private onMarkerDragMove = (e: any) => {
    // 适配不同底图，事件返回的数据名称不一致
    const lngLat: ILngLat = e.lngLat || e.lnglat;
    const { lng: preLng, lat: preLat } = this.preLngLat;
    const { lng: curLng, lat: curLat } = lngLat;
    const newLngLat = {
      lng: this.lngLat.lng + curLng - preLng,
      lat: this.lngLat.lat + curLat - preLat,
    };
    this.setLnglat(newLngLat);
    this.preLngLat = lngLat;
    this.emit('dragging', newLngLat);
  };

  private onMarkerDragEnd = () => {
    this.mapsService.setMapStatus({
      dragEnable: true,
      zoomEnable: true,
    });

    this.mapsService.off('mousemove', this.onMarkerDragMove);
    document.removeEventListener('mouseup', this.onMarkerDragEnd);
    this.emit('dragend', this.lngLat);
  };

  private updatePosition() {
    if (!this.mapsService) {
      return;
    }
    const { element, offsets } = this.markerOption;
    const { lng, lat } = this.lngLat;
    const pos = this.mapsService.lngLatToContainer([lng, lat]);
    if (element) {
      element.style.display = 'block';
      element.style.whiteSpace = 'nowrap';
      const { containerHeight, containerWidth, bounds } =
        this.getMarkerLayerContainerSize() || this.getCurrentContainerSize();

      if (!bounds) {
        return;
      }
      // 当前可视区域包含跨日界线
      if (Math.abs(bounds[0][0]) > 180 || Math.abs(bounds[1][0]) > 180) {
        if (pos.x > containerWidth) {
          // 日界线右侧点左移
          const newPos = this.mapsService.lngLatToContainer([lng - 360, lat]);
          pos.x = newPos.x;
        }
        if (pos.x < 0) {
          // 日界线左侧点右移
          const newPos = this.mapsService.lngLatToContainer([lng + 360, lat]);
          pos.x = newPos.x;
        }
      }
      if (this.markerOption.overflowHide) {
        // 不在当前可视区域内隐藏点
        if (pos.x > containerWidth || pos.x < 0 || pos.y > containerHeight || pos.y < 0) {
          element.style.display = 'none';
        }
      }

      element.style.left = pos.x + offsets[0] + 'px';
      element.style.top = pos.y - offsets[1] + 'px';
    }
  }

  private init() {
    let { element } = this.markerOption;
    const { color, anchor } = this.markerOption;
    if (!element) {
      element = DOM.create('div') as HTMLDivElement;
      this.markerOption.element = element;
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttributeNS(null, 'display', 'block');
      svg.setAttributeNS(null, 'height', '48px');
      svg.setAttributeNS(null, 'width', '48px');
      svg.setAttributeNS(null, 'viewBox', '0 0 1024 1024');

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttributeNS(
        null,
        'd',
        'M512 490.666667C453.12 490.666667 405.333333 442.88 405.333333 384 405.333333 325.12 453.12 277.333333 512 277.333333 570.88 277.333333 618.666667 325.12 618.666667 384 618.666667 442.88 570.88 490.666667 512 490.666667M512 85.333333C346.88 85.333333 213.333333 218.88 213.333333 384 213.333333 608 512 938.666667 512 938.666667 512 938.666667 810.666667 608 810.666667 384 810.666667 218.88 677.12 85.333333 512 85.333333Z',
      );
      path.setAttributeNS(null, 'fill', color);
      svg.appendChild(path);
      element.appendChild(svg);
    }
    DOM.addClass(element, 'l7-marker');
    Object.keys(this.markerOption.style || {}).forEach(
      // @ts-ignore
      (key: keyof CSSStyleDeclaration) => {
        const value = this.markerOption?.style && (this.markerOption?.style[key] as string);
        if (element) {
          // @ts-ignore
          (element.style as CSSStyleDeclaration)[key] = value;
        }
      },
    );

    applyAnchorClass(element, anchor, 'marker');
  }
  private registerMarkerEvent(element: HTMLElement) {
    element.addEventListener('click', this.onMapClick);
    element.addEventListener('mousemove', this.eventHandle);
    element.addEventListener('click', this.eventHandle);
    element.addEventListener('mousedown', this.eventHandle);
    element.addEventListener('mouseup', this.eventHandle);
    element.addEventListener('dblclick', this.eventHandle);
    element.addEventListener('contextmenu', this.eventHandle);
    element.addEventListener('mouseover', this.eventHandle);
    element.addEventListener('mouseout', this.eventHandle);
    element.addEventListener('touchstart', this.eventHandle);
    element.addEventListener('touchend', this.eventHandle);
  }
  private unRegisterMarkerEvent() {
    const element = this.getElement();
    element.removeEventListener('click', this.onMapClick);
    element.removeEventListener('mousemove', this.eventHandle);
    element.removeEventListener('click', this.eventHandle);
    element.removeEventListener('mousedown', this.eventHandle);
    element.removeEventListener('mouseup', this.eventHandle);
    element.removeEventListener('dblclick', this.eventHandle);
    element.removeEventListener('contextmenu', this.eventHandle);
    element.removeEventListener('mouseover', this.eventHandle);
    element.removeEventListener('mouseout', this.eventHandle);
    element.removeEventListener('touchstart', this.eventHandle);
    element.removeEventListener('touchend', this.eventHandle);
  }

  private eventHandle = (e: MouseEvent | TouchEvent) => {
    this.polyfillEvent(e);
    this.emit(e.type, {
      target: e,
      data: this.markerOption.extData,
      lngLat: this.lngLat,
    });
  };

  /**
   * 高德 2.x 使用了 fastClick.js 避免延迟，导致 IOS 移动端的 click 事件不会正常触发，需要手动触发
   * @param e
   */
  private touchStartTime: number;
  private polyfillEvent(e: MouseEvent | TouchEvent) {
    if (!this.mapsService || this.mapsService.getType() !== 'amap') {
      return;
    }
    if (!isPC()) {
      if (e.type === 'touchstart') {
        this.touchStartTime = Date.now();
      }
      if (e.type === 'touchend' && Date.now() - this.touchStartTime < 300) {
        this.emit('click', {
          target: e,
          data: this.markerOption.extData,
          lngLat: this.lngLat,
        });
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private addDragHandler(e: MouseEvent) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onUp(e: MouseEvent) {
    throw new Error('Method not implemented.');
  }
}
