import Hammer from 'hammerjs';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { ILogService } from '../log/ILogService';
import { IRendererService } from '../renderer/IRendererService';
import { IInteractionService } from './IInteractionService';

@injectable()
export default class InteractionService implements IInteractionService {
  @inject(TYPES.IRendererService)
  private readonly rendererService: IRendererService;

  @inject(TYPES.ILogService)
  private readonly logger: ILogService;

  private hammertime: HammerManager;

  public init() {
    const $containter = this.rendererService.getContainer();
    if ($containter) {
      const hammertime = new Hammer($containter);
      hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL });
      hammertime.get('pinch').set({ enable: true });

      // hammertime.on('panstart', this.onPanstart);
      hammertime.on('panmove', this.onPanmove);
      // hammertime.on('panend', this.onPanend);
      // hammertime.on('pinch', this.onPinch);

      // $containter.addEventListener('wheel', this.onMousewheel);
      this.hammertime = hammertime;
    }
  }

  public destroy() {
    if (this.hammertime) {
      this.hammertime.destroy();
    }
    const $containter = this.rendererService.getContainer();
    if ($containter) {
      // $containter.removeEventListener('wheel', this.onMousewheel);
    }
  }

  private onPanmove = (e: HammerInput) => {
    // @ts-ignore
    // this.logger.info(e);
    // if (this.isMoving) {
    //   this.deltaX = e.center.x - this.lastX;
    //   this.deltaY = e.center.y - this.lastY;
    //   this.lastX = e.center.x;
    //   this.lastY = e.center.y;
    //   this.emit(Mouse.MOVE_EVENT, {
    //     deltaX: this.deltaX,
    //     deltaY: this.deltaY,
    //     deltaZ: this.deltaZ
    //   });
    // }
  };
}
