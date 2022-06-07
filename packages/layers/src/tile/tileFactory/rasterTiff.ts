import { ILayer, ISubLayerInitOptions } from '@antv/l7-core';
import Source, { Tile } from '@antv/l7-source';
import { ITileFactoryOptions, ITileStyles } from '../interface';
import { registerLayers } from '../utils';
import TileFactory from './base';
import RasterTiffLayer from './rasterTiffLayer';

export default class RasterTiffTile extends TileFactory {
  public parentLayer: ILayer;

  constructor(option: ITileFactoryOptions) {
    super(option);
    this.parentLayer = option.parent;
  }

  public createTile(tile: Tile, initOptions: ISubLayerInitOptions) {
    const { opacity } = initOptions;
    const tiffdata = tile.data;
    const mindata = -0;
    const maxdata = 500;

    const layer = new RasterTiffLayer({
      visible: tile.isVisible,
    })
      .source(tiffdata.data, {
        parser: {
          type: 'raster',
          width: tiffdata.width,
          height: tiffdata.height,
          // extent: [0, -20, 180, 60],
          extent: tile.bboxPolygon.bbox,
        },
      })
      .style({
        opacity,
        domain: [mindata, maxdata],
        clampLow: true,
        rampColors: {
          colors: [
            'rgb(166,97,26)',
            'rgb(223,194,125)',
            'rgb(245,245,245)',
            'rgb(128,205,193)',
            'rgb(1,133,113)',
          ],
          positions: [0, 0.25, 0.5, 0.75, 1.0],
        },
      });

    registerLayers(this.parentLayer, [layer]);

    return {
      layers: [layer],
      layerIDList: [layer.id],
    };
  }
}
