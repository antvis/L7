import { ILngLat, IMapService, IMarkerScene, IPopup } from '@antv/l7-core';
import { bindAll, DOM } from '@antv/l7-utils';
import { EventEmitter } from 'eventemitter3';
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
  private mapservice: IMapService<unknown>;
  private lngLat: ILngLat;
  private content: HTMLElement;
  private closeButton: HTMLElement;
  private timeoutInstance: any;
  private container: HTMLElement;
  private tip: HTMLElement;

  constructor(cfg?: Partial<IPopupOption>) {
    super();
    this.popupOption = {
      ...this.getdefault(),
      ...cfg,
    };
    bindAll(['update', 'onClickClose', 'remove'], this);
  }

  public addTo(scene: IMarkerScene) {
    const mapService = scene.getMapService();
    this.mapservice = mapService;
    this.mapservice.on('camerachange', this.update);
    this.update();
    if (this.popupOption.closeOnClick) {
      this.timeoutInstance = setTimeout(() => {
        this.mapservice.on('click', this.onClickClose);
      }, 30);
    }
    return this;
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
    this.lngLat = lngLat;
    if (this.mapservice) {
      this.mapservice.on('camerachange', this.update);
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
    if (this.mapservice) {
      // TODO: mapbox AMap 事件同步
      this.mapservice.off('camerachange', this.update);
      this.mapservice.off('click', this.onClickClose);
      delete this.mapservice;
    }
    clearTimeout(this.timeoutInstance);
    this.emit('close');
    return this;
  }
  public isOpen() {
    return !!this.mapservice;
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

  private onClickClose() {
    this.remove();
  }

  private update() {
    const hasPosition = this.lngLat;
    const { className, maxWidth, anchor } = this.popupOption;
    if (!this.mapservice || !hasPosition || !this.content) {
      return;
    }
    const markerContainer = this.mapservice.getMarkerContainer();
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
    }
    if (maxWidth && this.container.style.maxWidth !== maxWidth) {
      this.container.style.maxWidth = maxWidth;
    }

    this.updatePosition();
    DOM.setTransform(this.container, `${anchorTranslate[anchor]}`);
    applyAnchorClass(this.container, anchor, 'popup');
  }

  private updatePosition() {
    if (!this.mapservice) {
      return;
    }
    const { lng, lat } = this.lngLat;
    const { offsets } = this.popupOption;
    const pos = this.mapservice.lngLatToContainer([lng, lat]);
    this.container.style.left = pos.x + offsets[0] + 'px';
    this.container.style.top = pos.y - offsets[1] + 'px';
  }
}
