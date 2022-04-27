import { IModelUniform } from '@antv/l7-core';
import { TilesetManager } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';

export default class RasterTileModel extends BaseModel {
  // 瓦片数据管理器
  public tilesetManager: TilesetManager | undefined;

  public getUninforms(): IModelUniform {
    return {};
  }

  public initModels() {
    const source = this.layer.getSource();
    this.tilesetManager = source.data.tilesetManager as TilesetManager;

    const bounds = this.mapService.getBounds();
    const latLonBounds: [number, number, number, number] = [
      bounds[0][0],
      bounds[0][1],
      bounds[1][0],
      bounds[1][1],
    ];
    const zoom = this.mapService.getZoom();
    this.tilesetManager.update(zoom, latLonBounds);

    // console.log('tilesetManager: ', this.tilesetManager);

    return this.buildModels();
  }

  public buildModels() {
    return [];
  }

  public clearModels() {
    // removeTiles
  }

  protected registerBuiltinAttributes() {
    //
  }
}
