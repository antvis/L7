import {
  IControlOption,
  IControlService,
  ILayerService,
  IMapService,
  IRendererService,
  PositionType,
  TYPES,
} from '@antv/l7-core';
import { DOM } from '@antv/l7-utils';
import { EventEmitter } from 'eventemitter3';
import { Container } from 'inversify';

export { PositionType } from '@antv/l7-core';

let controlId = 0;
export default class Control extends EventEmitter {
  public controlOption: IControlOption;
  protected container: HTMLElement;
  protected sceneContainer: Container;
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
      name: `${controlId++}`,
    };
  }

  public setPosition(position: PositionType = PositionType.BOTTOMRIGHT) {
    // 考虑组件的自动布局，需要销毁重建
    const controlService = this.controlService;
    if (controlService) {
      controlService.removeControl(this);
    }
    this.controlOption.position = position;
    if (controlService) {
      controlService.addControl(this, this.sceneContainer);
    }
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
    this.sceneContainer = sceneContainer;
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

  public onRemove(): void {
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
    this.onRemove();
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
