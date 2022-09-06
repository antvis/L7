import { IModelUniform } from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import { TMSTileLayer } from '../tmsTileLayer';
import { TMSBaseMapTileLayer } from '../tmsMapTileLayer';
export default class TileModel extends BaseModel {
  public getUninforms(): IModelUniform {
    return {};
  }

  public initModels() {
    const source = this.layer.getSource();
    const { usage } = this.layer.getLayerConfig();
    if (source?.data.isTile && !this.layer.tileLayer) {
      const tileLayer = (usage === 'basemap' ? TMSBaseMapTileLayer : TMSTileLayer);
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

  public buildModels() {
    return [];
  }

  protected registerBuiltinAttributes() {
    //
  }
}
