import { ILayer, ISubLayerInitOptions } from '@antv/l7-core';
import { Tile } from '@antv/l7-utils';
import { ITileFactoryOptions } from '../interface';
import TileFactory from './base';
import VectorLayer from './vectorLayer';
import {
  registerLayers,
} from '../utils';

export default class TestTile extends TileFactory {
  public parentLayer: ILayer;

  constructor(option: ITileFactoryOptions) {
    super(option);
    this.parentLayer = option.parent;
  }

  public createTile(tile: Tile, initOptions: ISubLayerInitOptions) {
    const { sourceLayer } = initOptions;
    if (!sourceLayer) {
      return {
        layers: [],
        layerIDList: [],
      };
    }
    const vectorTileLayer = tile.data.layers[sourceLayer];
    const features = vectorTileLayer?.features;

    if (features.length === 0) {
      return {
        layers: [],
        layerIDList: [],
      };
    }
    
    const properties = features[0].properties;
    
    const text = new VectorLayer({ layerType: 'PointLayer', usage: 'basemap' })
    .source([properties], {
      parser: {
        type: 'json',
        x: 'textLng',
        y: 'textLat',
        cancelExtent: true,
      }
    })
    .shape('key', 'text')
    .style({
      size: 20,
      color: '#000',
      stroke: '#fff',
      strokeWidth: 2
    });

    const line = new VectorLayer({ layerType: 'LineLayer', usage: 'basemap' })
    .source({
      type: 'FeatureCollection',
      features: features,
    }, {
      parser: {
        type: 'geojson',
        cancelExtent: true,
      }
    })
    .shape('simple')
    .style({
      color: '#000'
    });

    // Tip: sign tile layer
    text.isTileLayer = true;
    line.isTileLayer = true;

    registerLayers(this.parentLayer, [line, text]);
    text.once('inited', () => {
      tile.layerLoad();
    })
    line.once('inited', () => {
      tile.layerLoad();
    })
    return {
      layers: [line, text],
      layerIDList: [line.id, text.id],
    };
  }
}
