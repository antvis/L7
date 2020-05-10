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
    const cfg = this.getDefaultOption();
    this.countryLayer = new CountryLayer(scene, option);
    this.provinceLayer = new ProvinceLayer(scene, cfg.city);
    // this.cityLayer = new CityLayer(scene);
    // this.provinceLayer.hide();
    // this.cityLayer.hide();
    this.countryLayer.on('loaded', () => {
      this.addProvinceEvent();
    });
  }
  public getDefaultOption() {
    return {
      province: {},
      city: {
        adcode: '',
      },
      county: {
        adcode: [],
      },
    };
  }
  public addProvinceEvent() {
    // this.countryLayer.fillLayer.on('click', (e: any) => {
    // });
  }
}
