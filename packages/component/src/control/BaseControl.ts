import {
  IControlService,
  ILayerService,
  IMapService,
  IRendererService,
  TYPES,
} from '@antv/l7-core';
import { DOM } from '@antv/l7-utils';
import { EventEmitter } from 'eventemitter3';
import { Container } from 'inversify';

export enum PositionType {
  'TOPRIGHT' = 'topright',
  'TOPLEFT' = 'topleft',
  'BOTTOMRIGHT' = 'bottomright',
  'BOTTOMLEFT' = 'bottomleft',
}
export type PositionName =
  | 'topright'
  | 'topleft'
  | 'bottomright'
  | 'bottomleft';
export interface IControlOption {
  position: PositionName;
  [key: string]: any;
}
export default class Control extends EventEmitter {
  public controlOption: IControlOption;
  protected container: HTMLElement;
  protected mapsService: IMapService;
  protected renderService: IRendererService;
  protected layerService: ILayerService;
  protected controlService: IControlService;

  private isShow: boolean;

  constructor(cfg?: Partial<IControlOption>) {
    super();
    this.controlOption = {
      ...this.getDefault(),
      ...(cfg || {}),
    };
  }

  public getDefault() {
    return {
      position: PositionType.TOPRIGHT,
    };
  }
  public setPosition(position: PositionName) {
    // 考虑组件的自动布局，需要销毁重建
    // const controlService = this.controlService;
    // if (controlService) {
    //   controlService.removeControl(this);
    // }
    // this.controlOption.position = position;
    // if (controlService) {
    //   controlService.addControl(this, this.mapsService);
    // }
    return this;
  }
  public addTo(sceneContainer: Container) {
    this.mapsService = sceneContainer.get<IMapService>(TYPES.IMapService);
    this.renderService = sceneContainer.get<IRendererService>(
      TYPES.IRendererService,
    );
    this.layerService = sceneContainer.get<ILayerService>(TYPES.ILayerService);
    this.controlService = sceneContainer.get<IControlService>(
      TYPES.IControlService,
    );

    this.isShow = true;
    this.container = this.onAdd();
    const container = this.container;
    const pos = this.controlOption.position;
    const corner = this.controlService.controlCorners[pos];
    DOM.addClass(container, 'l7-control');

    if (pos.indexOf('bottom') !== -1) {
      corner.insertBefore(container, corner.firstChild);
    } else {
      corner.appendChild(container);
    }
    return this;
  }
  public onAdd(): HTMLElement {
    throw new Error('Method not implemented.');
  }
  public hide() {
    const container = this.container;
    DOM.addClass(container, 'l7-control-hide');
    this.isShow = false;
  }
  public show() {
    const container = this.container;
    DOM.removeClass(container, 'l7-control-hide');
    this.isShow = true;
  }
  public remove() {
    if (!this.mapsService) {
      return this;
    }
    DOM.remove(this.container);
  }
  public _refocusOnMap(e: MouseEvent) {
    // if map exists and event is not a keyboard event
    if (this.mapsService && e && e.screenX > 0 && e.screenY > 0) {
      const container = this.mapsService.getContainer();
      if (container !== null) {
        container.focus();
      }
    }
  }
}
