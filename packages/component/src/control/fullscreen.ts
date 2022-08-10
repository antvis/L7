import { IButtonControlOption } from '../interface';
import { createL7Icon } from '../utils/icon';
import ButtonControl from './baseControl/buttonControl';

export default class Fullscreen extends ButtonControl {
  protected isFullscreen = false;

  get mapContainer() {
    return 1;
  }

  public onClick(e: MouseEvent): void {
    // if (this.isFullscreen) {
    //
    // } else {
    //
    // }
  }

  public getDefault(): IButtonControlOption {
    return {
      ...super.getDefault(),
      icon: createL7Icon('l7-icon-quanping'),
      title: '全屏',
    };
  }
}
