import { ILayer, ILayerPlugin, IModel } from '@antv/l7-core';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export default class LayerAnimateStylePlugin implements ILayerPlugin {
  public apply(layer: ILayer) {
    layer.hooks.beforeRender.tap('LayerAnimateStylePlugin', () => {
      // @ts-ignore
      const animateStatus = layer.animateStatus;
      if (animateStatus) {
        layer.models.forEach((model: IModel) => {
          model.addUniforms({
            ...layer.layerModel.getAnimateUniforms(),
          });
        });
      }
    });
  }
}
