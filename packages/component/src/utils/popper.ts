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
 * 气泡触发类型
 */
export type PopperTrigger = 'click' | 'hover';

/**
 * 气泡内容类型
 */
export type PopperContent = string | HTMLElement | null;

export interface IPopperOption {
  placement: PopperPlacement;
  trigger: PopperTrigger;
  content?: string | HTMLElement;
  offset?: [number, number];
  className?: string;
  container: HTMLElement;
  closeOther?: boolean;
}

export class Popper extends EventEmitter<'show' | 'hide'> {
  protected get buttonRect() {
    return this.button.getBoundingClientRect();
  }

  protected static conflictPopperList: Popper[] = [];
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

  protected popper!: HTMLElement;

  protected content!: HTMLElement;

  protected timeout: number | null = null;

  constructor(button: HTMLElement, option: IPopperOption) {
    super();
    this.button = button;
    this.option = option;
    this.init();
    if (option.closeOther) {
      Popper.conflictPopperList.push(this);
    }
  }

  public setContent(content: PopperContent) {
    if (typeof content === 'string') {
      this.content.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      this.content.innerHTML = '';
      this.content.appendChild(content);
    }
  }

  public show() {
    if (this.isShow || !this.content.innerHTML) {
      return;
    }
    this.setPopperPosition();
    DOM.removeClass(this.popper, 'l7-popper-hide');
    this.isShow = true;

    if (this.option.closeOther) {
      Popper.conflictPopperList.forEach((popper) => {
        if (popper !== this && popper.isShow) {
          popper.hide();
        }
      });
    }
    this.emit('show');
  }

  public hide() {
    if (!this.isShow) {
      return;
    }
    DOM.addClass(this.popper, 'l7-popper-hide');
    this.isShow = false;
    this.emit('hide');
  }

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

  public clearHideTimeout = () => {
    if (this.timeout) {
      window.clearTimeout(this.timeout);
      this.timeout = null;
    }
  };

  protected init() {
    const { trigger } = this.option;
    this.popper = this.createPopper();
    if (trigger === 'click') {
      this.button.addEventListener('click', this.onBtnClick);
    } else {
      this.button.addEventListener('mousemove', this.onBtnMouseMove);
      this.button.addEventListener('mouseleave', this.onBtnMouseLeave);
      this.popper.addEventListener('mousemove', this.onBtnMouseMove);
      this.popper.addEventListener('mouseleave', this.onBtnMouseLeave);
    }
  }

  protected destroy() {
    this.button.removeEventListener('click', this.onBtnClick);
    this.button.removeEventListener('mousemove', this.onBtnMouseMove);
    this.button.removeEventListener('mousemove', this.onBtnMouseLeave);
    this.popper.removeEventListener('mousemove', this.onBtnMouseMove);
    this.popper.removeEventListener('mouseleave', this.onBtnMouseLeave);
    DOM.remove(this.popper);
  }

  protected createPopper(): HTMLElement {
    const { container, className = '', content } = this.option;
    const popper = DOM.create(
      'div',
      `l7-popper l7-popper-hide ${className}`,
    ) as HTMLElement;
    const popperContent = DOM.create('div', 'l7-popper-content') as HTMLElement;
    const popperArrow = DOM.create('div', 'l7-popper-arrow') as HTMLElement;
    popper.appendChild(popperContent);
    popper.appendChild(popperArrow);
    container.appendChild(popper);
    this.popper = popper;
    this.content = popperContent;
    if (content) {
      this.setContent(content);
    }
    return popper;
  }

  protected onBtnClick = (e: MouseEvent) => {
    if (this.isShow) {
      this.hide();
    } else {
      this.show();
    }
  };

  protected onBtnMouseLeave = () => {
    this.setHideTimeout();
  };

  protected onBtnMouseMove = (e: MouseEvent) => {
    this.clearHideTimeout();
    if (this.isShow) {
      return;
    }
    this.show();
  };

  protected setPopperPosition() {
    const popperStyleObj: any = {};
    const { container, offset = [0, 0], placement } = this.option;
    const [offsetX, offsetY] = offset;
    const buttonRect = this.button.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const { left, right, top, bottom } = DOM.getDiffRect(
      buttonRect,
      containerRect,
    );
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
      DOM.addClass(
        this.popper,
        posList.map((pos) => `l7-popper-${pos}`).join(' '),
      );
    }
    DOM.addStyle(this.popper, DOM.css2Style(popperStyleObj));
  }
}
