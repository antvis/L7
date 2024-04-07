import type { ILayerAttributesOption, ITexture2D } from '@antv/l7-core';
import { getDefaultDomain } from '@antv/l7-utils';
import type { IRasterLayerStyleOptions } from '../../core/interface';
import RasterLayer from '../../raster';
import Tile from './Tile';

const DEFAULT_COLOR_TEXTURE_OPTION = {
  positions: [0, 1],
  colors: ['#000', '#fff'],
};

export default class RasterTile extends Tile {
  private colorTexture: ITexture2D;
  public async initTileLayer(): Promise<void> {
    const attributes = this.parent.getLayerAttributeConfig();
    const layerOptions = this.getLayerOptions();
    const sourceOptions = this.getSourceOption();
    const { rampColors, domain } = this.getLayerOptions() as unknown as IRasterLayerStyleOptions;
    this.colorTexture = this.parent.textureService.getColorTexture(rampColors, domain);
    const layer = new RasterLayer({
      ...layerOptions,
      colorTexture: this.colorTexture,
    }).source(sourceOptions.data, sourceOptions.options);

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
    const { rasterData, ...res } = this.sourceTile.data.data;
    return {
      data: rasterData,
      options: {
        parser: {
          type: 'raster',
          extent: this.sourceTile.bounds,
          ...res,
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
    const { rampColors = DEFAULT_COLOR_TEXTURE_OPTION, domain } = arg as IRasterLayerStyleOptions;
    this.colorTexture = this.parent.textureService.getColorTexture(
      rampColors,
      domain || getDefaultDomain(rampColors),
    );
    this.layers.forEach((layer) => layer.style({ colorTexture: this.colorTexture }));
  }

  public destroy() {
    this.layers.forEach((layer) => layer.destroy());
  }
}
