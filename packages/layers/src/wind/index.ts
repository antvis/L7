import BaseLayer from '../core/BaseLayer';
import WindModels, { WindModelType } from './models';
interface IWindLayerStyleOptions {
  uMin?: number;
  uMax?: number;
  vMin?: number;
  vMax?: number;
  fadeOpacity?: number;
  speedFactor?: number;
  dropRate?: number;
  dropRateBump?: number;
  opacity?: number;
  numParticles?: number;
  rampColors?: {
    [key: number]: string;
  };
  sizeScale?: number;
}
export default class WindLayer extends BaseLayer<IWindLayerStyleOptions> {
  public type: string = 'WindLayer';
  public buildModels() {
    const modelType = this.getModelType();
    this.layerModel = new WindModels[modelType](this);
    this.models = this.layerModel.initModels();
  }
  public rebuildModels() {
    this.models = this.layerModel.buildModels();
  }

  public renderModels() {
    if (this.layerModel) {
      this.layerModel.render(); // 独立的渲染流程
    }

    return this;
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
  protected getDefaultConfig() {
    const type = this.getModelType();
    const defaultConfig = {
      wind: {},
    };
    return defaultConfig[type];
  }

  protected getModelType(): WindModelType {
    return 'wind';
  }
}
