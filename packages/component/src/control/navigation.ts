import { Point } from '@antv/l7-core';
import { isNaN } from 'lodash';
import { createL7Icon } from '../utils/icon';
import ButtonControl, {
  IButtonControlOption,
} from './baseControl/buttonControl';

export interface INavigationControlOption extends IButtonControlOption {
  transform: (position: Point) => Point;
  zoom: number;
}

export { Navigation };

export default class Navigation extends ButtonControl<
  INavigationControlOption
> {
  public getDefault(
    option?: Partial<INavigationControlOption>,
  ): INavigationControlOption {
    return {
      ...super.getDefault(option),
      title: '定位',
      btnIcon: createL7Icon('l7-icon-reposition'),
      zoom: -1,
    };
  }

  public onAdd(): HTMLElement {
    const button = super.onAdd();
    button.addEventListener('click', this.onClick);
    return button;
  }

  public onClick = () => {
    if (!window.navigator.geolocation) {
      return;
    }
    const { transform, zoom } = this.controlOption;
    window.navigator.geolocation.getCurrentPosition(({ coords }) => {
      const { longitude, latitude } = coords ?? {};
      if (!isNaN(longitude) && !isNaN(latitude)) {
        const position: Point = [longitude, latitude];
        const currentZoom = this.mapsService.getZoom();
        this.mapsService.setZoomAndCenter(
          zoom >= 0 ? zoom : currentZoom > 15 ? currentZoom : 15,
          transform ? transform(position) : position,
        );
      }
    });
  };
}
