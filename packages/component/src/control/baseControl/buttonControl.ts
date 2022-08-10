import { DOM } from '@antv/l7-utils';
import { IButtonControlOption } from '../../interface';
import Control from './control';

export { ButtonControl };

export default abstract class ButtonControl extends Control<
  IButtonControlOption
> {
  /**
   * 当前按钮是否禁用
   * @protected
   */
  protected isDisable = false;

  protected textContainer?: HTMLElement;

  protected iconContainer?: HTMLElement;

  // constructor(option?: Partial<IButtonControlOption>) {
  //   super(option);
  // }

  public abstract onClick(e: MouseEvent): void;

  public setIsDisable(newIsDisable: boolean) {
    this.isDisable = newIsDisable;
    if (newIsDisable) {
      this.container.setAttribute('disabled', 'true');
    } else {
      this.container.removeAttribute('disabled');
    }
  }

  public onAdd(): HTMLElement {
    const button = DOM.create('button', 'l7-button-control') as HTMLElement;
    button.addEventListener('click', this.onClick.bind(this));
    return button;
  }

  // tslint:disable-next-line:no-empty
  public onRemove(): void {}

  public setOptions(newOptions: Partial<IButtonControlOption>) {
    const { title, text, icon } = newOptions;
    if ('title' in newOptions) {
      this.container.setAttribute('title', title ?? '');
    }
    if ('icon' in newOptions) {
      this.updateButtonIcon(icon);
    }
    if ('text' in newOptions) {
      this.updateButtonText(text);
    }
    super.setOptions(newOptions);
  }

  protected updateButtonText(newText: IButtonControlOption['text']) {
    if (newText) {
      let textContainer = this.textContainer;
      if (!textContainer) {
        textContainer = DOM.create(
          'div',
          'l7-button-control__text',
        ) as HTMLElement;
        this.container.appendChild(textContainer);
        this.textContainer = textContainer;
      }
      textContainer.innerText = newText;
    } else if (!newText && this.textContainer) {
      DOM.remove(this.textContainer);
      this.textContainer = undefined;
    }
  }

  protected updateButtonIcon(newIcon: IButtonControlOption['icon']) {
    if (this.iconContainer) {
      DOM.remove(this.iconContainer);
    }
    if (newIcon) {
      const firstChild = this.container.firstChild;
      if (firstChild) {
        this.container.insertBefore(newIcon, firstChild);
      } else {
        this.container.appendChild(newIcon);
      }
      this.iconContainer = newIcon;
    }
  }
}
