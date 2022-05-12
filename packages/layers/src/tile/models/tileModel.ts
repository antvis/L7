import { IModelUniform } from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import TileLayer from '../tileLayer';
export default class RasterTileModel extends BaseModel {
  public getUninforms(): IModelUniform {
    return {};
  }

  public initModels() {
    if (this.layer.getSource().data.isTile) {
      this.layer.tileLayer = new TileLayer({
        parent: this.layer,
        rendererService: this.rendererService,
        mapService: this.mapService,
        layerService: this.layerService,
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
