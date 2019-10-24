import { ILngLat, IMapService, IMarkerScene, IPopup } from '@l7/core';
import { bindAll, DOM } from '@l7/utils';
import { anchorTranslate, anchorType, applyAnchorClass } from './utils/anchor';
//  marker 支持 dragger 未完成

export interface IMarkerOption {
  element: HTMLElement | undefined;
  anchor: anchorType;
  color: string;
  offset: number[];
  draggable: boolean;
}
export default class Marker {
  private markerOption: IMarkerOption;
  private defaultMarker: boolean;
  private popup: IPopup; // TODO: POPup
  private mapservice: IMapService;
  private lngLat: ILngLat;
  private scene: IMarkerScene;
  constructor(option?: Partial<IMarkerOption>) {
    this.markerOption = {
      ...this.getDefault(),
      ...option,
    };
    bindAll(['update', 'onMove', 'onUp', 'addDragHandler', 'onMapClick'], this);
    this.init();
  }

  public getDefault() {
    return {
      element: undefined, // DOM element
      anchor: anchorType.BOTTOM,
      offset: [0, 0],
      color: '#5B8FF9',
      draggable: false,
    };
  }

  public addTo(scene: IMarkerScene) {
    this.scene = scene;
    const mapService = scene.getMapService();
    const { element, draggable } = this.markerOption;
    this.remove();
    this.mapservice = mapService;
    mapService.getMarkerContainer().appendChild(element as HTMLElement);
    mapService.on('camerachange', this.update);
    this.setDraggable(draggable);
    this.update();
    return this;
  }

  public remove() {
    if (this.mapservice) {
      this.mapservice.off('click', this.onMapClick);
      this.mapservice.off('move', this.update);
      this.mapservice.off('moveend', this.update);
      this.mapservice.off('mousedown', this.addDragHandler);
      this.mapservice.off('touchstart', this.addDragHandler);
      this.mapservice.off('mouseup', this.onUp);
      this.mapservice.off('touchend', this.onUp);
      delete this.mapservice;
    }
    const { element } = this.markerOption;
    if (element) {
      DOM.remove(element);
    }
    if (this.popup) {
      this.popup.remove();
    }
    return this;
  }

  public setLnglat(lngLat: ILngLat) {
    this.lngLat = lngLat;
    if (this.popup) {
      this.popup.setLnglat(this.lngLat);
    }
    return this;
  }

  public getLnglat(): ILngLat {
    return this.lngLat;
  }

  public getElement(): HTMLElement {
    return this.markerOption.element as HTMLElement;
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
    return this.markerOption.offset;
  }

  public setDraggable(draggable: boolean) {
    throw new Error('Method not implemented.');
  }

  public isDraggable() {
    return this.markerOption.draggable;
  }

  private update() {
    if (!this.mapservice) {
      return;
    }
    const { element, anchor } = this.markerOption;
    this.updatePosition();
    DOM.setTransform(element as HTMLElement, `${anchorTranslate[anchor]}`);
  }

  private onMapClick(e: MouseEvent) {
    const { element } = this.markerOption;
    if (this.popup && element) {
      this.togglePopup();
    }
  }

  private updatePosition() {
    if (!this.mapservice) {
      return;
    }
    const { element } = this.markerOption;
    const { lng, lat } = this.lngLat;
    const pos = this.mapservice.lngLatToContainer([lng, lat]);
    if (element) {
      element.style.left = pos.x + 'px';
      element.style.top = pos.y + 'px';
    }
  }

  private init() {
    let { element } = this.markerOption;
    const { color, anchor } = this.markerOption;
    if (!element) {
      this.defaultMarker = true;
      element = DOM.create('div');
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
    element.addEventListener('click', (e: MouseEvent) => {
      this.onMapClick(e);
    });
    applyAnchorClass(element, anchor, 'marker');
  }

  private addDragHandler(e: MouseEvent) {
    throw new Error('Method not implemented.');
  }

  private onUp(e: MouseEvent) {
    throw new Error('Method not implemented.');
  }
}
