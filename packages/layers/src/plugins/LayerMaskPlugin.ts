import type { ILayer, ILayerPlugin } from '@antv/l7-core';
/**
 * 更新图层样式，初始图层相关配置
 */
export default class LayerStylePlugin implements ILayerPlugin {
  public apply(layer: ILayer) {
    layer.hooks.afterInit.tap('LayerMaskPlugin', () => {
      const { maskLayers, enableMask } = layer.getLayerConfig();
      // mask 初始化
      if (!layer.tileLayer && maskLayers && maskLayers.length > 0) {
        layer.updateLayerConfig({
          mask: true && enableMask,
        });
      }
    });
  }
}
