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
    
    const text = new VectorLayer({ layerType: 'PointLayer' })
    .source([properties], {
      parser: {
        type: 'json',
        x: 'textLng',
        y: 'textLat'
      }
    })
    // .source({
    //   "type": "FeatureCollection",
    //   "properties": {
    //     "key": 'key'
    //   },
    //   "geometry": {
    //     "type": "Point",
    //     "coordinates": [properties.textLng, properties.textLat]
    //   }
    // })
    .shape('key', 'text')
    // .shape('circle')
    .size(10)
    .color('#f00')
    .style({
      // textAnchor: 'left'
    })

    const line = new VectorLayer({ layerType: 'LineLayer' })
    .source({
      type: 'FeatureCollection',
      features: features,
    })
    .shape('simple')
    .color('#f00')

    registerLayers(this.parentLayer, [line, text]);
    // registerLayers(this.parentLayer, [line]);
    // registerLayers(this.parentLayer, [text]);

    return {
      layers: [line, text],
      layerIDList: [line.id, text.id],
    };
    // return {
    //   layers: [text, text],
    //   layerIDList: [text.id, text.id],
    // };
    // return {
    //   layers: [line],
    //   layerIDList: [line.id],
    // };
  }
}
