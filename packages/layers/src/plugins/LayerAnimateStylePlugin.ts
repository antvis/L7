import type { ILayer, ILayerPlugin, IModel } from '@antv/l7-core';

export default class LayerAnimateStylePlugin implements ILayerPlugin {
  /** 阶段 2.2 元数据：插件名，供 `LayerPluginRegistry` 按 name 索引。 */
  public readonly name = 'layer-animate-style';

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
