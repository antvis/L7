import { ILayer, ILayerPlugin, IDebugLog } from '@antv/l7-core';
import { injectable } from 'inversify';
import 'reflect-metadata';
import TileLayer from '../tile/tileLayer/BaseLayer';
/**
 * Layer Model 初始化，更新，销毁
 */
@injectable()
export default class LayerModelPlugin implements ILayerPlugin {
  private async build(layer: ILayer) {
    layer.log(IDebugLog.BuildModelStart);
    // 更新Model 配置项
    layer.prepareBuildModel();
    // 初始化 Model
    await layer.buildModels();

    layer.log(IDebugLog.BuildModelEnd);
  }

  public async initLayerModel(layer: ILayer) {
    await this.build(layer);

    layer.styleNeedUpdate = false;
  }

  public async prepareLayerModel(layer: ILayer) {
    await this.build(layer);
    // layer.layerModelNeedUpdate = false;
  }

  public apply(layer: ILayer) {
    layer.hooks.init.tapPromise('LayerModelPlugin', async () => {
      if (layer.getSource().isTile) {
        layer.prepareBuildModel();
        layer.tileLayer = new TileLayer(layer);
        return;
      }
      await this.initLayerModel(layer);
    });

    layer.hooks.beforeRenderData.tapPromise(
      'LayerModelPlugin',
      async (flag: boolean) => {
        if (!flag) {
          // TileLayer  不需要rebuilder
          return false;
        }
        if (layer.getSource().isTile) {
          layer.tileLayer = new TileLayer(layer);
          return false;
        }
        await this.prepareLayerModel(layer);
        return true;
      },
    );
  }
}
