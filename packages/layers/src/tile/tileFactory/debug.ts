import { ILayer, ISubLayerInitOptions } from '@antv/l7-core';
import { Tile } from '@antv/l7-utils';
import { ITileFactoryOptions } from '../interface';
import TileFactory from './base';
import VectorLayer from './layers/vectorLayer';

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
      };
    }
    const vectorTileLayer = tile.data.layers[sourceLayer];
    const features = vectorTileLayer?.features;
    if (features.length === 0) {
      return {
        layers: [],
      };
    }
    
    const properties = features[0].properties;
    
    const text = new VectorLayer({
       layerType: 'PointLayer',
        minZoom: tile.z -1,
        maxZoom: tile.z +1,
        usage: 'basemap', 
        needListen: false 
      })
    .source([properties], {
      parser: {
        type: 'json',
        x: 'textLng',
        y: 'textLat',
        cancelExtent: true,
      }
    })
    .shape(`${tile.x}/${tile.y}/${tile.z}`)
    .style({
      size: 20,
      color: '#000',
      stroke: '#fff',
      strokeWidth: 2
    });

    const line = new VectorLayer({ layerType: 'LineLayer', usage: 'basemap', needListen: false })
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
      color: '#f00'
    });

    return {
      layers: [line,text],
    };
  }
}
