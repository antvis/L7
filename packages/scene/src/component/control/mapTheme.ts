import { GaodeMapStyleConfig, MapboxMapStyleConfig } from '../constants';
import { createL7Icon } from '../utils/icon';
import type { ControlOptionItem, ISelectControlOption } from './baseControl/selectControl';
import SelectControl from './baseControl/selectControl';

export { MapTheme };

export default class MapTheme extends SelectControl<ISelectControlOption> {
  public getDefault(option?: Partial<ISelectControlOption>): ISelectControlOption {
    return {
      ...super.getDefault(option),
      title: '地图样式',
      btnIcon: createL7Icon('l7-icon-color'),
      options: [],
    };
  }

  public getStyleOptions(): ControlOptionItem[] {
    const mapStyleConfig =
      this.mapsService.getType() === 'mapbox' ? MapboxMapStyleConfig : GaodeMapStyleConfig;
    return Object.entries(this.mapsService.getMapStyleConfig())
      .filter(([key, value]) => typeof value === 'string' && key !== 'blank')
      .map(([key, value]) => {
        // @ts-ignore
        const { text, img } = mapStyleConfig[key] ?? {};
        return {
          text: text ?? key,
          value,
          img,
          key,
        };
      });
  }

  public getMapStyle() {
    return this.mapsService.getMapStyle();
  }

  public onAdd(): HTMLElement {
    if (!this.controlOption.options?.length) {
      this.controlOption.options = this.getStyleOptions();
    }
    if (this.controlOption.defaultValue) {
      const defaultValue = this.controlOption.defaultValue as string;
      this.controlOption.defaultValue =
        this.controlOption.options.find((item) => item.key === defaultValue)?.value ?? defaultValue;
    } else {
      const defaultStyle = this.getMapStyle();
      if (defaultStyle) {
        this.controlOption.defaultValue = defaultStyle;
      } else {
        // @ts-ignore
        this.mapsService.map.once('styledata', () => {
          const mapboxStyle = this.mapsService.getMapStyle();
          this.controlOption.defaultValue = mapboxStyle;
          this.setSelectValue(mapboxStyle, false);
        });
      }
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
