import { Scene } from '@antv/l7';
// tslint:disable-next-line: no-submodule-imports
import merge from 'lodash/merge';
import { DataConfig } from '../config';
import BaseLayer from './baseLayer';
import { IDistrictLayerOption } from './interface';

export interface IProvinceLayerOption extends IDistrictLayerOption {
  adcode: string[];
}
export default class CityLayer extends BaseLayer {
  constructor(scene: Scene, option: Partial<IProvinceLayerOption> = {}) {
    super(scene, option);
    this.addCountyFillLayer();
    this.addCountyLineLayer();
  }
  protected getdefaultOption(): IProvinceLayerOption {
    const config = super.getdefaultOption();
    return merge({}, config, {
      adcode: ['110100'],
      depth: 3,
    });
  }
  private async addCountyFillLayer() {
    const { depth, adcode } = this.options as IProvinceLayerOption;
    const countryConfig = DataConfig.country.CHN[depth];
    const fillData = await this.fetchData(countryConfig.fill);
    const data = fillData.features.filter((fe: any) => {
      const code = fe.properties.adcode;
      return adcode.indexOf('' + code) !== -1;
    });
    this.addFillLayer({ type: 'FeatureCollection', features: data });
  }

  private async addCountyLineLayer() {
    const { depth, adcode } = this.options as IProvinceLayerOption;
    const countryConfig = DataConfig.country.CHN[depth];
    const fillData = await this.fetchData(countryConfig.line);
    const data = fillData.features.filter((fe: any) => {
      const code = fe.properties.adcode;
      return adcode.indexOf(code) !== -1 || adcode.indexOf('' + code) !== -1;
    });
    this.addFillLine({ type: 'FeatureCollection', features: data });
  }
}
