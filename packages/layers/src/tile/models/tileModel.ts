import { IModelUniform } from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import { TMSTileLayer } from '../tmsTileLayer';
export default class TileModel extends BaseModel {
  public getUninforms(): IModelUniform {
    return {};
  }

  public initModels() {
    const source = this.layer.getSource();
    if (source?.data.isTile && !this.layer.tileLayer) {
      this.layer.tileLayer = new TMSTileLayer({
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
