import { ILayer, ILayerPlugin } from '@antv/l7-core';
import { injectable } from 'inversify';
import 'reflect-metadata';
/**
 * Layer Model 初始化，更新，销毁
 */
@injectable()
export default class LayerModelPlugin implements ILayerPlugin {
  public async initLayerModel(layer: ILayer) {
    // 更新Model 配置项
    layer.prepareBuildModel();
    // 初始化 Model
    await layer.buildModels();
    layer.styleNeedUpdate = false;
  }

  public async prepareLayerModel(layer: ILayer) {
    // 更新Model 配置项
    layer.prepareBuildModel();
    // clear layerModel resource
    // 初始化 Model
    await layer.buildModels();
    layer.layerModelNeedUpdate = false;
  }

  public apply(layer: ILayer) {
    layer.hooks.init.tapPromise('LayerModelPlugin', async () => {
      this.initLayerModel(layer);
    });

    layer.hooks.beforeRenderData.tapPromise('DataSourcePlugin', async () => {
      console.log('update');
      await this.prepareLayerModel(layer);
      return false;
    });
  }
}
