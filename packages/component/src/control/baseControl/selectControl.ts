import { DOM } from '@antv/l7-utils';
import { IPopperControlOption, PopperControl } from './popperControl';

type BaseOptionItem = {
  value: string;
  text: string;
  [key: string]: string;
};

type NormalOptionItem = BaseOptionItem & {
  icon?: HTMLElement;
};

type ImageOptionItem = BaseOptionItem & {
  img: string;
};

export type ControlOptionItem = ImageOptionItem | NormalOptionItem;

export interface ISelectControlOption extends IPopperControlOption {
  options: ControlOptionItem[];
  defaultValue?: string | string[];
}

export { SelectControl };

enum SelectControlConstant {
  ActiveOptionClassName = 'l7-select-control-item-active',
  OptionValueAttrKey = 'data-option-value',
  OptionIndexAttrKey = 'data-option-index',
}

export default class SelectControl<
  O extends ISelectControlOption = ISelectControlOption,
> extends PopperControl<O> {
  /**
   * 当前选中的值
   * @protected
   */
  protected selectValue: string[] = [];

  /**
   * 选项对应的 DOM 列表
   * @protected
   */
  protected optionDOMList: HTMLElement[];

  public setOptions(option: Partial<O>) {
    super.setOptions(option);
    const { options } = option;
    if (options) {
      this.popper.setContent(this.getPopperContent(options));
    }
  }

  public onAdd() {
    const button = super.onAdd();
    const { defaultValue } = this.controlOption;
    if (defaultValue) {
      this.selectValue = this.transSelectValue(defaultValue);
    }
    this.popper.setContent(this.getPopperContent(this.controlOption.options));
    return button;
  }

  public getSelectValue() {
    return this.getIsMultiple() ? this.selectValue : this.selectValue[0];
  }

  public setSelectValue(value: string | string[], emitEvent = true) {
    const finalValue = this.transSelectValue(value);
    this.optionDOMList.forEach((optionDOM) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const optionValue = optionDOM.getAttribute(
        SelectControlConstant.OptionValueAttrKey,
      )!;
      const checkboxDOM = this.getIsMultiple()
        ? optionDOM.querySelector('input[type=checkbox]')
        : undefined;
      if (finalValue.includes(optionValue)) {
        DOM.addClass(optionDOM, SelectControlConstant.ActiveOptionClassName);
        if (checkboxDOM) {
          // @ts-ignore
          DOM.setChecked(checkboxDOM, true);
        }
      } else {
        DOM.removeClass(optionDOM, SelectControlConstant.ActiveOptionClassName);
        if (checkboxDOM) {
          // @ts-ignore
          DOM.setChecked(checkboxDOM, false);
        }
      }
    });
    this.selectValue = finalValue;
    if (emitEvent) {
      this.emit(
        'selectChange',
        this.getIsMultiple() ? finalValue : finalValue[0],
      );
    }
  }

  /**
   * 是否为多选
   * @protected
   */
  protected getIsMultiple() {
    return false;
  }

  protected getPopperContent(options: ControlOptionItem[]): HTMLElement {
    const isImageOptions = this.isImageOptions();
    const content = DOM.create(
      'div',
      isImageOptions ? 'l7-select-control--image' : 'l7-select-control--normal',
    ) as HTMLElement;
    if (this.getIsMultiple()) {
      DOM.addClass(content, 'l7-select-control--multiple');
    }
    const optionsDOMList = options.map((option, optionIndex) => {
      const optionDOM = isImageOptions
        ? // @ts-ignore
          this.createImageOption(option)
        : this.createNormalOption(option);

      optionDOM.setAttribute(
        SelectControlConstant.OptionValueAttrKey,
        option.value,
      );
      optionDOM.setAttribute(
        SelectControlConstant.OptionIndexAttrKey,
        window.String(optionIndex),
      );
      optionDOM.addEventListener('click', this.onItemClick.bind(this, option));
      return optionDOM;
    });
    content.append(...optionsDOMList);
    this.optionDOMList = optionsDOMList;
    return content;
  }

  protected createNormalOption = (option: NormalOptionItem) => {
    const isSelect = this.selectValue.includes(option.value);
    const optionDOM = DOM.create(
      'div',
      `l7-select-control-item ${
        isSelect ? SelectControlConstant.ActiveOptionClassName : ''
      }`,
    ) as HTMLElement;
    if (this.getIsMultiple()) {
      optionDOM.appendChild(this.createCheckbox(isSelect));
    }
    if (option.icon) {
      optionDOM.appendChild(option.icon);
    }
    const textDOM = DOM.create('span');
    textDOM.innerText = option.text;
    optionDOM.appendChild(textDOM);
    return optionDOM;
  };

  protected createImageOption(option: ImageOptionItem): HTMLElement {
    const isSelect = this.selectValue.includes(option.value);
    const optionDOM = DOM.create(
      'div',
      `l7-select-control-item ${
        isSelect ? SelectControlConstant.ActiveOptionClassName : ''
      }`,
    ) as HTMLElement;
    const imgDOM = DOM.create('img') as HTMLElement;
    imgDOM.setAttribute('src', option.img);
    DOM.setUnDraggable(imgDOM);
    optionDOM.appendChild(imgDOM);
    const rowDOM = DOM.create(
      'div',
      'l7-select-control-item-row',
    ) as HTMLElement;
    if (this.getIsMultiple()) {
      optionDOM.appendChild(this.createCheckbox(isSelect));
    }
    const textDOM = DOM.create('span');
    textDOM.innerText = option.text;
    rowDOM.appendChild(textDOM);
    optionDOM.appendChild(rowDOM);
    return optionDOM;
  }

  protected createCheckbox(isSelect: boolean) {
    const checkboxDOM = DOM.create('input') as HTMLElement;
    checkboxDOM.setAttribute('type', 'checkbox');
    if (isSelect) {
      DOM.setChecked(checkboxDOM, true);
    }
    return checkboxDOM;
  }

  protected onItemClick = (item: ControlOptionItem) => {
    if (this.getIsMultiple()) {
      const targetIndex = this.selectValue.findIndex(
        (value) => value === item.value,
      );
      if (targetIndex > -1) {
        this.selectValue.splice(targetIndex, 1);
      } else {
        this.selectValue = [...this.selectValue, item.value];
      }
    } else {
      this.selectValue = [item.value];
    }
    this.setSelectValue(this.selectValue);
  };

  protected isImageOptions() {
    // @ts-ignore
    return !!this.controlOption.options.find((item) => item.img);
  }

  protected transSelectValue(value: string | string[]) {
    return Array.isArray(value) ? value : [value];
  }
}
