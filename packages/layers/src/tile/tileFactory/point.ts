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
    const { zIndex, opacity, layerName, color, featureId } = initOptions;

    const features = tile.data.layers[layerName]?.features;
    if (!features || !layerName) {
      console.warn('Layer Data not exist! Please check Layer Name & Data!');
      return {
        layers: [],
        layerIDList: [],
      };
    }

    const layer = new VectorLayer({
      visible: tile.isVisible,
      zIndex,
      layerType: 'PointLayer',
    });
    layer.type = 'PointLayer';
    layer
      .source(
        {
          type: 'FeatureCollection',
          features,
        },
        {
          parser: {
            type: 'mvtgeojson',
            featureId,
          },
        },
      )
      .shape('circle')
      .size(10)
      .style({
        opacity,
      });

    this.setColor(layer, color);

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
