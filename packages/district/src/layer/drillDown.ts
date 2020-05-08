import { Scene } from '@antv/l7';
import CityLayer from './city';
import CountryLayer from './country';
import { IDistrictLayerOption } from './interface';
import ProvinceLayer from './province';

export default class DrillDownLayer {
  private provinceLayer: ProvinceLayer;
  private cityLayer: CityLayer;
  private countryLayer: CountryLayer;
  constructor(scene: Scene, option: Partial<IDistrictLayerOption>) {
    this.countryLayer = new CountryLayer(scene, option);
    this.provinceLayer = new ProvinceLayer(scene);
  }
  public getDefaultOption() {
    return {
      province: {},
      city: {},
      county: {},
    };
  }
  public addProvinceEvent() {
    return 'event';
  }
}
