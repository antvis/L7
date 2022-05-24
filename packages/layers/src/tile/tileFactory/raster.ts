import { ILayer, ISubLayerInitOptions } from '@antv/l7-core';
import { Tile, TilesetManager } from '@antv/l7-utils';
import ImageLayer from '../../image';
import { registerLayers } from '../utils';
import TileFactory, { ITileFactoryOptions } from './base';

export default class RasterTile extends TileFactory {
  public parentLayer: ILayer;
  constructor(option: ITileFactoryOptions) {
    super(option);
    this.parentLayer = option.parent;
  }

  public createTile(tile: Tile, initOptions: ISubLayerInitOptions) {
    const { zIndex, opacity, mask = false } = initOptions;
    const layer = new ImageLayer({
      visible: tile.isVisible,
      zIndex,
      mask
    })
      .source(tile.data, {
        parser: {
          type: 'image',
          extent: tile.bounds,
        },
      })
      .style({
        opacity,
      });
    registerLayers(this.parentLayer, [layer]);
    return {
      layers: [layer],
      layerIDList: [layer.id],
    };
  }
}
