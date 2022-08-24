import { createL7Icon } from '../utils/icon';
import SelectControl, {
  ISelectControlOption,
  OptionItem,
} from './baseControl/selectControl';

export interface IMapStyleControlOption extends ISelectControlOption {
  mapType: string;
}

export { MapTheme };

const GaodeMapStyles: OptionItem[] = [
  {
    text: '',
    value: '',
    img: '',
  },
];

const MapboxMapStyles: OptionItem[] = [
  {
    text: '',
    value: '',
    img: '',
  },
];

export default class MapTheme extends SelectControl<IMapStyleControlOption> {
  public getDefault(
    option?: Partial<IMapStyleControlOption>,
  ): IMapStyleControlOption {
    return {
      ...super.getDefault(option),
      title: '地图样式',
      btnIcon: createL7Icon('l7-icon-color'),
      options: [],
    };
  }

  public onAdd(): any {
    let { options } = this.controlOption;
    if (!options.length) {
      // tslint:disable-next-line:prefer-conditional-expression
      if (this.mapsService.getType() === 'mapbox') {
        this.controlOption.options = options = MapboxMapStyles;
      } else {
        this.controlOption.options = options = GaodeMapStyles;
      }
    }
    // if (!defaultValue) {
    //   console.log(this.scene);
    //   console.log(this.sceneContainer);
    // }
    const button = super.onAdd();
    return button;
  }
  protected getIsMultiple(): boolean {
    return false;
  }
}
