import { ILayerAttributesOption, TYPES, IRendererService, ITexture2D } from '@antv/l7-core';
import { IColorRamp, generateColorRamp } from '@antv/l7-utils';
import RasterLayer from './layers/rasterDataLayer';
import Tile from './Tile';

interface ITileLayerStyleOptions {
  rampColors?: IColorRamp;
}

const COLOR_TEXTURE = 'raster-colorTexture';

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

  private initColorTexture(){
    const tileLayerService = this.parent.tileLayer.tileLayerService;
    const colorTexture = tileLayerService.tileResource.get(COLOR_TEXTURE);
    if(colorTexture) {
      this.colorTexture = colorTexture;
    } else {
      const container =  this.parent.getContainer();
      const rendererService = container.get<IRendererService>(
        TYPES.IRendererService,
      );
      const { rampColors = {
        positions: [0, 1],
        colors: ['#000', '#fff']
      } } = this.parent.getLayerConfig() as ITileLayerStyleOptions;
      this.colorTexture = this.createColorTexture(rampColors, rendererService);
      tileLayerService.tileResource.set(COLOR_TEXTURE, this.colorTexture)
    }
  }

  createColorTexture(config: IColorRamp, rendererService: IRendererService){
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
    this.colorTexture?.destroy();
    this.layers.forEach((layer) => layer.destroy());
  }
}
