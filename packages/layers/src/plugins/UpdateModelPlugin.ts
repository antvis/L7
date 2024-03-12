import type { ILayer, ILayerPlugin } from '@antv/l7-core';
/**
 * Model 更新
 */
export default class UpdateModelPlugin implements ILayerPlugin {
  public apply(layer: ILayer) {
    layer.hooks.beforeRender.tap('UpdateModelPlugin', () => {
      // 处理文本更新
      if (layer.layerModel) {
        layer.layerModel.needUpdate().then((flag) => {
          if (flag) {
            layer.renderLayers();
          }
        });
      }
    });
    layer.hooks.afterRender.tap('UpdateModelPlugin', () => {
      layer.layerModelNeedUpdate = false;
    });
  }
}
