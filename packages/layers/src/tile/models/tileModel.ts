import { IModelUniform, ITexture2D, IRendererService } from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import TileLayer from '../tileLayer/BaseLayer';
// import { MapTileLayer } from '../tileLayer/MapTileLayer';
import { IColorRamp, generateColorRamp } from '@antv/l7-utils';
interface ITileLayerStyleOptions {
  rampColors?: IColorRamp;
}
export default class TileModel extends BaseModel {
  public colorTexture: ITexture2D;
  public getUninforms(): IModelUniform {
    return {};
  }

  private getTileLayer() {
    return TileLayer;
  }

  public initModels() {
    const source = this.layer.getSource();
    this.initTileResource();
    if (source?.data.isTile && !this.layer.tileLayer) {
      const tileLayer = this.getTileLayer();
      this.layer.tileLayer = new tileLayer(this.layer);
    }

    return this.buildModels();
  }

  // 初始化全局资源 - 所有瓦片共用的资源
  initTileResource() {
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
