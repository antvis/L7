import { DOM } from '@antv/l7-utils';
import { createL7Icon } from '../utils/icon';
import ScreenFull from '../utils/screenfull';
import type { IButtonControlOption } from './baseControl/buttonControl';
import ButtonControl from './baseControl/buttonControl';

export interface IFullscreenControlOption extends IButtonControlOption {
  exitBtnText: IButtonControlOption['btnText'];
  exitBtnIcon: IButtonControlOption['btnIcon'];
  exitTitle: IButtonControlOption['title'];
}

export { Fullscreen };

export default class Fullscreen extends ButtonControl<IFullscreenControlOption> {
  protected isFullscreen = false;

  protected mapContainer: HTMLElement;

  constructor(option?: Partial<IFullscreenControlOption>) {
    super(option);

    if (!ScreenFull.isEnabled) {
      console.warn('当前浏览器环境不支持对地图全屏化');
    }
  }

  public setOptions(newOptions: Partial<IFullscreenControlOption>) {
    const { exitBtnText, exitBtnIcon, exitTitle } = newOptions;
    if (this.isFullscreen) {
      if (this.checkUpdateOption(newOptions, ['exitBtnIcon'])) {
        this.setBtnIcon(exitBtnIcon);
      }
      if (this.checkUpdateOption(newOptions, ['exitBtnText'])) {
        this.setBtnText(exitBtnText);
      }
      if (this.checkUpdateOption(newOptions, ['exitTitle'])) {
        this.setBtnTitle(exitTitle);
      }
    }
    super.setOptions(newOptions);
  }

  public onAdd(): HTMLElement {
    const button = super.onAdd();
    button.addEventListener('click', this.onClick);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.mapContainer = DOM.getContainer(this.scene.getSceneConfig().id!);
    this.mapContainer.addEventListener('fullscreenchange', this.onFullscreenChange);
    return button;
  }

  public onRemove() {
    super.onRemove();
    this.mapContainer.removeEventListener('fullscreenchange', this.onFullscreenChange);
  }

  public getDefault(option?: Partial<IFullscreenControlOption>): IFullscreenControlOption {
    return {
      ...super.getDefault(option),
      title: '全屏',
      btnIcon: createL7Icon('l7-icon-fullscreen'),
      exitTitle: '退出全屏',
      exitBtnIcon: createL7Icon('l7-icon-exit-fullscreen'),
    };
  }

  public toggleFullscreen = async () => {
    if (ScreenFull.isEnabled) {
      await ScreenFull.toggle(this.mapContainer);
    }
  };

  protected onClick = () => {
    this.toggleFullscreen();
  };

  protected onFullscreenChange = () => {
    this.isFullscreen = !!document.fullscreenElement;

    const { btnText, btnIcon, title, exitBtnText, exitBtnIcon, exitTitle } = this.controlOption;
    if (this.isFullscreen) {
      this.setBtnTitle(exitTitle);
      this.setBtnText(exitBtnText);
      this.setBtnIcon(exitBtnIcon);
    } else {
      this.setBtnTitle(title);
      this.setBtnText(btnText);
      this.setBtnIcon(btnIcon);
    }

    this.emit('fullscreenChange', this.isFullscreen);
  };
}
