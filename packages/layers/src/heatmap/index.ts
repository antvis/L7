import { IAttributeAndElements, IRenderOptions } from '@antv/l7-core';
import BaseLayer from '../core/BaseLayer';
import { IHeatMapLayerStyleOptions } from '../core/interface';
import HeatMapModels, { HeatMapModelType } from './models';
export default class HeatMapLayer extends BaseLayer<IHeatMapLayerStyleOptions> {
  public type: string = 'HeatMapLayer';

  public async buildModels() {
    const shape = this.getModelType();
    this.layerModel = new HeatMapModels[shape](this);
    await this.initLayerModels();
  }

  public renderModels(options: Partial<IRenderOptions> = {}) {
    const shape = this.getModelType();
    if (shape === 'heatmap') {
      if (this.layerModel) {
        this.layerModel.render(options); // 独立的渲染流程
      }

      return this;
    }
    if (this.encodeDataLength <= 0 && !this.forceRender) {
      return this;
    }
    this.hooks.beforeRender.call();
    this.models.forEach((model) =>
      model.draw({
        uniforms: this.layerModel.getUninforms(),
        blend: this.layerModel.getBlend(),
        stencil: this.layerModel.getStencil(options),
      }),
    );
    this.hooks.afterRender.call();
    return this;
  }

  public updateModelData(data: IAttributeAndElements) {
    if (data.attributes && data.elements) {
      this.models[0].updateAttributesAndElements(
        data.attributes,
        data.elements,
      );
    } else {
      console.warn('data error');
    }
  }

  public getModelType(): HeatMapModelType {
    const shapeAttribute =
      this.styleAttributeService.getLayerStyleAttribute('shape');
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
