import { ILayer, ISubLayerInitOptions } from '@antv/l7-core';
import { Tile } from '@antv/l7-utils';
import LineLayer from '../../line';
import MaskLayer from '../../mask';
import PointLayer from '../../point';
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
    const { zIndex, opacity, layerName, color } = initOptions;

    const features = tile.data.layers[layerName]?.features;
    if (!features || !layerName) {
      console.warn('Layer Data not exist! Please check Layer Name & Data!');
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
      .source(
        {
          type: 'FeatureCollection',
          features,
        },
        {
          parser: {
            type: 'mvtgeojson',
            featureId: 'COLOR',
          },
        },
      )
      .shape('fill')
      .style({
        opacity,
      });

    this.setColor(layer, color);

    // const layer = new LineLayer({
    //   visible: tile.isVisible,
    //   zIndex,
    //   mask: true,
    // })
    //   .source({
    //     type: 'FeatureCollection',
    //     features,
    //   }, {
    //     parser: {
    //       type: 'mvtgeojson'
    //     }
    //   })
    //   .shape('line')
    //   .size(2)
    //   .color('#f00')
    //   .style({
    //     opacity,
    //   });

    // const layer = new LineLayer({
    //   visible: tile.isVisible,
    //   zIndex,
    //   mask: true,
    // })
    //   .source({
    //     type: 'FeatureCollection',
    //     features,
    //   })
    //   .shape('line')
    //   .size(2)
    //   .color('#f00')
    //   .active(true)
    //   .style({
    //     opacity,
    //   });

    // function getRandomColor() {
    //   return'#' + Math.floor(Math.random() * 10) +
    //   '' + Math.floor(Math.random() * 10) +
    //   '' + Math.floor(Math.random() * 10)
    // }

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
