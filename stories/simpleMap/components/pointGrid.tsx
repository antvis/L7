// @ts-nocheck
import { Scene, PolygonLayer, PointLayer, Map } from '@antv/l7-mini';
import * as React from 'react';

export default class Demo extends React.Component {
  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Map({
        center: [500, 500],
        pitch: 0,
        zoom: 0,
        version: 'SIMPLE',
        mapSize: 1000,
        // zoom: 13,
        // zoom: 10,
      }),
    });
    // scene.setBgColor('#000');
    const data = [];
    for (let i = 0; i <= 10; i++) {
      for (let j = 0; j <= 10; j++) {
        data.push({ x: i * 100, y: j * 100 });
      }
    }
    const layer = new PointLayer()
      .source(data, {
        parser: {
          type: 'json',
          x: 'x',
          y: 'y',
        },
      })
      .shape('circle')
      .size(20)
      .color('#f00');

    scene.on('loaded', () => {
      scene.addLayer(layer);
    });
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
      ></div>
    );
  }
}
