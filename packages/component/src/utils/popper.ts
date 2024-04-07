import { DOM } from '@antv/l7-utils';
import { EventEmitter } from 'eventemitter3';

/**
 * 气泡位置枚举
 */
export type PopperPlacement =
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'left-start'
  | 'left'
  | 'left-end'
  | 'bottom-start'
  | 'bottom'
  | 'bottom-end'
  | 'right-start'
  | 'right'
  | 'right-end';

/**
 * 气泡触发类型，当前支持 click 和 hover 两种类型
 */
export type PopperTrigger = 'click' | 'hover';

/**
 * 气泡内容类型
 */
export type PopperContent = string | HTMLElement | null;

export interface IPopperOption {
  placement: PopperPlacement; // 气泡展示方向
  trigger: PopperTrigger; // 气泡触发方式
  content?: PopperContent; // 初始内容
  offset?: [number, number]; // 气泡偏移
  className?: string; // 容器自定义 className
  container: HTMLElement; // 触发气泡的容器
  unique?: boolean; // 当前气泡展示时，是否关闭其他该配置为 true 的气泡
}

export class Popper extends EventEmitter<'show' | 'hide'> {
  protected get buttonRect() {
    return this.button.getBoundingClientRect();
  }

  protected static conflictPopperList: Popper[] = [];

  // 气泡容器 DOM
  public popperDOM!: HTMLElement;

  // 气泡中展示的内容容器 DOM
  public contentDOM!: HTMLElement;
  /**
   * 按钮实体
   * @protected
   */
  protected button: HTMLElement;
  /**
   * Popper 配置
   * @protected
   */
  protected option: IPopperOption;
  /**
   * 当前是否展示
   * @protected
   */
  protected isShow: boolean = false;

  /**
   * 当前气泡展示的内容
   * @protected
   */
  protected content: PopperContent;

  /**
   * 关闭气泡的定时器
   * @protected
   */
  protected timeout: number | null = null;

  constructor(button: HTMLElement, option: IPopperOption) {
    super();
    this.button = button;
    this.option = option;
    this.init();
    if (option.unique) {
      Popper.conflictPopperList.push(this);
    }
  }

  public getPopperDOM() {
    return this.popperDOM;
  }

  public getIsShow() {
    return this.isShow;
  }

  public getContent() {
    return this.content;
  }

  public setContent(content: PopperContent) {
    if (typeof content === 'string') {
      this.contentDOM.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      DOM.clearChildren(this.contentDOM);
      this.contentDOM.appendChild(content);
    }
    this.content = content;
  }

  public show = () => {
    if (this.isShow || !this.contentDOM.innerHTML) {
      return this;
    }
    this.resetPopperPosition();
    DOM.removeClass(this.popperDOM, 'l7-popper-hide');
    this.isShow = true;

    if (this.option.unique) {
      Popper.conflictPopperList.forEach((popper) => {
        if (popper !== this && popper.isShow) {
          popper.hide();
        }
      });
    }
    this.emit('show');
    window.addEventListener('pointerdown', this.onPopperUnClick);
    return this;
  };

  public hide = () => {
    if (!this.isShow) {
      return this;
    }
    DOM.addClass(this.popperDOM, 'l7-popper-hide');
    this.isShow = false;
    this.emit('hide');
    window.removeEventListener('pointerdown', this.onPopperUnClick);
    return this;
  };

  /**
   * 设置隐藏气泡的定时器
   */
  public setHideTimeout = () => {
    if (this.timeout) {
      return;
    }
    this.timeout = window.setTimeout(() => {
      if (!this.isShow) {
        return;
      }
      this.hide();
      this.timeout = null;
    }, 300);
  };

  /**
   * 销毁隐藏气泡的定时器
   */
  public clearHideTimeout = () => {
    if (this.timeout) {
      window.clearTimeout(this.timeout);
      this.timeout = null;
    }
  };

  public init() {
    const { trigger } = this.option;
    this.popperDOM = this.createPopper();
    if (trigger === 'click') {
      this.button.addEventListener('click', this.onBtnClick);
    } else {
      this.button.addEventListener('mousemove', this.onBtnMouseMove);
      this.button.addEventListener('mouseleave', this.onBtnMouseLeave);
      this.popperDOM.addEventListener('mousemove', this.onBtnMouseMove);
      this.popperDOM.addEventListener('mouseleave', this.onBtnMouseLeave);
    }
  }

  public destroy() {
    this.button.removeEventListener('click', this.onBtnClick);
    this.button.removeEventListener('mousemove', this.onBtnMouseMove);
    this.button.removeEventListener('mousemove', this.onBtnMouseLeave);
    this.popperDOM.removeEventListener('mousemove', this.onBtnMouseMove);
    this.popperDOM.removeEventListener('mouseleave', this.onBtnMouseLeave);
    DOM.remove(this.popperDOM);
  }

  public resetPopperPosition() {
    const popperStyleObj: any = {};
    const { container, offset = [0, 0], placement } = this.option;
    const [offsetX, offsetY] = offset;
    const buttonRect = this.button.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const { left, right, top, bottom } = DOM.getDiffRect(buttonRect, containerRect);
    let isTransformX = false;
    let isTransformY = false;
    if (/^(left|right)/.test(placement)) {
      if (placement.includes('left')) {
        popperStyleObj.right = `${buttonRect.width + right}px`;
      } else if (placement.includes('right')) {
        popperStyleObj.left = `${buttonRect.width + left}px`;
      }
      if (placement.includes('start')) {
        popperStyleObj.top = `${top}px`;
      } else if (placement.includes('end')) {
        popperStyleObj.bottom = `${bottom}px`;
      } else {
        popperStyleObj.top = `${top + buttonRect.height / 2}px`;
        isTransformY = true;
        popperStyleObj.transform = `translate(${offsetX}px, calc(${offsetY}px - 50%))`;
      }
    } else if (/^(top|bottom)/.test(placement)) {
      if (placement.includes('top')) {
        popperStyleObj.bottom = `${buttonRect.height + bottom}px`;
      } else if (placement.includes('bottom')) {
        popperStyleObj.top = `${buttonRect.height + top}px`;
      }
      if (placement.includes('start')) {
        popperStyleObj.left = `${left}px`;
      } else if (placement.includes('end')) {
        popperStyleObj.right = `${right}px`;
      } else {
        popperStyleObj.left = `${left + buttonRect.width / 2}px`;
        isTransformX = true;
        popperStyleObj.transform = `translate(calc(${offsetX}px - 50%), ${offsetY}px)`;
      }
    }
    popperStyleObj.transform = `translate(calc(${offsetX}px - ${
      isTransformX ? '50%' : '0%'
    }), calc(${offsetY}px - ${isTransformY ? '50%' : '0%'})`;

    const posList = placement.split('-');
    if (posList.length) {
      DOM.addClass(this.popperDOM, posList.map((pos) => `l7-popper-${pos}`).join(' '));
    }
    DOM.addStyle(this.popperDOM, DOM.css2Style(popperStyleObj));
  }

  protected createPopper(): HTMLElement {
    const { container, className = '', content } = this.option;
    const popper = DOM.create('div', `l7-popper l7-popper-hide ${className}`) as HTMLElement;
    const popperContent = DOM.create('div', 'l7-popper-content') as HTMLElement;
    const popperArrow = DOM.create('div', 'l7-popper-arrow') as HTMLElement;
    popper.appendChild(popperContent);
    popper.appendChild(popperArrow);
    container.appendChild(popper);
    this.popperDOM = popper;
    this.contentDOM = popperContent;
    if (content) {
      this.setContent(content);
    }
    return popper;
  }

  protected onBtnClick = () => {
    if (this.isShow) {
      this.hide();
    } else {
      this.show();
    }
  };

  protected onPopperUnClick = (e: MouseEvent) => {
    if (
      !DOM.findParentElement(e.target as HTMLElement, ['.l7-button-control', '.l7-popper-content'])
    ) {
      this.hide();
    }
  };

  protected onBtnMouseLeave = () => {
    this.setHideTimeout();
  };

  protected onBtnMouseMove = () => {
    this.clearHideTimeout();
    if (this.isShow) {
      return;
    }
    this.show();
  };
}
