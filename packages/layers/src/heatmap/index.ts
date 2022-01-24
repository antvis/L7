import BaseLayer from '../core/BaseLayer';
import { IHeatMapLayerStyleOptions } from '../core/interface';
import HeatMapModels, { HeatMapModelType } from './models';
export default class HeatMapLayer extends BaseLayer<IHeatMapLayerStyleOptions> {
  public type: string = 'HeatMapLayer';

  public buildModels() {
    const shape = this.getModelType();
    this.layerModel = new HeatMapModels[shape](this);
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

  protected getModelType(): HeatMapModelType {
    const shapeAttribute = this.styleAttributeService.getLayerStyleAttribute(
      'shape',
    );
    const { shape3d } = this.getLayerConfig();
    const source = this.getSource();
    const sourceType = source.data.type;
    const shape =
      (shapeAttribute?.scale?.field as HeatMapModelType) || 'heatmap';
    if (shape === 'heatmap' || shape === 'heatmap3d') {
      return 'heatmap';
    }
    if (sourceType === 'hexagon') {
      return shape3d?.indexOf(shape) === -1 ? 'hexagon' : 'grid3d';
    }
    if (sourceType === 'grid') {
      return shape3d?.indexOf(shape) === -1 ? 'grid' : 'grid3d';
    }
    return 'heatmap';
  }
}
