import {
  ILayerService,
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
  DOM,
} from '@antv/l7-utils';
import { EventEmitter } from 'eventemitter3';
import { Container } from 'inversify';
import { createL7Icon } from '../utils/icon';

type ElementType = DOM.ElementType;

export { Popup };

export default class Popup<O extends IPopupOption = IPopupOption>
  extends EventEmitter
  implements IPopup
{
  /**
   * 配置
   * @protected
   */
  protected popupOption: O;
  protected mapsService: IMapService;
  protected sceneService: ISceneService;
  protected layerService: ILayerService;
  protected scene: Container;

  /**
   * 关闭按钮对应的 DOM
   * @protected
   */
  protected closeButton?: HTMLElement | SVGElement;

  /**
   * Popup 的总容器 DOM，包含 content 和 tip
   * @protected
   */
  protected container: HTMLElement;

  /**
   * popup 气泡容器
   * @protected
   */
  protected content: HTMLElement;

  /**
   * popup 气泡标题
   * @protected
   */
  protected contentTitle?: HTMLElement;

  /**
   * popup 内容容器
   * @protected
   */
  protected contentPanel: HTMLElement;

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

  protected get lngLat() {
    return (
      this.popupOption.lngLat ?? {
        lng: 0,
        lat: 0,
      }
    );
  }

  protected set lngLat(newLngLat: ILngLat) {
    this.popupOption.lngLat = newLngLat;
  }

  constructor(cfg?: Partial<O>) {
    super();
    this.popupOption = {
      ...this.getDefault(cfg ?? {}),
      ...cfg,
    };
    const { lngLat } = this.popupOption;
    if (lngLat) {
      this.lngLat = lngLat;
    }
  }

  public getIsShow() {
    return this.isShow;
  }

  public addTo(scene: Container) {
    this.mapsService = scene.get<IMapService>(TYPES.IMapService);
    this.sceneService = scene.get<ISceneService>(TYPES.ISceneService);
    this.layerService = scene.get<ILayerService>(TYPES.ILayerService);
    this.mapsService.on('camerachange', this.update);
    this.mapsService.on('viewchange', this.update);
    this.scene = scene;
    this.update();
    // 临时关闭
    this.updateCloseOnClick();
    this.updateCloseOnEsc();
    this.updateFollowCursor();

    const { html, text, title } = this.popupOption;
    if (html) {
      this.setHTML(html);
    } else if (text) {
      this.setText(text);
    }
    if (title) {
      this.setTitle(title);
    }
    this.emit('open');
    return this;
  }

  // 移除popup
  public remove() {
    if (!this?.isOpen()) {
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
      this.updateCloseOnClick(true);
      this.updateCloseOnEsc(true);
      this.updateFollowCursor(true);
      // @ts-ignore
      delete this.mapsService;
    }
    this.emit('close');
    return this;
  }

  /**
   * 获取 option 配置
   */
  public getOptions() {
    return this.popupOption;
  }

  public setOptions(option: Partial<O>) {
    this.show();
    this.popupOption = {
      ...this.popupOption,
      ...option,
    };
    if (
      this.checkUpdateOption(option, [
        'html',
        'text',
        'title',
        'closeButton',
        'closeButtonOffsets',
        'maxWidth',
        'anchor',
        'stopPropagation',
        'className',
        'style',
        'lngLat',
        'offsets',
      ])
    ) {
      if (this.container) {
        DOM.remove(this.container);
        // @ts-ignore
        this.container = undefined;
      }
      if (this.popupOption.html) {
        this.setHTML(this.popupOption.html);
      } else if (this.popupOption.text) {
        this.setText(this.popupOption.text);
      }
      if (this.popupOption.title) {
        this.setTitle(this.popupOption.title);
      }
    }
    if (this.checkUpdateOption(option, ['closeOnEsc'])) {
      this.updateCloseOnEsc();
    }
    if (this.checkUpdateOption(option, ['closeOnClick'])) {
      this.updateCloseOnClick();
    }
    if (this.checkUpdateOption(option, ['followCursor'])) {
      this.updateFollowCursor();
    }
    if (this.checkUpdateOption(option, ['html']) && option.html) {
      this.setHTML(option.html);
    } else if (this.checkUpdateOption(option, ['text']) && option.text) {
      this.setText(option.text);
    }
    if (this.checkUpdateOption(option, ['lngLat']) && option.lngLat) {
      this.setLnglat(option.lngLat);
    }
    return this;
  }

  public open() {
    this.addTo(this.scene);
    return this;
  }

  public close() {
    this.remove();
    return this;
  }

  public show() {
    if (this.isShow) {
      return;
    }
    if (this.container) {
      DOM.removeClass(this.container, 'l7-popup-hide');
    }
    this.isShow = true;
    this.emit('show');
    return this;
  }

  public hide() {
    if (!this.isShow) {
      return;
    }
    if (this.container) {
      DOM.addClass(this.container, 'l7-popup-hide');
    }
    this.isShow = false;
    this.emit('hide');
    return this;
  }

  /**
   * 设置 HTML 内容
   * @param html
   */
  public setHTML(html: ElementType) {
    this.popupOption.html = html;
    return this.setDOMContent(html);
  }

  /**
   * 设置 Popup 展示文本
   * @param text
   */
  public setText(text: string) {
    this.popupOption.text = text;
    return this.setDOMContent(window.document.createTextNode(text));
  }

  public setTitle(title?: ElementType) {
    this.show();
    this.popupOption.title = title;
    if (title) {
      if (!this.contentTitle) {
        this.contentTitle = DOM.create('div', 'l7-popup-content__title');
        if (this.content.firstChild) {
          this.content.insertBefore(
            this.contentTitle!,
            this.content.firstChild,
          );
        } else {
          this.content.append(this.contentTitle!);
        }
      }
      DOM.clearChildren(this.contentTitle!);
      DOM.appendElementType(this.contentTitle!, title);
    } else if (this.contentTitle) {
      DOM.remove(this.contentTitle);
      this.contentTitle = undefined;
    }
  }

  /**
   * 将地图自动平移到气泡位置
   */
  public panToPopup() {
    const { lng, lat } = this.lngLat;
    if (this.popupOption.autoPan) {
      this.mapsService.panTo([lng, lat]);
    }
    return this;
  }

  public setLngLat(lngLat: ILngLat | [number, number]): this {
    return this.setLnglat(lngLat);
  }

  /**
   * 设置 Popup 所在经纬度
   * @param lngLat
   */
  public setLnglat(lngLat: ILngLat | [number, number]): this {
    this.show();
    this.lngLat = lngLat as ILngLat;
    if (Array.isArray(lngLat)) {
      this.lngLat = {
        lng: lngLat[0],
        lat: lngLat[1],
      };
    }
    if (this.mapsService) {
      // 防止事件重复监听
      this.mapsService.off('camerachange', this.update);
      this.mapsService.off('viewchange', this.update);

      this.mapsService.on('camerachange', this.update);
      this.mapsService.on('viewchange', this.update);
    }
    this.update();
    if (this.popupOption.autoPan) {
      setTimeout(() => {
        this.panToPopup();
      }, 0);
    }
    return this;
  }

  /**
   * 获取 Popup 所在经纬度
   */
  public getLnglat(): ILngLat {
    return this.lngLat;
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

  protected onMouseMove = (e: MouseEvent) => {
    const container = this.mapsService.getMapContainer();
    const { left = 0, top = 0 } = container?.getBoundingClientRect() ?? {};
    this.setPopupPosition(e.clientX - left, e.clientY - top);
  };

  /**
   * 将经纬度转换成对应的像素偏移位置
   * @protected
   */
  protected updateLngLatPosition = () => {
    if (!this.mapsService || this.popupOption.followCursor) {
      return;
    }
    const { lng, lat } = this.lngLat;
    const { x, y } = this.mapsService.lngLatToContainer([lng, lat]);
    this.setPopupPosition(x, y);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getDefault(option: Partial<O>): O {
    // tslint:disable-next-line:no-object-literal-type-assertion
    return {
      closeButton: true,
      closeOnClick: false,
      maxWidth: '240px',
      offsets: [0, 0],
      anchor: anchorType.BOTTOM,
      stopPropagation: true,
      autoPan: false,
      autoClose: true,
      closeOnEsc: false,
      followCursor: false,
    } as O;
  }

  /**
   * 设置 Popup 内容 HTML
   * @param element
   */
  protected setDOMContent(element: ElementType) {
    this.show();
    this.createContent();
    DOM.appendElementType(this.contentPanel, element);
    this.update();
    return this;
  }

  /**
   * 绑定地图点击事件触发销毁 Popup
   * @protected
   */
  protected updateCloseOnClick(onlyClear?: boolean) {
    const mapsService = this.mapsService;
    if (mapsService) {
      mapsService?.off('click', this.onCloseButtonClick);
      if (this.popupOption.closeOnClick && !onlyClear) {
        requestAnimationFrame(() => {
          mapsService?.on('click', this.onCloseButtonClick);
        });
      }
    }
  }

  protected updateCloseOnEsc(onlyClear?: boolean) {
    window.removeEventListener('keydown', this.onKeyDown);
    if (this.popupOption.closeOnEsc && !onlyClear) {
      window.addEventListener('keydown', this.onKeyDown);
    }
  }

  protected updateFollowCursor(onlyClear?: boolean) {
    const container = this.mapsService?.getContainer();
    if (container) {
      container?.removeEventListener('mousemove', this.onMouseMove);
      if (this.popupOption.followCursor && !onlyClear) {
        container?.addEventListener('mousemove', this.onMouseMove);
      }
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
    this.contentTitle = undefined;
    this.content = DOM.create('div', 'l7-popup-content', this.container);
    this.setTitle(this.popupOption.title);

    if (this.popupOption.closeButton) {
      const closeButton = createL7Icon('l7-icon-guanbi');
      DOM.addClass(closeButton, 'l7-popup-close-button');
      this.content.appendChild(closeButton);

      if (this.popupOption.closeButtonOffsets) {
        // 关闭按钮的偏移
        closeButton.style.right = this.popupOption.closeButtonOffsets[0] + 'px';
        closeButton.style.top = this.popupOption.closeButtonOffsets[1] + 'px';
      }

      // this.closeButton.type = 'button';
      closeButton.setAttribute('aria-label', 'Close popup');
      closeButton.addEventListener('click', () => {
        this.hide();
      });

      this.closeButton = closeButton;
    } else {
      this.closeButton = undefined;
    }

    this.contentPanel = DOM.create(
      'div',
      'l7-popup-content__panel',
      this.content,
    );
  }

  protected onCloseButtonClick = (e: Event) => {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    this.hide();
  };

  protected update = () => {
    const hasPosition = !!this.lngLat;
    const { className, style, maxWidth, anchor, stopPropagation } =
      this.popupOption;
    if (!this.mapsService || !hasPosition || !this.content) {
      return;
    }
    const popupContainer = this.mapsService.getMarkerContainer();
    // 如果当前没有创建 Popup 容器则创建
    if (!this.container && popupContainer) {
      this.container = DOM.create(
        'div',
        `l7-popup ${className ?? ''} ${!this.isShow ? 'l7-popup-hide' : ''}`,
        popupContainer as HTMLElement,
      );

      if (style) {
        this.container.setAttribute('style', style);
      }

      this.tip = DOM.create('div', 'l7-popup-tip', this.container);
      this.container.appendChild(this.content);

      // 高德地图需要阻止事件冒泡 // 测试mapbox 地图不需要添加
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

    this.updateLngLatPosition();
    DOM.setTransform(this.container, `${anchorTranslate[anchor]}`);
    applyAnchorClass(this.container, anchor, 'popup');

    if (maxWidth) {
      const { width } = this.container.getBoundingClientRect();
      if (width > parseFloat(maxWidth)) {
        this.container.style.width = maxWidth;
      }
    } else {
      this.container.style.removeProperty('width');
    }
  };

  /**
   * 设置 Popup 相对于地图容器的 Position
   * @param left
   * @param top
   * @protected
   */
  protected setPopupPosition(left: number, top: number) {
    if (this.container) {
      const { offsets } = this.popupOption;
      this.container.style.left = left + offsets[0] + 'px';
      this.container.style.top = top - offsets[1] + 'px';
    }
  }

  /**
   * 检查当前传入 option 是否包含 keys 字段
   * @param option
   * @param keys
   * @protected
   */
  protected checkUpdateOption(option: Partial<O>, keys: Array<keyof O>) {
    return keys.some((key) => key in option);
  }
}
