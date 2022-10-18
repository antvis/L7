import { IModelUniform } from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import { TileLayer } from '../tileLayer/TileLayer';
import { MapTileLayer } from '../tileLayer/MapTileLayer';
export default class TileModel extends BaseModel {
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

  public clearModels(): void {
  }

  public async buildModels() {
    return [];
  }

  protected registerBuiltinAttributes() {
    //
  }
}
