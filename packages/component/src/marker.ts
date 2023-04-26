import {
  ILngLat,
  IMapService,
  IMarkerContainerAndBounds,
  IMarkerOption,
  IPoint,
  IPopup,
  ISceneService,
  TYPES,
} from '@antv/l7-core';
import {
  anchorTranslate,
  anchorType,
  applyAnchorClass,
  bindAll,
  DOM,
  isPC,
} from '@antv/l7-utils';
import { EventEmitter } from 'eventemitter3';
import { Container } from 'inversify';
//  marker 支持 dragger 未完成
export default class Marker extends EventEmitter {
  private markerOption: IMarkerOption;
  private defaultMarker: boolean;
  private popup: IPopup;
  private mapsService: IMapService<unknown>;
  private sceneSerive: ISceneService;
  private lngLat: ILngLat;
  private scene: Container;
  private added: boolean = false;
  // tslint:disable-next-line: no-empty
  public getMarkerLayerContainerSize(): IMarkerContainerAndBounds | void {}

  constructor(option?: Partial<IMarkerOption>) {
    super();
    this.markerOption = {
      ...this.getDefault(),
      ...option,
    };
    bindAll(['update', 'onMove', 'onMapClick'], this);
    this.init();
  }

  public getDefault() {
    return {
      element: undefined, // DOM element
      anchor: anchorType.BOTTOM,
      offsets: [0, 0],
      color: '#5B8FF9',
      draggable: false,
    };
  }

  public addTo(scene: Container) {
    // this.remove();
    this.scene = scene;
    this.mapsService = scene.get<IMapService>(TYPES.IMapService);
    this.sceneSerive = scene.get<ISceneService>(TYPES.ISceneService);
    const { element } = this.markerOption;
    // this.sceneSerive.getSceneContainer().appendChild(element as HTMLElement);
    this.mapsService.getMarkerContainer().appendChild(element as HTMLElement);
    this.registerMarkerEvent(element as HTMLElement);
    this.mapsService.on('camerachange', this.update); // 注册高德1.x 的地图事件监听
    this.update();
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public setDraggable(draggable: boolean) {
    throw new Error('Method not implemented.');
  }

  public isDraggable() {
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
      // 不在当前可视区域内隐藏点
      if (
        pos.x > containerWidth ||
        pos.x < 0 ||
        pos.y > containerHeight ||
        pos.y < 0
      ) {
        element.style.display = 'none';
      }
      element.style.left = pos.x + offsets[0] + 'px';
      element.style.top = pos.y - offsets[1] + 'px';
    }
  }

  private init() {
    let { element } = this.markerOption;
    const { color, anchor } = this.markerOption;
    if (!element) {
      this.defaultMarker = true;
      element = DOM.create('div') as HTMLDivElement;
      this.markerOption.element = element;
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttributeNS(null, 'display', 'block');
      svg.setAttributeNS(null, 'height', '48px');
      svg.setAttributeNS(null, 'width', '48px');
      svg.setAttributeNS(null, 'viewBox', '0 0 1024 1024');

      const path = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path',
      );
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
        const value =
          this.markerOption?.style && (this.markerOption?.style[key] as string);
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
    if (!this.mapsService || this.mapsService.version !== 'GAODE2.x') {
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
