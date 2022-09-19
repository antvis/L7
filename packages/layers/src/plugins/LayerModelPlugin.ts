import { ILayer, ILayerPlugin } from '@antv/l7-core';
import { injectable } from 'inversify';
import 'reflect-metadata';
/**
 * Layer Model 初始化，更新，销毁
 */
@injectable()
export default class LayerModelPlugin implements ILayerPlugin {
  public initLayerModel(layer: ILayer) {
    // 更新Model 配置项
    layer.prepareBuildModel();
    // 初始化 Model
    layer.buildModels();
    // emit layer model loaded
    layer.emit('modelLoaded', null);
    layer.styleNeedUpdate = false;
  }

  public prepareLayerModel(layer: ILayer) {
    // 更新Model 配置项
    layer.prepareBuildModel();
    layer.clearModels();
    // 初始化 Model
    layer.buildModels();
    // emit layer model loaded
    layer.emit('modelLoaded', null);
    layer.layerModelNeedUpdate = false;
  }

  public apply(layer: ILayer) {
    layer.hooks.init.tapPromise('LayerModelPlugin', () => {
      layer.inited = true;
      this.initLayerModel(layer);
    });

    layer.hooks.beforeRenderData.tap('DataSourcePlugin', () => {
      this.prepareLayerModel(layer);

      return false;
    });
  }
}
