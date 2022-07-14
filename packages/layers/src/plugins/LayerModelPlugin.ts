import { ILayer, ILayerPlugin, IMapService, TYPES } from '@antv/l7-core';
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
    layer.styleNeedUpdate = false;
  }

  public prepareLayerModel(layer: ILayer) {
    // 更新Model 配置项
    layer.prepareBuildModel();

    layer.clearModels();
    // 初始化 Model
    layer.buildModels();
    layer.layerModelNeedUpdate = false;
  }

  public apply(layer: ILayer) {
    layer.hooks.init.tap('LayerModelPlugin', () => {
      const source = layer.getSource();
      if (source.inited) {
        this.initLayerModel(layer);
      } else {
        // @ts-ignore
        source.once('sourceInited', () => {
          this.initLayerModel(layer);
        });
      }
    });

    layer.hooks.beforeRenderData.tap('DataSourcePlugin', () => {
      const source = layer.getSource();
      if (source.inited) {
        this.prepareLayerModel(layer);
      } else {
        // @ts-ignore
        source.once('sourceInited', () => {
          this.prepareLayerModel(layer);
        });
      }
      return false;
    });
  }
}
