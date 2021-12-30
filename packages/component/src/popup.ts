import {
  ILngLat,
  IMapService,
  IPoint,
  IPopup,
  IPopupOption,
  ISceneService,
  TYPES,
} from '@antv/l7-core';
import {
  anchorTranslate,
  anchorType,
  applyAnchorClass,
  bindAll,
  DOM,
} from '@antv/l7-utils';
import { EventEmitter } from 'eventemitter3';
import { Container } from 'inversify';

/** colse event */

export default class Popup extends EventEmitter implements IPopup {
  private popupOption: IPopupOption;
  private mapsService: IMapService<unknown>;
  private sceneSerive: ISceneService;
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
    this.sceneSerive = scene.get<ISceneService>(TYPES.ISceneService);
    this.mapsService.on('camerachange', this.update);
    this.mapsService.on('viewchange', this.update);
    this.scene = scene;
    this.update();
    if (this.popupOption.closeOnClick) {
      this.timeoutInstance = setTimeout(() => {
        this.mapsService.on('click', this.onClickClose);
      }, 30);
    }
    this.emit('open');
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

  public setLnglat(lngLat: ILngLat | number[]): this {
    this.lngLat = lngLat as ILngLat;
    if (Array.isArray(lngLat)) {
      this.lngLat = {
        lng: lngLat[0],
        lat: lngLat[1],
      };
    }
    if (this.mapsService) {
      this.mapsService.on('camerachange', this.update);
      this.mapsService.on('viewchange', this.update);
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
      // @ts-ignore
      delete this.container;
    }
    if (this.mapsService) {
      // TODO: mapbox AMap 事件同步
      this.mapsService.off('camerachange', this.update);
      this.mapsService.off('viewchange', this.update);
      this.mapsService.off('click', this.onClickClose);
      // @ts-ignore
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

      if (this.popupOption.closeButtonOffsets) {
        // 关闭按钮的偏移
        this.closeButton.style.right =
          this.popupOption.closeButtonOffsets[0] + 'px';
        this.closeButton.style.top =
          this.popupOption.closeButtonOffsets[1] + 'px';
      }

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
      stopPropagation: true,
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
    const popupContainer = this.mapsService.getMarkerContainer();
    if (!this.container && popupContainer) {
      this.container = this.creatDom(
        'div',
        'l7-popup',
        popupContainer as HTMLElement,
      );

      this.tip = this.creatDom('div', 'l7-popup-tip', this.container);
      this.container.appendChild(this.content);
      if (className) {
        className
          .split(' ')
          .forEach((name) => this.container.classList.add(name));
      }

      // 高德地图需要阻止事件冒泡 // 测试mapbox 地图不需要添加
      const { stopPropagation } = this.popupOption;
      if (stopPropagation) {
        ['mousemove', 'mousedown', 'mouseup', 'click', 'dblclick'].forEach(
          (type) => {
            this.container.addEventListener(type, (e) => {
              e.stopPropagation();
            });
          },
        );
      }

      this.container.style.whiteSpace = 'nowrap';
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
