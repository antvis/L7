import { ILayer, ISubLayerInitOptions } from '@antv/l7-core';
import { Tile } from '@antv/l7-utils';
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
    const {
      opacity,
      domain,
      clampHigh,
      clampLow,
      rampColors,
      rampColorsData,
      mask,
    } = initOptions;

    const rasterdata = tile.data;
    if (!rasterdata.data) {
      console.warn('raster data not exist!');
      return {
        layers: [],
        layerIDList: [],
      };
    }
    const layer = new RasterDataLayer({
      visible: tile.isVisible,
      mask,
    })
      .source(rasterdata.data, {
        parser: {
          type: 'raster',
          width: rasterdata.width,
          height: rasterdata.height,
          extent: tile.bboxPolygon.bbox,
        },
      })
      .style({
        opacity,
        domain,
        clampHigh,
        clampLow,
        rampColors,
        rampColorsData,
      });
    this.emitEvent([layer], false);

    registerLayers(this.parentLayer, [layer]);

    return {
      layers: [layer],
      layerIDList: [layer.id],
    };
  }
}
