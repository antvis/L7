import { createL7Icon } from '@antv/l7-component';
import {
  ILngLat,
  IMapService,
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

export default class Popup extends EventEmitter implements IPopup {
  /**
   * 配置
   * @protected
   */
  protected popupOption: IPopupOption;
  protected mapsService: IMapService;
  protected sceneService: ISceneService;
  protected scene: Container;

  /**
   * 当前气泡所在经纬度
   * @protected
   */
  protected lngLat: ILngLat;

  /**
   * popup 内容容器
   * @protected
   */
  protected content: HTMLElement;

  /**
   * 关闭按钮对应的 DOM
   * @protected
   */
  protected closeButton?: HTMLElement;

  /**
   * 给 MapService 挂在 click 事件的定时器
   * @protected
   */
  protected timeoutInstance?: number;

  /**
   * Popup 的总容器 DOM，包含 content 和 tip
   * @protected
   */
  protected container: HTMLElement;

  /**
   * 气泡箭头对应的 DOM
   * @protected
   */
  protected tip: HTMLElement;

  /**
   * 当前是否展示
   * @protected
   */
  protected isShow: boolean = true;

  constructor(cfg?: Partial<IPopupOption>) {
    super();
    this.popupOption = {
      ...this.getDefault(),
      ...cfg,
    };
    bindAll(['update', 'onClickClose', 'remove'], this);
  }

  public get autoClose() {
    return this.popupOption.autoClose;
  }

  public get isDestroy() {
    return !this.mapsService;
  }

  public getIsShow() {
    return this.isShow;
  }

  public addTo(scene: Container) {
    this.mapsService = scene.get<IMapService>(TYPES.IMapService);
    this.sceneService = scene.get<ISceneService>(TYPES.ISceneService);
    this.mapsService.on('camerachange', this.update);
    this.mapsService.on('viewchange', this.update);
    this.scene = scene;
    this.update();

    // 事件挂载
    if (this.popupOption.closeOnClick) {
      this.timeoutInstance = (setTimeout(() => {
        this.bindMapClickEvent();
        this.timeoutInstance = undefined;
      }, 30) as unknown) as number;
    }

    if (this.popupOption.closeOnEsc) {
      this.bindEscEvent();
    }

    this.emit('open');
    return this;
  }

  // 移除popup
  public remove() {
    if (this.isDestroy) {
      return;
    }

    if (this.content) {
      DOM.remove(this.content);
    }

    if (this.container) {
      DOM.remove(this.container);
      // @ts-ignore
      delete this.container;
    }
    if (this.mapsService) {
      // TODO: mapbox AMap 事件同步
      this.mapsService.off('camerachange', this.update);
      this.mapsService.off('viewchange', this.update);
      this.mapsService.off('click', this.onClickClose);
      window.removeEventListener('keypress', this.onKeyDown);
      // @ts-ignore
      delete this.mapsService;
    }
    if (this.timeoutInstance) {
      clearTimeout(this.timeoutInstance);
    }
    this.emit('close');
    return this;
  }

  public open(): void {
    this.addTo(this.scene);
  }

  public close(): void {
    this.remove();
  }

  public show(): void {
    DOM.removeClass(this.container, 'l7-popup-hide');
    this.isShow = true;
    this.emit('show');
  }

  public hide(): void {
    DOM.addClass(this.container, 'l7-popup-hide');
    this.isShow = false;
    this.emit('hide');
  }

  /**
   * 设置 HTML 内容
   * @param html
   */
  public setHTML(html: string | HTMLElement | HTMLElement[]) {
    const frag = window.document.createDocumentFragment();
    const temp = window.document.createElement('body');
    let child: ChildNode | null;
    if (typeof html === 'string') {
      temp.innerHTML = html;
    } else if (Array.isArray(html)) {
      temp.append(...html);
    } else if (html instanceof HTMLElement) {
      temp.append(html);
    }
    while (true) {
      child = temp.firstChild;
      if (!child) {
        break;
      }
      frag.appendChild(child);
    }

    return this.setDOMContent(frag);
  }

  /**
   * 设置 Popup 所在经纬度
   * @param lngLat
   */
  public setLnglat(lngLat: ILngLat | number[]): this {
    this.lngLat = lngLat as ILngLat;
    if (Array.isArray(lngLat)) {
      this.lngLat = {
        lng: lngLat[0],
        lat: lngLat[1],
      };
    }
    const { lng, lat } = this.lngLat;
    if (this.mapsService) {
      this.mapsService.off('camerachange', this.update);
      this.mapsService.off('viewchange', this.update);
      this.mapsService.on('camerachange', this.update);
      this.mapsService.on('viewchange', this.update);
    }
    this.update();
    setTimeout(() => {
      if (this.popupOption.autoPan) {
        this.mapsService.panTo([lng, lat]);
      }
    }, 0);
    return this;
  }

  /**
   * 获取 Popup 所在经纬度
   */
  public getLnglat(): ILngLat {
    return this.lngLat;
  }

  /**
   * 设置 Popup 展示文本
   * @param text
   */
  public setText(text: string) {
    return this.setDOMContent(window.document.createTextNode(text));
  }

  /**
   * 设置 Popup 最大宽度
   * @param maxWidth
   */
  public setMaxWidth(maxWidth: string): this {
    this.popupOption.maxWidth = maxWidth;
    this.update();
    return this;
  }

  public isOpen() {
    return !!this.mapsService;
  }

  /**
   * 设置 Popup 内容 HTML
   * @param htmlNode
   */
  protected setDOMContent(htmlNode: ChildNode | DocumentFragment) {
    this.createContent();
    this.content.appendChild(htmlNode);
    this.update();
    return this;
  }

  /**
   * 绑定地图点击事件触发销毁 Popup
   * @protected
   */
  protected bindMapClickEvent() {
    this.mapsService.off('click', this.onClickClose);
    if (!this.popupOption.closeOnClick) {
      this.mapsService.on('click', this.onClickClose);
    }
  }

  protected bindEscEvent() {
    if (this.popupOption.closeOnEsc) {
      window.addEventListener('keydown', this.onKeyDown);
    }
  }

  protected onKeyDown = (e: KeyboardEvent) => {
    if (e.keyCode === 27) {
      this.remove();
    }
  };

  /**
   * 创建 Popup 内容容器的 DOM （在每次 setHTML 或 setText 时都会被调用）
   * @protected
   */
  protected createContent() {
    if (this.content) {
      DOM.remove(this.content);
    }
    this.content = DOM.create('div', 'l7-popup-content', this.container);
    if (this.popupOption.closeButton) {
      const closeButton = createL7Icon('l7-icon-guanbi l7-popup-close-button');
      this.content.appendChild(closeButton);

      if (this.popupOption.closeButtonOffsets) {
        // 关闭按钮的偏移
        closeButton.style.right = this.popupOption.closeButtonOffsets[0] + 'px';
        closeButton.style.top = this.popupOption.closeButtonOffsets[1] + 'px';
      }

      // this.closeButton.type = 'button';
      closeButton.setAttribute('aria-label', 'Close popup');
      closeButton.addEventListener('click', this.onClickClose);

      this.closeButton = closeButton;
    }
  }

  protected getDefault() {
    return {
      closeButton: true,
      closeOnClick: true,
      maxWidth: '240px',
      offsets: [0, 0],
      anchor: anchorType.BOTTOM,
      stopPropagation: true,
      autoPan: false,
      autoClose: true,
      closeOnEsc: false,
    };
  }

  protected onClickClose(e: Event) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    this.remove();
  }

  protected update() {
    const hasPosition = !!this.lngLat;
    const { className, style, maxWidth, anchor } = this.popupOption;
    if (!this.mapsService || !hasPosition || !this.content) {
      return;
    }
    const popupContainer = this.mapsService.getMarkerContainer();
    // 如果当前没有创建 Popup 容器则创建
    if (!this.container && popupContainer) {
      this.container = DOM.create(
        'div',
        `l7-popup ${className ?? ''}`,
        popupContainer as HTMLElement,
      );

      if (style) {
        this.container.setAttribute('style', style);
      }

      this.tip = DOM.create('div', 'l7-popup-tip', this.container);
      this.container.appendChild(this.content);

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

    // 设置 Popup 的最大宽度
    if (maxWidth && this.container.style.maxWidth !== maxWidth) {
      this.container.style.maxWidth = maxWidth;
    }

    this.updateLngLatPosition();
    DOM.setTransform(this.container, `${anchorTranslate[anchor]}`);
    applyAnchorClass(this.container, anchor, 'popup');
  }

  /**
   * 将经纬度转换成对应的像素偏移位置
   * @protected
   */
  protected updateLngLatPosition() {
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
