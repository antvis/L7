import { ILayer, ISubLayerInitOptions } from '@antv/l7-core';
import { Tile } from '@antv/l7-utils';

export interface ITileFactoryOptions {
  parent: ILayer;
}

export interface ITileFactory {
  createTile(
    tile: Tile,
    initOptions: ISubLayerInitOptions,
  ): {
    layers: ILayer[];
    layerIDList: string[];
  };
}

export default class TileFactory implements ITileFactory {
  public parentLayer: ILayer;
  constructor(option: ITileFactoryOptions) {
    this.parentLayer = option.parent;
  }

  public createTile(tile: Tile, initOptions: ISubLayerInitOptions) {
    return {
      layers: [] as ILayer[],
      layerIDList: [] as string[],
    };
  }
}
