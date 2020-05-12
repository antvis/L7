import { Scene } from '@antv/l7';
import CityLayer from './city';
import CountryLayer from './country';
import { adcodeType, IDistrictLayerOption } from './interface';
import ProvinceLayer from './province';

export default class DrillDownLayer {
  private provinceLayer: ProvinceLayer;
  private cityLayer: CityLayer;
  private countryLayer: CountryLayer;
  private scene: Scene;
  private drillState: 'province' | 'city' | 'county' = 'province';
  constructor(scene: Scene, option: Partial<IDistrictLayerOption>) {
    const cfg = this.getDefaultOption();
    this.scene = scene;
    this.countryLayer = new CountryLayer(scene, option);
    this.provinceLayer = new ProvinceLayer(scene, cfg.city);
    this.cityLayer = new CityLayer(scene, cfg.county);
    this.scene.setMapStatus({ doubleClickZoom: false });
    this.countryLayer.on('loaded', () => {
      this.addCountryEvent();
    });
    this.provinceLayer.on('loaded', () => {
      this.addProvinceEvent();
    });
    this.cityLayer.on('loaded', () => {
      this.addCityEvent();
    });
  }
  public getDefaultOption() {
    return {
      province: {},
      city: {
        adcode: [],
      },
      county: {
        adcode: [],
      },
    };
  }
  public addCountryEvent() {
    this.countryLayer.fillLayer.on('click', (e: any) => {
      this.countryLayer.hide();
      // 更新市级行政区划
      // this.provinceLayer.updateDistrict([e.feature.properties.adcode]);
      // this.drillState = 'city';
      this.drillDown(e.feature.properties.adcode);
    });
  }

  public addProvinceEvent() {
    this.provinceLayer.fillLayer.on('undblclick', () => {
      this.drillUp();
    });
    this.provinceLayer.fillLayer.on('click', (e: any) => {
      // this.provinceLayer.hide();
      // const adcode = e.feature.properties.adcode.toFixed(0);
      this.drillDown(e.feature.properties.adcode);
      // if (adcode.substr(2, 2) === '00') {
      //   adcode = adcode.substr(0, 2) + '0100';
      // }
      // // 更新县级行政区划
      // this.cityLayer.updateDistrict([adcode]);
      // this.drillState = 'county';
      // this.showCityView(adcode);
    });
  }

  public addCityEvent() {
    this.cityLayer.fillLayer.on('undblclick', () => {
      this.drillUp();
    });
  }

  public destroy() {
    this.countryLayer.destroy();
    this.provinceLayer.destroy();
    this.cityLayer.destroy();
  }

  public showProvinceView(
    adcode: adcodeType,
    newData: Array<{ [key: string]: any }> = [],
    joinByField?: [string, string],
  ) {
    this.provinceLayer.show();
    this.provinceLayer.updateDistrict(adcode, newData, joinByField);
    this.provinceLayer.fillLayer.fitBounds();
    this.cityLayer.hide();
    this.drillState = 'city';
  }
  public showCityView(
    code: adcodeType,
    newData: Array<{ [key: string]: any }> = [],
    joinByField?: [string, string],
  ) {
    this.cityLayer.show();
    let adcode = `${code}`;
    if (adcode.substr(2, 2) === '00') {
      adcode = adcode.substr(0, 2) + '0100';
    }
    // 更新县级行政区划
    this.cityLayer.updateDistrict(adcode, newData, joinByField);
    this.cityLayer.fillLayer.fitBounds();
    this.provinceLayer.hide();
    this.drillState = 'county';
  }

  /**
   * 向上
   */
  public drillUp() {
    switch (this.drillState) {
      case 'county':
        this.provinceLayer.show();
        this.provinceLayer.fillLayer.fitBounds();
        this.cityLayer.hide();
        this.drillState = 'city';
        break;
      case 'city':
        this.countryLayer.show();
        this.countryLayer.fillLayer.fitBounds();
        this.provinceLayer.hide();
        this.drillState = 'province';
        break;
    }
  }
  public drillDown(
    adcode: adcodeType,
    newData: Array<{ [key: string]: any }> = [],
    joinByField?: [string, string],
  ) {
    switch (this.drillState) {
      case 'province':
        this.showProvinceView(adcode);
        break;
      case 'city':
        this.showCityView(adcode);
        break;
    }
  }
}
