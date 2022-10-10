// @ts-nocheck
import { Scene, LineLayer, PointLayer, Map } from '@antv/l7';
import * as React from 'react';

export default class Demo extends React.Component {
  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Map({
        center: [10000, 10000],
        pitch: 0,
        zoom: 0,
        version: 'SIMPLE',
        mapSize: 20000,
      }),
    });
    const data = [];
    for (let i = 0; i <= 10; i++) {
      for (let j = 0; j <= 10; j++) {
        data.push({ x: i * 1000, y: j * 1000 });
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

    const lineData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            testOpacity: 0.8,
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [6000, 6000],
                [6000, 7000],
                [7000, 7000],
                [7000, 6000],
              ],
            ],
          },
        },
      ],
    };

    const linelayer = new LineLayer()
      .source(lineData)
      .shape('line')
      .size(10)
      .color('#0f0')
      .active(true);

    const linelayer2 = new LineLayer()
      .source([{ x: 5000, y: 5000, x2: 5000, y2: 4000 }], {
        parser: {
          type: 'json',
          x: 'x',
          y: 'y',
          x1: 'x2',
          y1: 'y2',
        },
      })
      .shape('line')
      .color('#0ff')
      .size(5)
      .active(true);

    scene.on('loaded', () => {
      scene.addLayer(layer);
      scene.addLayer(linelayer);
      scene.addLayer(linelayer2);
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
