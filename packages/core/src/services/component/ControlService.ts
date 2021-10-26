import { DOM } from '@antv/l7-utils';
import { Container, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../../types';
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
  public scene: Container;
  public mapsService: IMapService;
  private controls: IControl[] = [];
  private unAddControls: IControl[] = [];
  public init(cfg: IControlServiceCfg, sceneContainer: Container) {
    this.container = cfg.container;
    this.scene = sceneContainer;
    this.mapsService = sceneContainer.get<IMapService>(TYPES.IMapService);
    this.initControlPos();
  }
  public addControl(ctr: IControl, sceneContainer: Container): void {
    const mapsService = sceneContainer.get<IMapService>(TYPES.IMapService);
    if (mapsService.map) {
      ctr.addTo(this.scene); // scene对象
      this.controls.push(ctr);
    } else {
      this.unAddControls.push(ctr);
    }
  }
  public getControlByName(name: string | number): IControl | undefined {
    return this.controls.find((ctr) => {
      return ctr.controlOption.name === name;
    });
  }
  public removeControl(ctr: IControl): this {
    const index = this.controls.indexOf(ctr);
    if (index > -1) {
      this.controls.splice(index, 1);
    }
    ctr.remove();
    return this;
  }

  public addControls() {
    this.unAddControls.forEach((ctr: IControl) => {
      ctr.addTo(this.scene); // scene对象
      this.controls.push(ctr);
    });
    this.unAddControls = [];
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

    function createCorner(vSideList: string[] = []) {
      const className = vSideList.map((item) => l + item).join(' ');
      corners[vSideList.join('')] = DOM.create('div', className, container);
    }

    createCorner(['top', 'left']);
    createCorner(['top', 'right']);
    createCorner(['bottom', 'left']);
    createCorner(['bottom', 'right']);

    createCorner(['top', 'center']);
    createCorner(['right', 'center']);
    createCorner(['left', 'center']);
    createCorner(['bottom', 'center']);
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
