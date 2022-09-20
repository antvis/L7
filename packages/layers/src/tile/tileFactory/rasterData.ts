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
      colorTexture,
      opacity,
      domain,
      clampHigh,
      clampLow,
      mask,
    } = initOptions;

    const rasterData = tile.data;
    if (!rasterData.data) {
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
      .source(rasterData.data, {
        parser: {
          type: 'raster',
          width: rasterData.width,
          height: rasterData.height,
          extent: tile.bboxPolygon.bbox,
        },
      })
      .style({
        colorTexture,
        opacity,
        domain,
        clampHigh,
        clampLow,
      });
    this.emitEvent([layer], false);

    registerLayers(this.parentLayer, [layer]);
    layer.once('modelLoaded', () => {
      tile.layerLoad();
    })
    return {
      layers: [layer],
      layerIDList: [layer.id],
    };
  }
}
