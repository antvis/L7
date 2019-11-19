import { AttributeType, gl, IEncodeFeature, ILayer } from '@l7/core';
import BaseLayer from '../core/BaseLayer';
import HeatMapModels, { HeatMapModelType } from './models';
interface IPointLayerStyleOptions {
  opacity: number;
}
export default class HeatMapLayer extends BaseLayer<IPointLayerStyleOptions> {
  public name: string = 'HeatMapLayer';
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

  protected renderModels() {
    const shape = this.getModelType();
    if (shape === 'heatmap') {
      this.layerModel.render();
      return;
    }
    this.models.forEach((model) =>
      model.draw({
        uniforms: this.layerModel.getUninforms(),
      }),
    );
    return this;
  }

  protected buildModels() {
    const shape = this.getModelType();
    this.layerModel = new HeatMapModels[shape](this);
    this.models = this.layerModel.buildModels();
  }
  private getModelType(): HeatMapModelType {
    const shapeAttribute = this.styleAttributeService.getLayerStyleAttribute(
      'shape',
    );
    const { shape3d } = this.configService.getConfig();
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
