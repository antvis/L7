import { DOM } from '@antv/l7-utils';
import type { IControlOption } from './control';
import Control from './control';

export { ButtonControl };

export interface IButtonControlOption extends IControlOption {
  btnIcon?: DOM.ELType | DocumentFragment;
  btnText?: string;
  title?: string;
  vertical?: boolean;
}

export default class ButtonControl<
  O extends IButtonControlOption = IButtonControlOption,
> extends Control<O> {
  /**
   * 当前按钮是否禁用
   * @protected
   */
  protected isDisable = false;

  /**
   * 按钮的 DOM
   * @protected
   */
  protected button?: HTMLElement;

  /**
   * 按钮中文本对应的 DOM
   * @protected
   */
  protected buttonText?: HTMLElement;

  /**
   * 按钮中图标对应的 DOM
   * @protected
   */
  protected buttonIcon?: DOM.ELType | DocumentFragment;

  /**
   * 设置当前按钮
   * @param newIsDisable
   */
  public setIsDisable(newIsDisable: boolean) {
    this.isDisable = newIsDisable;
    if (newIsDisable) {
      this.button?.setAttribute('disabled', 'true');
    } else {
      this.button?.removeAttribute('disabled');
    }
  }

  public createButton(className: string = '') {
    return DOM.create('button', `l7-button-control ${className}`) as HTMLElement;
  }

  public onAdd(): HTMLElement {
    this.button = this.createButton();
    this.isDisable = false;
    const { title, btnText, btnIcon } = this.controlOption;
    this.setBtnTitle(title);
    this.setBtnText(btnText);
    this.setBtnIcon(btnIcon);
    return this.button;
  }

  public onRemove(): void {
    this.button = this.buttonIcon = this.buttonText = undefined;
    this.isDisable = false;
  }

  /**
   * 更新配置方法
   * @param newOptions
   */
  public setOptions(newOptions: Partial<O>) {
    const { title, btnText, btnIcon } = newOptions;
    if (this.checkUpdateOption(newOptions, ['title'])) {
      this.setBtnTitle(title);
    }
    if (this.checkUpdateOption(newOptions, ['btnIcon'])) {
      this.setBtnIcon(btnIcon);
    }
    if (this.checkUpdateOption(newOptions, ['btnText'])) {
      this.setBtnText(btnText);
    }
    super.setOptions(newOptions);
  }

  /**
   * 设置按钮 title
   * @param title
   */
  public setBtnTitle(title: O['title']) {
    this.button?.setAttribute('title', title ?? '');
  }

  /**
   * 设置按钮 Icon
   * @param newIcon
   */
  public setBtnIcon(newIcon: O['btnIcon']) {
    if (this.buttonIcon) {
      DOM.remove(this.buttonIcon);
    }
    if (newIcon) {
      const firstChild = this.button?.firstChild;
      if (firstChild) {
        this.button?.insertBefore(newIcon, firstChild);
      } else {
        this.button?.appendChild(newIcon);
      }
      this.buttonIcon = newIcon;
    }
  }

  /**
   * 设置按钮文本
   * @param newText
   */
  public setBtnText(newText: O['btnText']) {
    if (!this.button) {
      return;
    }
    DOM.removeClass(this.button, 'l7-button-control--row');
    DOM.removeClass(this.button, 'l7-button-control--column');
    if (newText) {
      let btnText = this.buttonText;
      if (!btnText) {
        btnText = DOM.create('div', 'l7-button-control__text') as HTMLElement;
        this.button?.appendChild(btnText);
        this.buttonText = btnText;
      }
      btnText.innerText = newText;
      DOM.addClass(
        this.button,
        this.controlOption.vertical ? 'l7-button-control--column' : 'l7-button-control--row',
      );
    } else if (!newText && this.buttonText) {
      DOM.remove(this.buttonText);
      this.buttonText = undefined;
    }
  }
}
