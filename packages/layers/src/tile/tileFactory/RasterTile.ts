import { ILayerAttributesOption, TYPES, IRendererService, ITexture2D } from '@antv/l7-core';
import { IColorRamp, generateColorRamp } from '@antv/l7-utils';
import RasterLayer from './layers/RasterDataLayer';
import Tile from './Tile';
import { isEqual } from 'lodash';

interface ITileLayerStyleOptions {
  rampColors?: IColorRamp;
}

const COLOR_TEXTURE = 'raster-colorTexture';
const COLOR_TEXTURE_OPTION = 'raster-colorTexture-option';
const DEFAULT_COLOR_TEXTURE_OPTION = {
  positions: [0, 1],
  colors: ['#000', '#fff']
};

export default class RasterTile extends Tile {
  private colorTexture: ITexture2D;
  public async initTileLayer(): Promise<void> {
    const attributes = this.parent.getLayerAttributeConfig();
    const layerOptions = this.parent.getLayerConfig()
    const sourceOptions = this.getSourceOption();
    
    this.initColorTexture()
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
    return {
      data: this.sourceTile.data.data,
      options: {
        parser: {
          type: 'raster',
          extent: this.sourceTile.bounds,
          width: this.sourceTile.data.width,
          height: this.sourceTile.data.height,
        },
        transforms: rawSource.transforms,
      },
    };
  }

  private getTileResource() {
    return this.parent.tileLayer.tileLayerService.tileResource;
  }

  private initColorTexture(){
    const tileResource = this.getTileResource();
    const colorTexture = tileResource.get(COLOR_TEXTURE);
    if(colorTexture) {
      this.colorTexture = colorTexture;
    } else {
      const container =  this.parent.getContainer();
      const rendererService = container.get<IRendererService>(
        TYPES.IRendererService,
      );
      const { rampColors = DEFAULT_COLOR_TEXTURE_OPTION } = this.parent.getLayerConfig() as ITileLayerStyleOptions;

      this.colorTexture = this.createColorTexture(rampColors, rendererService);

      tileResource.set(COLOR_TEXTURE, this.colorTexture);
      tileResource.set(COLOR_TEXTURE_OPTION, rampColors);
    }
  }

  private updateColorTexture(){
    const tileResource = this.getTileResource();
    tileResource.delete(COLOR_TEXTURE);
    this.initColorTexture();
  }

  /**
   * 用于 style 更新 colorTexture 的优化
   * @param arg 
   */
  public styleUpdate(...arg: any): void {
    const tileResource = this.getTileResource();
    const { rampColors = DEFAULT_COLOR_TEXTURE_OPTION } = arg;
    const cacheRampColors = tileResource.get(COLOR_TEXTURE_OPTION);
    if(!isEqual(rampColors, cacheRampColors)) {
      this.updateColorTexture();
    }
    this.layers.forEach(layer => layer.style({ colorTexture: this.colorTexture }));
  }

  private createColorTexture(config: IColorRamp, rendererService: IRendererService){
    const { createTexture2D } = rendererService;
    const imageData = generateColorRamp(config) as ImageData;
    const texture =  createTexture2D({
      data: imageData.data,
      width: imageData.width,
      height: imageData.height,
      flipY: false,
    });
    return texture;
  }

  public destroy() {
    this.layers.forEach((layer) => layer.destroy());
  }
}
