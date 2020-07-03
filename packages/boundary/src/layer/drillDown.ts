import { Scene } from '@antv/l7';
// tslint:disable-next-line: no-submodule-imports
import mergeWith from 'lodash/mergeWith';
import CityLayer from './city';
import CountryLayer from './country';
import { adcodeType, IDrillDownOption } from './interface';
import ProvinceLayer from './province';
function mergeCustomizer(objValue: any, srcValue: any) {
  if (Array.isArray(srcValue)) {
    return srcValue;
  }
}
export default class DrillDownLayer {
  private options: Partial<IDrillDownOption>;
  private cityLayer: ProvinceLayer;
  private countyLayer: CityLayer;
  private provinceLayer: CountryLayer;
  private scene: Scene;
  private drillState: 0 | 1 | 2 = 0;
  private layers: any = [];
  constructor(scene: Scene, option: Partial<IDrillDownOption>) {
    this.options = mergeWith(this.getDefaultOption(), option, mergeCustomizer);
    this.scene = scene;
    this.provinceLayer = new CountryLayer(
      scene,
      this.getLayerOption('province'),
    );
    this.cityLayer = new ProvinceLayer(scene, this.getLayerOption('city'));
    this.countyLayer = new CityLayer(scene, this.getLayerOption('county'));
    this.scene.setMapStatus({ doubleClickZoom: false });
    if (!this.options.customTrigger) {
      this.provinceLayer.on('loaded', () => {
        this.addCountryEvent();
        this.layers.push(this.provinceLayer);
      });
      this.cityLayer.on('loaded', () => {
        this.addProvinceEvent();
        this.layers.push(this.cityLayer);
      });
      this.countyLayer.on('loaded', () => {
        this.addCityEvent();
        this.layers.push(this.cityLayer);
      });
    }
  }
  public getDefaultOption() {
    return {
      drillDepth: 2,
      customTrigger: false,
      drillDownTriggerEvent: 'click',
      drillUpTriggerEvent: 'undblclick',
      provinceData: [],
      cityData: [],
      countyData: [],
      city: {
        adcode: [],
      },
      county: {
        adcode: [],
      },
    };
  }
  public addCountryEvent() {
    const { drillDownTriggerEvent } = this.options;
    this.provinceLayer.fillLayer.on(
      drillDownTriggerEvent as string,
      (e: any) => {
        this.provinceLayer.hide();
        this.drillDown(e.feature.properties.adcode);
      },
    );
  }

  public addProvinceEvent() {
    const { drillDownTriggerEvent, drillUpTriggerEvent } = this.options;
    this.cityLayer.fillLayer.on(drillUpTriggerEvent as string, () => {
      this.drillUp();
    });
    this.cityLayer.fillLayer.on(drillDownTriggerEvent as string, (e: any) => {
      this.drillDown(e.feature.properties.adcode);
    });
  }

  public addCityEvent() {
    const { drillDownTriggerEvent, drillUpTriggerEvent } = this.options;
    this.countyLayer.fillLayer.on(drillUpTriggerEvent as string, () => {
      this.drillUp();
    });
  }

  public show() {
    this.layers.forEach((layer: any) => layer.show());
  }

  public hide() {
    this.layers.forEach((layer: any) => layer.hide());
  }

  public destroy() {
    this.layers.forEach((layer: any) => layer.destroy());
  }

  public showProvinceView(
    adcode: adcodeType,
    newData: Array<{ [key: string]: any }> = [],
    joinByField?: [string, string],
  ) {
    this.cityLayer.show();
    this.cityLayer.updateDistrict(adcode, newData, joinByField);
    this.cityLayer.fillLayer.fitBounds();
    this.countyLayer.hide();
    this.drillState = 1;
  }
  public showCityView(
    code: adcodeType,
    newData: Array<{ [key: string]: any }> = [],
    joinByField?: [string, string],
  ) {
    this.countyLayer.show();
    let adcode = `${code}`;
    if (adcode.substr(2, 2) === '00') {
      adcode = adcode.substr(0, 2) + '0100';
    }
    // 更新县级行政区划
    this.countyLayer.updateDistrict(adcode, newData, joinByField);
    this.countyLayer.fillLayer.fitBounds();
    this.cityLayer.hide();
    this.drillState = 2;
  }

  /**
   * 向上
   */
  public drillUp() {
    switch (this.drillState) {
      case 2:
        this.cityLayer.show();
        this.cityLayer.fillLayer.fitBounds();
        this.countyLayer.hide();
        this.drillState = 1;
        break;
      case 1:
        this.provinceLayer.show();
        this.provinceLayer.fillLayer.fitBounds();
        this.cityLayer.hide();
        this.drillState = 0;
        break;
    }
  }
  public drillDown(
    adcode: adcodeType,
    newData: Array<{ [key: string]: any }> = [],
    joinByField?: [string, string],
  ) {
    const { drillDepth } = this.options;
    if (this.drillState === drillDepth) {
      return;
    }
    switch (this.drillState) {
      case 0:
        this.showProvinceView(adcode, newData, joinByField);
        break;
      case 1:
        this.showCityView(adcode, newData, joinByField);
        break;
    }
  }

  public updateData(
    layer: 'province' | 'city' | 'county',
    newData: Array<{ [key: string]: any }>,
    joinByField?: [string, string],
  ) {
    switch (layer) {
      case 'province':
        this.provinceLayer.updateData(newData, joinByField);
        break;
      case 'city':
        this.cityLayer.updateData(newData, joinByField);
        break;
      case 'county':
        this.countyLayer.updateData(newData, joinByField);
    }
  }

  private getLayerOption(type: 'province' | 'city' | 'county') {
    const { joinBy, label, bubble, fill, popup, geoDataLevel } = this.options;
    const datatype = (type + 'Data') as
      | 'provinceData'
      | 'cityData'
      | 'countyData';
    return {
      data: this.options[datatype],
      joinBy,
      label,
      bubble,
      fill,
      popup,
      geoDataLevel,
      ...this.options[type],
    };
  }
}
