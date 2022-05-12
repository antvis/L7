import { ILayer, ISubLayerInitOptions } from '@antv/l7-core';
import { Tile } from '@antv/l7-utils';
import MaskLayer from '../../mask';
import PolygonLayer from '../../polygon';
import { registerLayers } from '../utils';
import TileFactory, { ITileFactoryOptions, ITileStyles } from './base';

export default class VectorPolygonTile extends TileFactory {
  public parentLayer: ILayer;
  private layers: ILayer[];
  constructor(option: ITileFactoryOptions) {
    super(option);
    this.parentLayer = option.parent;
  }

  public createTile(tile: Tile, initOptions: ISubLayerInitOptions) {
    const { zIndex, opacity, layerName } = initOptions;
    if (!layerName) {
      return {
        layers: [],
        layerIDList: [],
      };
    }
    const features = tile.data.layers[layerName]?.features;
    if (!features || !layerName) {
      return {
        layers: [],
        layerIDList: [],
      };
    }

    const layer = new PolygonLayer({
      visible: tile.isVisible,
      zIndex,
      mask: true,
    })
      .source({
        type: 'FeatureCollection',
        features,
      })
      .shape('fill')
      .color('#f00')
      .active(true)
      .style({
        opacity,
      });

    const mask = new MaskLayer()
      .source({
        type: 'FeatureCollection',
        features: [tile.bboxPolygon],
      })
      .shape('fill')
      .color('#000')
      .style({
        opacity: 0,
      });

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
  }
}
