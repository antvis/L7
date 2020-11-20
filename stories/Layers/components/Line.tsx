import { LineLayer, PolygonLayer, Scene } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class LineDemo extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const response = await fetch(
      'https://gw-office.alipayobjects.com/bmw-prod/037b4240-f9ee-4dd8-b90c-178af4e4c9b8.json',
    );
    const data = await response.json();
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [120, 30.7128],
        zoom: 11.5,
        style: 'light',
      }),
    });
    const polygonLayer = new PolygonLayer({
      autoFit: true,
    })
      .source(data)
      .size(1)
      .shape('fill')
      .color('rgb(254,153,41)')
      .style({
        opacity: 1.0,
      });
    const lineLayer = new PolygonLayer({
      autoFit: true,
    })
      .source(data)
      .size(1)
      .shape('line')
      .color('#f00')
      .style({
        opacity: 0.5,
      });

    scene.addLayer(polygonLayer);
    scene.addLayer(lineLayer);
    this.scene = scene;
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
