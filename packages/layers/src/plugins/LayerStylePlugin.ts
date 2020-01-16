import { ILayer, ILayerPlugin, IMapService, TYPES } from '@antv/l7-core';
import Source from '@antv/l7-source';
import { encodePickingColor, rgb2arr } from '@antv/l7-utils';
import { injectable } from 'inversify';
/**
 * 更新图层样式，初始图层相关配置
 */
@injectable()
export default class LayerStylePlugin implements ILayerPlugin {
  public apply(layer: ILayer) {
    layer.hooks.afterInit.tap('LayerStylePlugin', () => {
      layer.updateLayerConfig({});
      const { autoFit } = layer.getLayerConfig();
      if (autoFit) {
        layer.fitBounds();
      }
    });
  }
}
