import type { PositionName } from '@antv/l7-core';
import type { PopperPlacement, PopperTrigger } from '../../utils/popper';
import { Popper } from '../../utils/popper';
import type { IButtonControlOption } from './buttonControl';
import ButtonControl from './buttonControl';

export { PopperControl };

export interface IPopperControlOption extends IButtonControlOption {
  popperPlacement: PopperPlacement;
  popperClassName?: string;
  popperTrigger: PopperTrigger;
}

const PopperPlacementMap: Record<PositionName, PopperPlacement> = {
  topleft: 'right-start',
  topcenter: 'bottom',
  topright: 'left-start',
  bottomleft: 'right-end',
  bottomcenter: 'top',
  bottomright: 'left-end',
  lefttop: 'bottom-start',
  leftcenter: 'right',
  leftbottom: 'top-start',
  righttop: 'bottom-end',
  rightcenter: 'left',
  rightbottom: 'top-end',
};

export default class PopperControl<
  O extends IPopperControlOption = IPopperControlOption,
> extends ButtonControl<O> {
  /**
   * 气泡实例
   * @protected
   */
  protected popper!: Popper;

  public getPopper() {
    return this.popper;
  }

  public hide() {
    this.popper.hide();
    super.hide();
  }

  /**
   * 获取默认配置
   * @param option
   */
  public getDefault(option?: Partial<O>): O {
    const defaultOption = super.getDefault(option);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const position = option?.position ?? defaultOption.position!;
    return {
      ...super.getDefault(option),
      popperPlacement: position instanceof Element ? 'bottom' : PopperPlacementMap[position],
      popperTrigger: 'click',
    };
  }

  public onAdd(): HTMLElement {
    const button = super.onAdd();
    this.initPopper();
    return button;
  }

  public onRemove() {
    this.popper.destroy();
  }

  public initPopper() {
    const { popperClassName, popperPlacement, popperTrigger } = this.controlOption;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const popperContainer = this.mapsService.getMapContainer()!;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.popper = new Popper(this.button!, {
      className: popperClassName,
      placement: popperPlacement,
      trigger: popperTrigger,
      container: popperContainer,
      unique: true,
    });
    this.popper
      .on('show', () => {
        this.emit('popperShow', this);
      })
      .on('hide', () => {
        this.emit('popperHide', this);
      });
    return this.popper;
  }

  public setOptions(option: Partial<O>) {
    super.setOptions(option);

    if (this.checkUpdateOption(option, ['popperPlacement', 'popperTrigger', 'popperClassName'])) {
      const content = this.popper.getContent();
      this.popper.destroy();
      this.initPopper();
      this.popper.setContent(content);
    }
  }
}
