import { ILayer, ILayerPlugin, IMapService, TYPES } from '@antv/l7-core';
import { injectable } from 'inversify';
import 'reflect-metadata';
/**
 * 更新图层样式，初始图层相关配置
 */
@injectable()
export default class LayerStylePlugin implements ILayerPlugin {
  public apply(layer: ILayer) {
    layer.hooks.afterInit.tap('LayerStylePlugin', () => {
      // 更新图层默认状态
      layer.updateLayerConfig({});
      const { autoFit, fitBoundsOptions } = layer.getLayerConfig();
      if (autoFit) {
        setTimeout(() => {
          layer.fitBounds(fitBoundsOptions);
        }, 100);
      }
    });
  }
}
