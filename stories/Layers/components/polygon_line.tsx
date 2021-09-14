// @ts-ignore
import {
  Layers,
  Source,
  LineLayer,
  PointLayer,
  PolygonLayer,
  Scale,
  Scene,
  Zoom,
} from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class World extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const response = await fetch(
      'https://gw.alipayobjects.com/os/basement_prod/68dc6756-627b-4e9e-a5ba-e834f6ba48f8.json',
    );
    const response2 = await fetch(
      'https://gw.alipayobjects.com/os/basement_prod/13b3aa35-f7a1-4d21-acad-805a4553edb4.json',
    );
    const pointsData = await response2.json();
    const data = await response.json();
    const scene = new Scene({
      id: 'map',
      logoVisible: false,
      map: new Mapbox({
        style: 'blank',
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

    const dataSource = new Source(data);

    layer
      .source(dataSource)
      .color('name', [
        '#2E8AE6',
        '#69D1AB',
        '#DAF291',
        '#FFD591',
        '#FF7A45',
        '#CF1D49',
      ])
      .shape('fill')
      .select(true)
      .style({
        opacity: 0.8,
      });
    scene.addLayer(layer);

    const linelayer = new LineLayer({
      name: '01',
    });

    linelayer
      .source(dataSource)
      .color('#fff')
      .size(1)
      .shape('line')
      .select(true)
      .style({
        opacity: 1.0,
      });
    scene.addLayer(linelayer);
    const pointLayer = new PointLayer({
      name: '02',
    })
      .source(pointsData, {
        parser: {
          type: 'json',
          coordinates: 'center',
        },
      })
      .shape('name', 'text')
      .size(12)
      .active(true)
      .color('#fff')
      .style({
        opacity: 1,
        stroke: '#FFF',
        strokeWidth: 0,
      });
    scene.addLayer(pointLayer);
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
