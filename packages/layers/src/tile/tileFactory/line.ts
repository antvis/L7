import { ILayer, ISubLayerInitOptions } from '@antv/l7-core';
import Source from '@antv/l7-source';
import { Tile } from '@antv/l7-utils';
import { ITileFactoryOptions, ITileStyles } from '../interface';
import TileFactory from './base';
export default class VectorPolygonTile extends TileFactory {
  public parentLayer: ILayer;

  constructor(option: ITileFactoryOptions) {
    super(option);
    this.parentLayer = option.parent;
  }

  public createTile(tile: Tile, initOptions: ISubLayerInitOptions) {
    const { features, vectorTileLayer, source } = this.getFeatureData(
      tile,
      initOptions,
    );
    if (features.length === 0) {
      return {
        layers: [],
        layerIDList: [],
      };
    }

    const layer = this.createLayer({
      tile,
      initOptions,
      vectorTileLayer,
      source: source as Source,
    });

    return {
      layers: [layer],
      layerIDList: [layer.id],
    };
  }
}
