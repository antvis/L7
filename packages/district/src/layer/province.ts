import {
  ILayer,
  LineLayer,
  PointLayer,
  PolygonLayer,
  Scene,
  StyleAttrField,
} from '@antv/l7';
// tslint:disable-next-line: no-submodule-imports
import merge from 'lodash/merge';
import { DataConfig } from '../config';
import BaseLayer from './baseLayer';
import { adcodeType, IDistrictLayerOption } from './interface';

export interface IProvinceLayerOption extends IDistrictLayerOption {
  adcode: adcodeType;
}
export default class ProvinceLayer extends BaseLayer {
  private fillData: any;
  private lineData: any;
  private labelData: any;
  constructor(scene: Scene, option: Partial<IProvinceLayerOption> = {}) {
    super(scene, option);
    this.addProvinceFillLayer();
    this.addProvinceLineLayer();
  }
  // 通过adcode 更新
  public updateDistrict(adcode: adcodeType) {
    const fillData = this.filterData(this.fillData, adcode);
    const lineData = this.filterData(this.lineData, adcode);
    const labelData = this.filterLabelData(this.labelData, adcode);
    this.fillLayer.setData(fillData);
    this.lineLayer.setData(lineData);
    this.labelLayer.setData(labelData);
  }

  // 更新渲染数据

  public updateData() {
    return 'update data';
  }

  protected getdefaultOption(): IProvinceLayerOption {
    const config = super.getdefaultOption();
    return merge({}, config, {
      adcode: ['110000'],
      depth: 2,
    });
  }

  protected filterData(data: any, adcode: adcodeType) {
    const adcodeArray = Array.isArray(adcode) ? adcode : [adcode];
    const features = data.features.filter((fe: any) => {
      const code = fe.properties.adcode_pro;
      return (
        adcodeArray.indexOf(code) !== -1 ||
        adcodeArray.indexOf('' + code) !== -1
      );
    });
    return { type: 'FeatureCollection', features };
  }

  protected filterLabelData(data: any, adcode: adcodeType) {
    const adcodeArray = Array.isArray(adcode) ? adcode : [adcode];
    const features = data.filter((fe: any) => {
      const code = fe.adcode_pro;
      return (
        adcodeArray.indexOf(code) !== -1 ||
        adcodeArray.indexOf('' + code) !== -1
      );
    });
    return features;
  }
  private async addProvinceFillLayer() {
    const { depth, adcode } = this.options as IProvinceLayerOption;
    const countryConfig = DataConfig.country.CHN[depth];
    const fillData = await this.fetchData(countryConfig.fill);

    this.labelData = fillData.features.map((feature: any) => {
      return {
        ...feature.properties,
        center: [feature.properties.x, feature.properties.y],
      };
    });
    const data = this.filterData(fillData, adcode);
    const labelData = this.filterLabelData(this.labelData, adcode);
    this.fillData = fillData;
    this.addFillLayer(data);
    this.addLabelLayer(labelData);
  }

  private async addProvinceLineLayer() {
    const { depth, adcode } = this.options as IProvinceLayerOption;
    const countryConfig = DataConfig.country.CHN[depth];
    const fillData = await this.fetchData(countryConfig.line);
    const data = this.filterData(fillData, adcode);
    this.lineData = fillData;
    this.addFillLine(data);
  }
}
