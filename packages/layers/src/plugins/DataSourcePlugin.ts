import { ILayer, ILayerPlugin, IMapService, TYPES } from '@antv/l7-core';
import Source from '@antv/l7-source';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export default class DataSourcePlugin implements ILayerPlugin {
  protected mapService: IMapService;
  public apply(layer: ILayer) {
    this.mapService = layer.getContainer().get<IMapService>(TYPES.IMapService);
    layer.hooks.init.tap('DataSourcePlugin', () => {
      let source = layer.getSource();
      if (!source) {
        // Tip: 用户没有传入 source 的时候使用图层的默认数据
        const { data, options } =
          layer.sourceOption || layer.defaultSourceConfig;
        source = new Source(data, options);
        layer.setSource(source);
      }
      if (source.inited) {
        this.updateClusterData(layer);
      } else {
        source.once('update', () => {
          this.updateClusterData(layer);
        });
      }
    });

    // 检测数据是否需要更新
    layer.hooks.beforeRenderData.tap('DataSourcePlugin', () => {
      const neeUpdateCluster = this.updateClusterData(layer);
      const dataSourceNeedUpdate = layer.dataState.dataSourceNeedUpdate;
      layer.dataState.dataSourceNeedUpdate = false;
      return neeUpdateCluster || dataSourceNeedUpdate;
    });
  }

  private updateClusterData(layer: ILayer): boolean {
    // Tip: 矢量瓦片不需要进行聚合操作
    if (layer.isTileLayer || layer.tileLayer) return false;
    const source = layer.getSource();
    const cluster = source.cluster;
    const { zoom = 0 } = source.clusterOptions;
    const newZoom = this.mapService.getZoom() - 1;
    const dataSourceNeedUpdate = layer.dataState.dataSourceNeedUpdate;
    if (cluster && dataSourceNeedUpdate) {
      // 数据发生更新
      source.updateClusterData(Math.floor(newZoom));
    }
    // 如果 dataSource 有更新，跳过 zoom 的判断，直接更新一次
    if (cluster && Math.abs(layer.clusterZoom - newZoom) >= 1) {
      if (zoom !== Math.floor(newZoom)) {
        source.updateClusterData(Math.floor(newZoom));
      }
      layer.clusterZoom = newZoom;
      return true;
    }
    return false;
  }
}
