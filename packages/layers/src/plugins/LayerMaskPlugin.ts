import type { ILayer, ILayerPlugin } from '@antv/l7-core';
/**
 * 更新图层样式，初始图层相关配置
 */
export default class LayerMaskPlugin implements ILayerPlugin {
  /** 阶段 2.2 元数据：插件名，供 `LayerPluginRegistry` 按 name 索引。 */
  public readonly name = 'layer-mask';

  public apply(layer: ILayer) {
    layer.hooks.afterInit.tap('LayerMaskPlugin', () => {
      const { maskLayers, enableMask } = layer.getLayerConfig();
      // mask 初始化
      if (!layer.tileLayer && maskLayers && maskLayers.length > 0) {
        layer.updateLayerConfig({
          mask: enableMask,
        });
      }
    });
  }
}
