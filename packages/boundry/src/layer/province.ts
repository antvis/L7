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
import { getDataConfig } from '../';
import BaseLayer from './baseLayer';
import { adcodeType, IDistrictLayerOption } from './interface';

export interface IProvinceLayerOption extends IDistrictLayerOption {
  adcode: adcodeType;
}
export default class ProvinceLayer extends BaseLayer {
  private fillRawData: any;
  private lineRawData: any;
  private labelRawData: any;
  constructor(scene: Scene, option: Partial<IProvinceLayerOption> = {}) {
    super(scene, option);
    this.addProvinceFillLayer();
    // this.addProvinceLineLayer();
  }
  // 通过adcode 更新
  public updateDistrict(
    adcode: adcodeType,
    newData: Array<{ [key: string]: any }> = [],
    joinByField?: [string, string],
  ) {
    if (!adcode && Array.isArray(adcode) && adcode.length === 0) {
      this.hide();
      return;
    }
    const { label, showBorder } = this.options;
    this.setOption({ adcode });
    const fillData = this.filterData(this.fillRawData, adcode);
    const lineData = this.filterData(this.lineRawData, adcode);
    const labelData = this.filterLabelData(this.labelRawData, adcode);
    if (this.options.bubble && this.options.bubble?.enable !== false) {
      const bubbleData = fillData.features.map((feature: any) => {
        return {
          ...feature.properties,
          center: [feature.properties.x, feature.properties.y],
        };
      });
      this.bubbleLayer.setData(bubbleData);
    }
    this.fillData = fillData;
    this.updateData(newData, joinByField);
    if (showBorder) {
      this.lineLayer.setData(lineData);
    }
    if (label.enable) {
      this.labelLayer.setData(labelData);
    }

    this.show();
  }

  protected getDefaultOption(): IProvinceLayerOption {
    const config = super.getDefaultOption();
    return merge({}, config, {
      adcode: ['110000'],
      depth: 2,
      label: {
        field: 'NAME_CHN',
        textAllowOverlap: false,
      },
      popup: {
        enable: true,
        Html: (props: any) => {
          return `<span>${props.NAME_CHN}</span>`;
        },
      },
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
    const { depth, adcode, label, showBorder } = this
      .options as IProvinceLayerOption;
    const countryConfig = getDataConfig(this.options.geoDataLevel).country.CHN[
      depth
    ];
    const fillData = await this.fetchData(countryConfig.fill);

    this.labelRawData = fillData.features.map((feature: any) => {
      return {
        ...feature.properties,
        center: [feature.properties.x, feature.properties.y],
      };
    });
    const data = this.filterData(fillData, adcode);
    const labelData = this.filterLabelData(this.labelRawData, adcode);
    this.fillRawData = fillData;
    this.addFillLayer(data);
    if (label.enable) {
      this.addLabelLayer(labelData);
    }
    this.lineRawData = fillData;
    if (showBorder) {
      this.addFillLine(data);
    }
  }

  private async addProvinceLineLayer() {
    const { depth, adcode } = this.options as IProvinceLayerOption;
    const countryConfig = getDataConfig(this.options.geoDataLevel).country.CHN[
      depth
    ];
    const fillData = await this.fetchData(countryConfig.line);
    const data = this.filterData(fillData, adcode);
    this.lineRawData = fillData;
    this.addFillLine(data);
  }
}
