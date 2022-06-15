import { ILayer, ISubLayerInitOptions } from '@antv/l7-core';
import Source from '@antv/l7-source';
import { Tile, TilesetManager } from '@antv/l7-utils';
import ImageLayer from '../../image';
import { ITileFactoryOptions } from '../interface';
import TileFactory from './base';

export default class RasterTile extends TileFactory {
  public parentLayer: ILayer;
  constructor(option: ITileFactoryOptions) {
    super(option);
    this.parentLayer = option.parent;
  }

  public createTile(tile: Tile, initOptions: ISubLayerInitOptions) {
    const source = new Source(tile.data, {
      parser: {
        type: 'image',
        extent: tile.bounds,
      },
    });

    const layer = this.createLayer({
      L7Layer: ImageLayer,
      tile,
      initOptions,
      source,
    });

    return {
      layers: [layer],
      layerIDList: [layer.id],
    };
  }
}
