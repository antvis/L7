import { ILayer, ILayerPlugin, IMapService, TYPES } from '@antv/l7-core';
import { injectable } from 'inversify';
/**
 * Layer Model 初始化，更新，销毁
 */
@injectable()
export default class LayerModelPlugin implements ILayerPlugin {
  public apply(layer: ILayer) {
    layer.hooks.init.tap('LayerModelPlugin', () => {
      // 更新Model 配置项
      layer.prepareBuildModel();
      // 初始化 Model
      layer.buildModels();
      layer.styleNeedUpdate = false;
    });

    layer.hooks.beforeRenderData.tap('DataSourcePlugin', () => {
      // 更新Model 配置项
      layer.prepareBuildModel();

      layer.clearModels();
      // 初始化 Model
      layer.buildModels();
      layer.layerModelNeedUpdate = false;
      return false;
    });
  }
}
