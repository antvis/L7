import type { ILayer, ILayerPlugin, IMapService } from '@antv/l7-core';
import { IDebugLog, ILayerStage } from '@antv/l7-core';
import Source from '../source';

export default class DataSourcePlugin implements ILayerPlugin {
  protected mapService: IMapService;
  public apply(layer: ILayer) {
    this.mapService = layer.getContainer().mapService;
    layer.hooks.init.tapPromise('DataSourcePlugin', async () => {
      layer.log(IDebugLog.SourceInitStart, ILayerStage.INIT);
      let source = layer.getSource();
      if (!source) {
        // Tip: 用户没有传入 source 的时候使用图层的默认数据
        const { data, options } = layer.sourceOption || layer.defaultSourceConfig;
        source = new Source(data, options);
        layer.setSource(source);
      }
      if (source.inited) {
        this.updateClusterData(layer);
        layer.log(IDebugLog.SourceInitEnd, ILayerStage.INIT);
      } else {
        // 阶段 4.2：`source.ready`（4.1 infra）取代旧 `'update' {type:'inited'}` 手写
        // Promise 监听 —— 修复「任意 update 类型即 premature resolve」bug；init 失败
        // 由静默 hang 改 reject surface（minor 行为变化，见 BACKLOG）。
        await source.ready;
        this.updateClusterData(layer);
        layer.log(IDebugLog.SourceInitEnd, ILayerStage.INIT);
      }
    });

    // 检测数据是否需要更新
    layer.hooks.beforeRenderData.tapPromise('DataSourcePlugin', async () => {
      const neeUpdateCluster = this.updateClusterData(layer);

      const dataSourceNeedUpdate = layer.dataState.dataSourceNeedUpdate;
      layer.dataState.dataSourceNeedUpdate = false;

      const needScale = neeUpdateCluster || dataSourceNeedUpdate;
      return needScale;
    });
  }

  private updateClusterData(layer: ILayer): boolean {
    // Tip: 矢量瓦片不需要进行聚合操作
    if (layer.isTileLayer || layer.tileLayer || !layer.getSource()) {
      return false;
    }
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
