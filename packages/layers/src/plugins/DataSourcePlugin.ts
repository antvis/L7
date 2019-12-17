import { ILayer, ILayerPlugin, IMapService, TYPES } from '@antv/l7-core';
import Source from '@antv/l7-source';
import { injectable } from 'inversify';

@injectable()
export default class DataSourcePlugin implements ILayerPlugin {
  protected mapService: IMapService;
  public apply(layer: ILayer) {
    this.mapService = layer.getContainer().get<IMapService>(TYPES.IMapService);
    layer.hooks.init.tap('DataSourcePlugin', () => {
      const { data, options } = layer.sourceOption;
      layer.setSource(new Source(data, options));
      this.updateClusterData(layer);
    });

    // 检测数据是不否需要更新
    layer.hooks.beforeRenderData.tap('DataSourcePlugin', (flag) => {
      return this.updateClusterData(layer);
    });
  }

  private updateClusterData(layer: ILayer): boolean {
    const source = layer.getSource();
    const cluster = source.cluster;
    const { zoom = 0, maxZoom = 16 } = source.clusterOptions;
    const newZoom = this.mapService.getZoom();
    if (cluster && Math.abs(zoom - newZoom) > 1 && maxZoom > zoom) {
      source.updateClusterData(Math.floor(newZoom));
      return true;
    }
    return false;
  }
}
