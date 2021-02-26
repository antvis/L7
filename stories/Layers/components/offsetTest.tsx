// @ts-ignore
import {
  Layers,
  LineLayer,
  PointLayer,
  PolygonLayer,
  Scale,
  Scene,
  Zoom,
} from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';
import data from '../data/hexagon';

export default class World extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      logoVisible: false,
      map: new GaodeMap({
        offsetZoom: 5,
        style: 'normal',
        center: [110.19382669582967, 30.258134],
        pitch: 0,
        zoom: 5,
      }),
    });
    this.scene = scene;
    const layer = new PolygonLayer({
      name: '01',
      autoFit: true,
    });

    const layer2 = new PolygonLayer({
      name: '01',
      autoFit: true,
    });

    layer
      .source(data.geo_data)
      .color('#CF1D49')
      .shape('line')
      .size(1)
      .select(true)
      .style({
        opacity: 0.8,
      });
    layer2
      .source(data.geo_data)
      .color('#CF1')
      .shape('fill')
      .select(true)
      .style({
        opacity: 0.3,
      });
    scene.addLayer(layer);
    scene.addLayer(layer2);
  }

  public render() {
    return (
      <div
        id="map"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
    );
  }
}
