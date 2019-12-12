import EventEmitter from 'eventemitter3';
import Hammer from 'hammerjs';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { ILogService } from '../log/ILogService';
import { IMapService } from '../map/IMapService';
import { IInteractionService, InteractionEvent } from './IInteractionService';
/**
 * 由于目前 L7 与地图结合的方案为双 canvas 而非共享 WebGL Context，事件监听注册在地图底图上。
 * 除此之外，后续如果支持非地图场景，事件监听就需要注册在 L7 canvas 上。
 */
@injectable()
export default class InteractionService extends EventEmitter
  implements IInteractionService {
  @inject(TYPES.IMapService)
  private readonly mapService: IMapService;

  @inject(TYPES.ILogService)
  private readonly logger: ILogService;

  private hammertime: HammerManager;

  public init() {
    // 注册事件在地图底图上
    this.addEventListenerOnMap();
  }

  public destroy() {
    if (this.hammertime) {
      this.hammertime.destroy();
    }
    this.removeEventListenerOnMap();
    this.off(InteractionEvent.Hover);
  }

  public triggerHover({ x, y }: { x: number; y: number }) {
    this.emit(InteractionEvent.Hover, { x, y });
  }

  private addEventListenerOnMap() {
    const $containter = this.mapService.getMapContainer();
    if ($containter) {
      const hammertime = new Hammer($containter);
      hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL });
      hammertime.get('pinch').set({ enable: true });

      // hammertime.on('panstart', this.onPanstart);
      // hammertime.on('panmove', this.onPanmove);
      // hammertime.on('panend', this.onPanend);
      // hammertime.on('pinch', this.onPinch);
      $containter.addEventListener('mousemove', this.onHover);
      $containter.addEventListener('click', this.onHover);
      $containter.addEventListener('mousedown', this.onHover);
      $containter.addEventListener('mouseup', this.onHover);
      $containter.addEventListener('dblclick', this.onHover);
      $containter.addEventListener('contextmenu', this.onHover);

      this.hammertime = hammertime;

      // TODO: 根据场景注册事件到 L7 canvas 上
      this.logger.debug('add event listeners on canvas');
    }
  }

  private removeEventListenerOnMap() {
    const $containter = this.mapService.getMapContainer();
    if ($containter) {
      $containter.removeEventListener('mousemove', this.onHover);
      $containter.removeEventListener('click', this.onHover);
      $containter.removeEventListener('mousedown', this.onHover);
      $containter.removeEventListener('mouseup', this.onHover);
      $containter.removeEventListener('dblclick', this.onHover);
      $containter.removeEventListener('contextmenu', this.onHover);
    }
  }

  private onHover = ({ x, y, type }: MouseEvent) => {
    const $containter = this.mapService.getMapContainer();
    if ($containter) {
      const { top, left } = $containter.getBoundingClientRect();
      x -= left;
      y -= top;
    }
    this.emit(InteractionEvent.Hover, { x, y, type });
  };
}
