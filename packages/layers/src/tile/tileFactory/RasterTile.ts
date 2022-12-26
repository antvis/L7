import { ILayerAttributesOption, ITexture2D } from '@antv/l7-core';
import RasterLayer from '../../raster'
import { IRasterLayerStyleOptions } from '../../core/interface';
import Tile from './Tile';

const DEFAULT_COLOR_TEXTURE_OPTION = {
  positions: [0, 1],
  colors: ['#000', '#fff']
};

export default class RasterTile extends Tile {
  private colorTexture: ITexture2D;
  public async initTileLayer(): Promise<void> {
    const attributes = this.parent.getLayerAttributeConfig();
    const layerOptions = this.getLayerOptions();
    const sourceOptions = this.getSourceOption();
    this.colorTexture = this.parent.textureService.getColorTexture((layerOptions as unknown as IRasterLayerStyleOptions).rampColors)
    const layer = new RasterLayer({
      ...layerOptions,
      colorTexture: this.colorTexture,
    })
    .source(
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
    const {rasterData,...res} = this.sourceTile.data.data;
    return {
      data: rasterData,
      options: {
        parser: {
          type: 'raster',
          extent: this.sourceTile.bounds,
          ...res
        },
        transforms: rawSource.transforms,
      },
    };
  }

  /**
   * 用于 style 更新 colorTexture 的优化
   * @param arg 
   */
  public styleUpdate(...arg: any): void {

    const { rampColors = DEFAULT_COLOR_TEXTURE_OPTION} = arg;
    this.colorTexture = this.parent.textureService.getColorTexture(rampColors)
    this.layers.forEach(layer => layer.style({ colorTexture: this.colorTexture }));
  }


  public destroy() {
    this.layers.forEach((layer) => layer.destroy());
  }
}
