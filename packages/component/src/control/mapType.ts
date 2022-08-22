import { createL7Icon } from '../utils/icon';
import SelectControl, {
  ISelectControlOption,
} from './baseControl/selectControl';

export interface MapTypeControlOption extends ISelectControlOption {
  mapType: string;
}

export { MapType };

export default class MapType extends SelectControl<MapTypeControlOption> {
  public getIsMultiple(): boolean {
    return false;
  }

  public getDefault(
    option?: Partial<MapTypeControlOption>,
  ): MapTypeControlOption {
    return {
      ...super.getDefault(option),
      title: '地图类型',
      btnIcon: createL7Icon('l7-icon-ditu'),
      options: [
        {
          text: '高德地图',
          value: 'gaode',
        },
        {
          text: 'Mapbox',
          value: 'mapbox',
        },
      ],
      defaultValue: 'gaode',
    };
  }

  public onAdd(): any {
    const layers = this.layerService.getLayers();

    const button = super.onAdd();
    return button;
  }
}
