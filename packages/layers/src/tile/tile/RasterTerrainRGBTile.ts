import { ILayerAttributesOption } from '@antv/l7-core';
import RasterLayer from '../../raster';
import Tile from './Tile';
export default class RasterTerrainRGBTile extends Tile {
  public async initTileLayer(): Promise<void> {
    const attributes = this.parent.getLayerAttributeConfig();
    const layerOptions = this.getLayerOptions();

    const sourceOptions = this.getSourceOption();
    const layer = new RasterLayer({ ...layerOptions }).source(
      sourceOptions.data,
      sourceOptions.options,
    );

    // 初始化数据映射
    // tslint:disable-next-line: no-unused-expression
    attributes &&
      Object.keys(attributes).forEach((type) => {
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
      data: this.sourceTile.data,
      options: {
        parser: {
          type: 'image',
          extent: this.sourceTile.bounds,
        },
        transforms: rawSource.transforms,
      },
    };
  }
}
