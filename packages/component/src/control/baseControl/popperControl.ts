import { PositionName } from '@antv/l7-core';
import { Popper, PopperPlacement, PopperTrigger } from '../../utils/popper';
import ButtonControl, { IButtonControlOption } from './buttonControl';

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

export default abstract class PopperControl<
  O extends IPopperControlOption = IPopperControlOption
> extends ButtonControl<O> {
  /**
   * 气泡实例
   * @protected
   */
  protected popper!: Popper;

  /**
   * 获取默认配置
   * @param option
   */
  public getDefault(option?: Partial<O>): O {
    const defaultOption = super.getDefault(option);
    const position = option?.position ?? defaultOption.position!;
    return {
      ...super.getDefault(option),
      popperPlacement: PopperPlacementMap[position],
      popperTrigger: 'click',
    };
  }

  public onAdd(): HTMLElement {
    const {
      popperClassName,
      popperPlacement,
      popperTrigger,
    } = this.controlOption;
    const popperContainer = this.mapsService.getMapContainer()!;
    const button = super.onAdd();
    this.popper = new Popper(button, {
      className: popperClassName,
      placement: popperPlacement,
      trigger: popperTrigger,
      container: popperContainer,
      closeOther: true,
    });
    this.popper
      .on('show', () => {
        this.emit('popperShow');
      })
      .on('hide', () => {
        this.emit('popperHide');
      });
    return button;
  }
}
