import type { Point } from '@antv/l7-core';
import { createL7Icon } from '../utils/icon';
import type { IButtonControlOption } from './baseControl/buttonControl';
import ButtonControl from './baseControl/buttonControl';

export interface IGeoLocateOption extends IButtonControlOption {
  transform: (position: Point) => Point | Promise<Point>;
}

export { GeoLocate };

export default class GeoLocate extends ButtonControl<IGeoLocateOption> {
  constructor(option?: Partial<IGeoLocateOption>) {
    super(option);

    if (!window.navigator.geolocation) {
      console.warn('当前浏览器环境不支持获取地理定位');
    }
  }

  public getDefault(option?: Partial<IGeoLocateOption>): IGeoLocateOption {
    return {
      ...super.getDefault(option),
      title: '定位',
      btnIcon: createL7Icon('l7-icon-reposition'),
    };
  }

  public onAdd(): HTMLElement {
    const button = super.onAdd();
    button.addEventListener('click', this.onClick);
    return button;
  }

  /**
   * 通过浏览器 API 获取当前所在经纬度
   */
  public getGeoLocation = () => {
    return new Promise<Point>((resolve, reject) => {
      window.navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const { longitude, latitude } = coords ?? {};
          if (!isNaN(longitude) && !isNaN(latitude)) {
            resolve([longitude, latitude]);
          } else {
            reject();
          }
        },
        (e) => {
          reject(e);
        },
      );
    });
  };

  public onClick = async () => {
    if (!window.navigator.geolocation) {
      return;
    }
    const { transform } = this.controlOption;
    const position = await this.getGeoLocation();
    const currentZoom = this.mapsService.getZoom();
    this.mapsService.setZoomAndCenter(
      currentZoom > 15 ? currentZoom : 15,
      transform ? await transform(position) : position,
    );
  };
}
