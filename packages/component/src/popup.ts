import { ILngLat, IMapService, IPoint, IPopup, TYPES } from '@antv/l7-core';
import { bindAll, DOM } from '@antv/l7-utils';
import { EventEmitter } from 'eventemitter3';
import { Container } from 'inversify';
import { anchorTranslate, anchorType, applyAnchorClass } from './utils/anchor';

/** colse event */

export interface IPopupOption {
  closeButton: boolean;
  closeOnClick: boolean;
  maxWidth: string;
  anchor: anchorType;
  className: string;
  offsets: number[];
}
export default class Popup extends EventEmitter implements IPopup {
  private popupOption: IPopupOption;
  private mapsService: IMapService<unknown>;
  private lngLat: ILngLat;
  private content: HTMLElement;
  private closeButton: HTMLElement;
  private timeoutInstance: any;
  private container: HTMLElement;
  private tip: HTMLElement;
  private scene: Container;

  constructor(cfg?: Partial<IPopupOption>) {
    super();
    this.popupOption = {
      ...this.getdefault(),
      ...cfg,
    };
    bindAll(['update', 'onClickClose', 'remove'], this);
  }

  public addTo(scene: Container) {
    this.mapsService = scene.get<IMapService>(TYPES.IMapService);
    this.mapsService.on('camerachange', this.update);
    this.scene = scene;
    this.update();
    if (this.popupOption.closeOnClick) {
      this.timeoutInstance = setTimeout(() => {
        this.mapsService.on('click', this.onClickClose);
      }, 30);
    }
    return this;
  }

  public close(): void {
    this.remove();
  }

  public open(): void {
    this.addTo(this.scene);
  }

  public setHTML(html: string) {
    const frag = window.document.createDocumentFragment();
    const temp = window.document.createElement('body');
    let child: ChildNode | null;
    temp.innerHTML = html;
    while (true) {
      child = temp.firstChild;
      if (!child) {
        break;
      }
      frag.appendChild(child);
    }

    return this.setDOMContent(frag);
  }

  public setLnglat(lngLat: ILngLat): this {
    this.lngLat = lngLat as ILngLat;
    if (Array.isArray(lngLat)) {
      this.lngLat = {
        lng: lngLat[0],
        lat: lngLat[1],
      };
    }
    if (this.mapsService) {
      this.mapsService.on('camerachange', this.update);
    }
    this.update();
    return this;
  }
  public getLnglat(): ILngLat {
    return this.lngLat;
  }
  public setText(text: string) {
    return this.setDOMContent(window.document.createTextNode(text));
  }

  public setMaxWidth(maxWidth: string): this {
    this.popupOption.maxWidth = maxWidth;
    this.update();
    return this;
  }

  public setDOMContent(htmlNode: ChildNode | DocumentFragment) {
    this.createContent();
    this.content.appendChild(htmlNode);
    this.update();
    return this;
  }

  // 移除popup
  public remove() {
    if (this.content) {
      this.removeDom(this.content);
    }

    if (this.container) {
      this.removeDom(this.container);
      delete this.container;
    }
    if (this.mapsService) {
      // TODO: mapbox AMap 事件同步
      this.mapsService.off('camerachange', this.update);
      this.mapsService.off('click', this.onClickClose);
      delete this.mapsService;
    }
    clearTimeout(this.timeoutInstance);
    this.emit('close');
    return this;
  }
  public isOpen() {
    return !!this.mapsService;
  }

  private createContent() {
    if (this.content) {
      DOM.remove(this.content);
    }
    this.content = DOM.create('div', 'l7-popup-content', this.container);
    if (this.popupOption.closeButton) {
      this.closeButton = DOM.create(
        'button',
        'l7-popup-close-button',
        this.content,
      );
      // this.closeButton.type = 'button';
      this.closeButton.setAttribute('aria-label', 'Close popup');
      this.closeButton.innerHTML = '&#215;';
      this.closeButton.addEventListener('click', this.onClickClose);
    }
  }

  private creatDom(tagName: string, className: string, container: HTMLElement) {
    const el = window.document.createElement(tagName);
    if (className !== undefined) {
      el.className = className;
    }
    if (container) {
      container.appendChild(el);
    }
    return el;
  }

  private removeDom(node: ChildNode) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }

  private getdefault() {
    return {
      closeButton: true,
      closeOnClick: true,
      maxWidth: '240px',
      offsets: [0, 0],
      anchor: anchorType.BOTTOM,
      className: '',
    };
  }

  private onClickClose(e: Event) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    this.remove();
  }

  private update() {
    const hasPosition = this.lngLat;
    const { className, maxWidth, anchor } = this.popupOption;
    if (!this.mapsService || !hasPosition || !this.content) {
      return;
    }
    const markerContainer = this.mapsService.getMarkerContainer();
    if (!this.container && markerContainer) {
      this.container = this.creatDom(
        'div',
        'l7-popup',
        markerContainer.parentNode as HTMLElement,
      );

      this.tip = this.creatDom('div', 'l7-popup-tip', this.container);
      this.container.appendChild(this.content);
      if (className) {
        className
          .split(' ')
          .forEach((name) => this.container.classList.add(name));
      }
      this.container.addEventListener('mousedown', (e) => {
        e.stopPropagation();
      });
      this.container.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
    if (maxWidth && this.container.style.maxWidth !== maxWidth) {
      this.container.style.maxWidth = maxWidth;
    }

    this.updatePosition();
    DOM.setTransform(this.container, `${anchorTranslate[anchor]}`);
    applyAnchorClass(this.container, anchor, 'popup');
  }

  private updatePosition() {
    if (!this.mapsService) {
      return;
    }
    const { lng, lat } = this.lngLat;
    const { offsets } = this.popupOption;
    const pos = this.mapsService.lngLatToContainer([lng, lat]);
    this.container.style.left = pos.x + offsets[0] + 'px';
    this.container.style.top = pos.y - offsets[1] + 'px';
  }
}
