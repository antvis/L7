import { DOM } from '@l7/utils';
import { inject, injectable } from 'inversify';
import { IMapService } from '../map/IMapService';
import {
  IControl,
  IControlCorners,
  IControlService,
  IControlServiceCfg,
} from './IControlService';

@injectable()
export default class ControlService implements IControlService {
  public container: HTMLElement;
  public controlCorners: IControlCorners;
  public controlContainer: HTMLElement;
  private controls: IControl[] = [];
  public init(cfg: IControlServiceCfg) {
    this.destroy();
    this.container = cfg.container;
    this.initControlPos();
  }

  public addControl(ctr: IControl, mapService: IMapService): void {
    ctr.addTo(mapService); // scene对象
    this.controls.push(ctr);
  }
  public removeControl(ctr: IControl): this {
    const index = this.controls.indexOf(ctr);
    if (index > -1) {
      this.controls.splice(index, 1);
    }
    ctr.remove();
    return this;
  }

  public destroy(): void {
    for (const ctr of this.controls) {
      ctr.remove();
    }
    this.controls = [];
    this.clearControlPos();
  }

  private initControlPos() {
    const corners: IControlCorners = (this.controlCorners = {});
    const l = 'l7-';
    const container = (this.controlContainer = DOM.create(
      'div',
      l + 'control-container',
      this.container,
    ));

    function createCorner(vSide: string, hSide: string) {
      const className = l + vSide + ' ' + l + hSide;

      corners[vSide + hSide] = DOM.create('div', className, container);
    }

    createCorner('top', 'left');
    createCorner('top', 'right');
    createCorner('bottom', 'left');
    createCorner('bottom', 'right');
  }

  private clearControlPos() {
    for (const i in this.controlCorners) {
      if (this.controlCorners[i]) {
        DOM.remove(this.controlCorners[i]);
      }
    }
    if (this.controlContainer) {
      DOM.remove(this.controlContainer);
    }
    delete this.controlCorners;
    delete this.controlContainer;
  }
}
