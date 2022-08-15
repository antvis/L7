import { createL7Icon } from '../utils/icon';
import ButtonControl, {
  IButtonControlOption,
} from './baseControl/buttonControl';

export default class Fullscreen extends ButtonControl {
  protected isFullscreen = false;

  // get mapContainer() {
  //   return 1;
  // }

  // public onAdd(): HTMLElement {
  //   const button = super.onAdd();
  //   return button;
  // }

  public getDefault(
    option?: Partial<IButtonControlOption>,
  ): IButtonControlOption {
    return {
      ...super.getDefault(option),
      btnIcon: createL7Icon('l7-icon-quanping'),
      // btnText: '全屏',
      title: '全屏',
    };
  }
}
