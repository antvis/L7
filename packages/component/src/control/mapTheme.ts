import { GaodeMapStyleConfig, MapboxMapStyleConfig } from '../constants';
import { createL7Icon } from '../utils/icon';
import SelectControl, {
  ISelectControlOption,
  OptionItem,
} from './baseControl/selectControl';

export interface IMapStyleControlOption extends ISelectControlOption {
  mapType: string;
}

export { MapTheme };

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

  public getStyleOptions(): OptionItem[] {
    const mapStyleConfig =
      this.mapsService.getType() === 'mapbox'
        ? MapboxMapStyleConfig
        : GaodeMapStyleConfig;
    return Object.entries(this.mapsService.getMapStyleConfig())
      .filter(([key, value]) => typeof value === 'string' && key !== 'blank')
      .map(([key, value]) => {
        // @ts-ignore
        const { text, img } = mapStyleConfig[key] ?? {};
        return {
          text: text ?? key,
          value,
          img,
        };
      });
  }

  public getMapStyle() {
    return this.mapsService.getMapStyle();
  }

  public onAdd(): any {
    if (!this.controlOption.options?.length) {
      this.controlOption.options = this.getStyleOptions();
    }
    if (!this.controlOption.defaultValue) {
      const defaultStyle = this.getMapStyle();
      this.controlOption.defaultValue = defaultStyle;
      this.selectValue = [defaultStyle];
    }
    this.on('selectChange', this.onMapThemeChange);
    return super.onAdd();
  }

  protected onMapThemeChange = () => {
    this.mapsService.setMapStyle(this.selectValue[0]);
  };

  protected getIsMultiple(): boolean {
    return false;
  }
}
