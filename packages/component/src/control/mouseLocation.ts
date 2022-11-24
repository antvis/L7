import { ILngLat, Position, PositionType } from '@antv/l7-core';
import { DOM } from '@antv/l7-utils';
import Control, { IControlOption } from './baseControl/control';

export interface IMouseLocationControlOption extends IControlOption {
  transform: (position: Position) => Position;
}

export { MouseLocation };

export default class MouseLocation extends Control<IMouseLocationControlOption> {
  protected location: Position = [0, 0];

  public getLocation() {
    return this.location;
  }

  public getDefault(
    option?: Partial<IMouseLocationControlOption>,
  ): IMouseLocationControlOption {
    return {
      ...super.getDefault(option),
      position: PositionType.BOTTOMLEFT,
      transform: ([lng, lat]) => {
        return [+(+lng).toFixed(6), +(+lat).toFixed(6)];
      },
    };
  }

  public onAdd(): HTMLElement {
    const container = DOM.create('div', 'l7-control-mouse-location');
    container.innerHTML = '&nbsp;';
    this.mapsService.on('mousemove', this.onMouseMove);
    return container;
  }

  public onRemove(): void {
    this.mapsService.off('mousemove', this.onMouseMove);
  }
  protected onMouseMove = (e: any) => {
    let position: Position = this.location;
    const lngLat: ILngLat | undefined = e.lngLat || e.lnglat;
    const { transform } = this.controlOption;
    if (lngLat) {
      position = [lngLat.lng, lngLat.lat];
    }
    this.location = position;
    if (transform) {
      position = transform(position);
    }
    this.insertLocation2HTML(position);
    this.emit('locationChange', position);
  };

  protected insertLocation2HTML(position: Position) {
    this.container.innerText = position.join(', ');
  }
}
