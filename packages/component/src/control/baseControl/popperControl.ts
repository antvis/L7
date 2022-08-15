import { Popper, PopperPlacement } from '../../utils/popper';
import ButtonControl, { IButtonControlOption } from './buttonControl';

export { PopperControl };

export interface IPopperControlOption extends IButtonControlOption {
  popperPlacement: PopperPlacement;
}

export default abstract class PopperControl<
  O extends IPopperControlOption = IPopperControlOption
> extends ButtonControl<O> {
  /**
   * 获取默认配置
   * @param option
   */
  public getDefault(option?: Partial<O>): O {
    const defaultOption = super.getDefault(option);
    // TODO: 将 position => 对应的 popoer Placement
    const position = option?.position ?? defaultOption.position!;
    return {
      ...super.getDefault(option),
      popperPlacement: 'left',
    };
  }

  public onAdd(): HTMLElement {
    const button = super.onAdd();
    const a = new Popper(this.button!, {
      className: '',
      content: '1231365415361351531351351',
      placement: 'left',
      trigger: 'hover',
      container: this.mapsService.getContainer()!,
    });
    return button;
  }
}
