import { IModelUniform, ITexture2D, IRendererService } from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import { TileLayer } from '../tileLayer/TileLayer';
import { MapTileLayer } from '../tileLayer/MapTileLayer';
import { IColorRamp, generateColorRamp } from '@antv/l7-utils';
interface ITileLayerStyleOptions {
  rampColors?: IColorRamp;
}
export default class TileModel extends BaseModel {
  public colorTexture: ITexture2D;
  public getUninforms(): IModelUniform {
    return {};
  }

  private getTileLayer(usage?: string) {
    switch(usage) {
      case 'basemap':
        return MapTileLayer;
      default:
        return TileLayer;
    }
  }

  public initModels() {
    const source = this.layer.getSource();
    this.initGlobalResource();
    const { usage } = this.layer.getLayerConfig();
    if (source?.data.isTile && !this.layer.tileLayer) {
      const tileLayer = this.getTileLayer(usage);
      this.layer.tileLayer = new tileLayer({
        parent: this.layer,
        rendererService: this.rendererService,
        mapService: this.mapService,
        layerService: this.layerService,
        pickingService: this.pickingService,
        transforms: source.transforms,
      });
    }

    return this.buildModels();
  }

  // 初始化全局资源 - 所有瓦片共用的资源
  initGlobalResource() {
    const { rampColors } = this.layer.getLayerConfig() as ITileLayerStyleOptions;
    if(rampColors) {
      this.colorTexture = this.createColorTexture(rampColors, this.rendererService);
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

  public clearModels(): void {
    this.colorTexture?.destroy();
    this.dataTexture?.destroy();
  }

  public async buildModels() {
    return [];
  }

  protected registerBuiltinAttributes() {
    //
  }
}
