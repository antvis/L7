import { ILayer, ISubLayerInitOptions } from '@antv/l7-core';
import { Tile } from '@antv/l7-source';
import { ITileFactoryOptions } from '../interface';
import { registerLayers } from '../utils';
import TileFactory from './base';
import RasterDataLayer from './rasterDataLayer';

export default class RasterTiffTile extends TileFactory {
  public parentLayer: ILayer;

  constructor(option: ITileFactoryOptions) {
    super(option);
    this.parentLayer = option.parent;
  }

  public createTile(tile: Tile, initOptions: ISubLayerInitOptions) {
    const { opacity, domain, clampHigh, clampLow, rampColors } = initOptions;
    const tiffdata = tile.data;
    const layer = new RasterDataLayer({
      visible: tile.isVisible,
    })
      .source(tiffdata.data, {
        parser: {
          type: 'raster',
          width: tiffdata.width,
          height: tiffdata.height,
          extent: tile.bboxPolygon.bbox,
        },
      })
      .style({
        opacity,
        domain,
        clampHigh,
        clampLow,
        rampColors,
      });
    this.emitEvent([layer], false, tile);

    registerLayers(this.parentLayer, [layer]);

    return {
      layers: [layer],
      layerIDList: [layer.id],
    };
  }
}
