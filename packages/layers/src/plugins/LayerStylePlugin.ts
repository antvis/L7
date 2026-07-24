import type { ILayer, ILayerPlugin } from '@antv/l7-core';
/**
 * 更新图层样式，初始图层相关配置
 */
export default class LayerStylePlugin implements ILayerPlugin {
  /** 阶段 2.2 元数据：插件名，供 `LayerPluginRegistry` 按 name 索引。 */
  public readonly name = 'layer-style';

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
