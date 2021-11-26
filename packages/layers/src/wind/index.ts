import BaseLayer from '../core/BaseLayer';
import WindModels, { WindModelType } from './models';
interface IWindMapLayerStyleOptions {
  opacity: number;
}
export default class HeatMapLayer extends BaseLayer<IWindMapLayerStyleOptions> {
  public type: string = 'HeatMapLayer';

  public buildModels() {
    const shape = this.getModelType();
    this.layerModel = new WindModels[shape](this);
    this.models = this.layerModel.initModels();
  }
  public rebuildModels() {
    this.models = this.layerModel.buildModels();
  }
  public renderModels() {
    const shape = this.getModelType();
    if (shape === 'heatmap') {
      if (this.layerModel) {
        this.layerModel.render(); // 独立的渲染流程
      }

      return this;
    }
    if (this.layerModelNeedUpdate) {
      this.models = this.layerModel.buildModels();
      this.layerModelNeedUpdate = false;
    }
    this.models.forEach((model) =>
      model.draw({
        uniforms: this.layerModel.getUninforms(),
      }),
    );
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

  protected getModelType(): WindModelType {
    const shapeAttribute = this.styleAttributeService.getLayerStyleAttribute(
      'shape',
    );
    const shape =
      (shapeAttribute?.scale?.field as WindModelType) || 'heatmap';
    if (shape === 'heatmap' || shape === 'heatmap3d') {
      return 'heatmap';
    }
    return 'heatmap';
  }
}
