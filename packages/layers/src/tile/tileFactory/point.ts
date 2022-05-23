import { ILayer, ISubLayerInitOptions } from '@antv/l7-core';
import { Tile } from '@antv/l7-utils';
import { registerLayers } from '../utils';
import TileFactory, { ITileFactoryOptions, ITileStyles } from './base';
import VectorLayer from './vectorLayer';

export default class VectorPolygonTile extends TileFactory {
  public parentLayer: ILayer;
  private layers: ILayer[];
  constructor(option: ITileFactoryOptions) {
    super(option);
    this.parentLayer = option.parent;
  }

  public createTile(tile: Tile, initOptions: ISubLayerInitOptions) {
    const { zIndex, opacity, layerName, color, size, featureId } = initOptions;
    const vectorTileLayer = tile.data.layers[layerName];
    const features = vectorTileLayer?.features;
    if (!(Array.isArray(features) && features.length > 0)) {
      return {
        layers: [],
        layerIDList: [],
      };
    }
    const { l7TileOrigin, l7TileCoord } = vectorTileLayer;
    const layer = new VectorLayer({
      visible: tile.isVisible,
      zIndex,
      layerType: 'PointLayer',
    });
    this.emitEvent([layer]);
    layer.type = 'PointLayer';
    layer
      .source(
        {
          type: 'FeatureCollection',
          features,
        },
        {
          parser: {
            type: 'geojson',
            featureId,
          },
        },
      )
      .shape('circle')
      .select(true)
      .style({
        opacity,
        tileOrigin: l7TileOrigin,
        coord: l7TileCoord,
      });

    this.setColor(layer, color);
    this.setSize(layer, size);

    registerLayers(this.parentLayer, [layer]);

    this.layers = [layer];

    return {
      layers: [layer],
      layerIDList: [layer.id],
    };
  }

  public updateStyle(styles: ITileStyles) {
    const { opacity, zIndex } = styles;
    this.layers.map((layer) => {
      layer.style({
        opacity,
        zIndex,
      });
    });
    return '';
  }
}
