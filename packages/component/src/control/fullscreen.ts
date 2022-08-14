import { IButtonControlOption } from '../interface';
import { createL7Icon } from '../utils/icon';
import ButtonControl from './baseControl/buttonControl';

export default class Fullscreen extends ButtonControl {
  protected isFullscreen = false;

  // get mapContainer() {
  //   return 1;
  // }

  // public onAdd(): HTMLElement {
  //   const button = super.onAdd();
  //   return button;
  // }

  public getDefault(): IButtonControlOption {
    return {
      ...super.getDefault(),
      btnIcon: createL7Icon('l7-icon-quanping'),
      // btnText: '全屏',
      title: '全屏',
    };
  }
}
