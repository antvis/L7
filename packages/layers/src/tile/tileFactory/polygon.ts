import { ILayer, ISubLayerInitOptions } from '@antv/l7-core';
import { Tile } from '@antv/l7-utils';
import MaskLayer from '../../mask';
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
    const { zIndex, opacity, layerName, color, featureId } = initOptions;
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
      mask: true,
      layerType: 'PolygonLayer',
    });
    this.emitEvent([layer]);
    layer.type = 'PolygonLayer';
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
      .shape('tile')
      .select(true)
      .style({
        opacity,
        tileOrigin: l7TileOrigin,
        coord: l7TileCoord,
      });
    this.setColor(layer, color);

    const mask = new MaskLayer()
      .source({
        type: 'FeatureCollection',
        features: [tile.bboxPolygon],
      })
      .shape('fill');

    registerLayers(this.parentLayer, [layer, mask]);

    layer.addMaskLayer(mask);

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
