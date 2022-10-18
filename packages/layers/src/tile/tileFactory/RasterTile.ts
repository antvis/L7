import { ILayerAttributesOption } from '@antv/l7-core';
import { getTileLayer } from './util';
import Tile from './Tile';
export default class RasterTile extends Tile {
  public async initTileLayer(): Promise<void> {
    const attributes = this.parent.getLayerAttributeConfig();
    const layerOptions = this.parent.getLayerConfig();
    const rasterLayer = getTileLayer(this.parent.type);
    const sourceOptions = this.getSourceOption();
    const layer = new rasterLayer({...layerOptions}).source(
      sourceOptions.data,
      sourceOptions.options,
    );

    // 初始化数据映射
    attributes && Object.keys(attributes).forEach((type) => {
      const attr = type as keyof ILayerAttributesOption;
      // @ts-ignore
      layer[attr](attributes[attr]?.field, attributes[attr]?.values);
    });

    await this.addLayer(layer);
    this.isLoaded = true;
  }
  protected getSourceOption() {
    const rawSource = this.parent.getSource();
    return {
      data: this.sourceTile.data.data,
      options: {
        parser: {
          type: 'raster',
          extent: this.sourceTile.bounds,
          cancelExtent: true,
          width: this.sourceTile.data.width,
          height: this.sourceTile.data.height,
        },
        transforms: rawSource.transforms,
      },
    };
  }
}
