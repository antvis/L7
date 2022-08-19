import { DOM } from '@antv/l7-utils';
import Control, { IControlOption } from './control';

export { ButtonControl };

export interface IButtonControlOption extends IControlOption {
  btnIcon?: HTMLElement;
  btnText?: string;
  title?: string;
}

export default abstract class ButtonControl<
  O extends IButtonControlOption = IButtonControlOption
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
  protected buttonIcon?: HTMLElement;

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
    return DOM.create(
      'button',
      `l7-button-control ${className}`,
    ) as HTMLElement;
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

  // tslint:disable-next-line:no-empty
  public onRemove(): void {
    this.button = this.buttonIcon = this.buttonText = undefined;
    this.isDisable = false;
  }

  public setOptions(newOptions: Partial<O>) {
    const { title, btnText, btnIcon } = newOptions;
    if ('title' in newOptions) {
      this.setBtnTitle(title);
    }
    if ('btnIcon' in newOptions) {
      this.setBtnIcon(btnIcon);
    }
    if ('btnText' in newOptions) {
      this.setBtnText(btnText);
    }
    super.setOptions(newOptions);
  }

  public setBtnTitle(title: O['title']) {
    this.button?.setAttribute('title', title ?? '');
  }

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

  public setBtnText(newText: O['btnText']) {
    if (newText) {
      let btnText = this.buttonText;
      if (!btnText) {
        btnText = DOM.create('div', 'l7-button-control__text') as HTMLElement;
        this.button?.appendChild(btnText);
        this.buttonText = btnText;
      }
      btnText.innerText = newText;
    } else if (!newText && this.buttonText) {
      DOM.remove(this.buttonText);
      this.buttonText = undefined;
    }
  }
}
