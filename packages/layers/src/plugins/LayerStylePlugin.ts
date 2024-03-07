import type { ILayer, ILayerPlugin } from '@antv/l7-core';
/**
 * 更新图层样式，初始图层相关配置
 */
export default class LayerStylePlugin implements ILayerPlugin {
  public apply(layer: ILayer) {
    layer.hooks.afterInit.tap('LayerStylePlugin', () => {
      const { autoFit, fitBoundsOptions } = layer.getLayerConfig();
      // mask 初始化
      if (autoFit) {
        layer.fitBounds(fitBoundsOptions);
      }
      layer.styleNeedUpdate = false;
    });
  }
}
