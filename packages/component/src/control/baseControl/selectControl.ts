import { DOM } from '@antv/l7-utils';
import { IPopperControlOption, PopperControl } from './popperControl';

type BaseOptionItem = {
  value: string;
  text: string;
};

type NormalOptionItem = BaseOptionItem & {
  icon?: HTMLElement;
};

type ImageOptionItem = BaseOptionItem & {
  img: string;
};

type OptionItem = ImageOptionItem | NormalOptionItem;

export interface ISelectControlOption extends IPopperControlOption {
  options: OptionItem[];
  defaultValue?: string | string[];
}

export { SelectControl };

enum SelectControlConstant {
  ActiveOptionClassName = 'l7-select-control-item-active',
  OptionValueAttrKey = 'data-option-value',
  OptionIndexAttrKey = 'data-option-index',
}

export default abstract class SelectControl<
  O extends ISelectControlOption = ISelectControlOption
> extends PopperControl<O> {
  /**
   * 当前选中的值
   * @protected
   */
  protected selectValue: string[] = [];

  /**
   * 是否为多选
   * @protected
   */
  protected abstract isMultiple: boolean;

  /**
   * 选项对应的 DOM 列表
   * @protected
   */
  protected optionDOMList: HTMLElement[];

  constructor(option: Partial<O>) {
    super(option);

    const { defaultValue } = option;
    if (defaultValue) {
      this.selectValue = this.transSelectValue(defaultValue);
    }
  }

  public onAdd() {
    const button = super.onAdd();
    this.popper.setContent(this.getPopperContent());
    return button;
  }

  public getSelectValue() {
    return this.isMultiple ? this.selectValue : this.selectValue[0];
  }

  public setSelectValue(value: string | string[]) {
    const finalValue = this.transSelectValue(value);
    this.optionDOMList.forEach((optionDOM) => {
      const optionValue = optionDOM.getAttribute(
        SelectControlConstant.OptionValueAttrKey,
      )!;
      const checkboxDOM = this.isMultiple
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
    this.emit('selectChange', this.isMultiple ? finalValue : finalValue[0]);
  }

  protected getPopperContent(): HTMLElement {
    const options = this.controlOption.options;
    const isImageOptions = this.isImageOptions();
    const content = DOM.create(
      'div',
      isImageOptions ? 'l7-select-control-image' : 'l7-select-control-normal',
    ) as HTMLElement;
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
    if (this.isMultiple) {
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
    optionDOM.appendChild(imgDOM);
    const rowDOM = DOM.create(
      'div',
      'l7-select-control-item-row',
    ) as HTMLElement;
    if (this.isMultiple) {
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

  protected onItemClick = (item: OptionItem) => {
    if (this.isMultiple) {
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
