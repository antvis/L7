import { IEncodeFeature } from '@antv/l7-core';
import BaseLayer from '../core/BaseLayer';
import EarthModels, { EarthType } from './models/index';
interface IPointLayerStyleOptions {
  opacity: number;
  strokeWidth: number;
  stroke: string;
}
export default class PointLayer extends BaseLayer<IPointLayerStyleOptions> {
  public type: string = 'PointLayer';
  public buildModels() {
    const modelType = this.getModelType();
    this.layerModel = new EarthModels[modelType](this);
    this.models = this.layerModel.initModels();
  }
  public rebuildModels() {
    this.models = this.layerModel.buildModels();
  }
  protected getConfigSchema() {
    return {
      properties: {
        opacity: {
          type: 'number',
          minimum: 0,
          maximum: 1,
        },
      },
    };
  }

  protected getModelType(): EarthType {
    // pointlayer
    //  2D、 3d、 shape、image、text、normal、
    const layerData = this.getEncodedData();
    const { shape2d, shape3d } = this.getLayerConfig();
    const iconMap = this.iconService.getIconMap();
    const item = layerData.find((fe: IEncodeFeature) => {
      return fe.hasOwnProperty('shape');
    });
    if (!item) {
      return 'base';
    } else {
      return 'base';
    }
  }
}
