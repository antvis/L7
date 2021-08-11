import {
  ILayer,
  ILayerPlugin,
  ILngLat,
  IMapService,
  TYPES,
} from '@antv/l7-core';
import Source from '@antv/l7-source';
import { injectable } from 'inversify';
import { cloneDeep } from 'lodash';
import 'reflect-metadata';

@injectable()
export default class DataSourcePlugin implements ILayerPlugin {
  protected mapService: IMapService;
  public apply(layer: ILayer) {
    this.mapService = layer.getContainer().get<IMapService>(TYPES.IMapService);
    layer.hooks.init.tap('DataSourcePlugin', () => {
      const source = layer.getSource();
      if (!source) {
        const { data, options } = layer.sourceOption;
        layer.setSource(new Source(data, options));
      }

      this.updateClusterData(layer);
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
    const source = layer.getSource();
    const cluster = source.cluster;
    const { zoom = 0, maxZoom = 16 } = source.clusterOptions;
    const newZoom = this.mapService.getZoom() - 1;
    const dataSourceNeedUpdate = layer.dataState.dataSourceNeedUpdate;
    // 如果 dataSource 有更新，跳过 zoom 的判断，直接更新一次
    if (
      cluster &&
      (dataSourceNeedUpdate || Math.abs(zoom - newZoom) > 1) &&
      maxZoom > zoom
    ) {
      source.updateClusterData(Math.floor(newZoom));
      return true;
    }
    return false;
  }
}
