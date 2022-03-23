// @ts-nocheck
import { Scene, PolygonLayer, PointLayer, Map, ImageLayer } from '@antv/l7';
import * as React from 'react';

export default class Demo extends React.Component {
  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Map({
        center: [5000, 5000],
        pitch: 0,
        zoom: 2,
        version: 'SIMPLE',
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
      .active(true)
      .color('#f00');

    const imagelayer = new ImageLayer({}).source(
      'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*KrvXTrIAnWEAAAAAAAAAAAAAARQnAQ',
      {
        parser: {
          type: 'image',
          extent: [4000, 3500, 6000, 6500],
        },
      },
    );

    const polygonData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            testOpacity: 0.4,
          },
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [6000, 6000],
                  [6000, 7000],
                  [7000, 7000],
                  [7000, 6000],
                  [6000, 6000],
                ],
                [
                  [6300, 6300],
                  [6300, 6700],
                  [6700, 6700],
                  [6700, 6300],
                  [6300, 6300],
                ],
              ],
              [
                [
                  [5000, 5000],
                  [5000, 6000],
                  [6000, 6000],
                  [6000, 5000],
                  [5000, 5000],
                ],
              ],
            ],
          },
        },
      ],
    };

    const polygonLayer = new PolygonLayer()
      .source(polygonData)
      .shape('fill')
      .color('#f00')
      .style({
        opacity: 0.6,
      })
      .active(true);

    scene.on('loaded', () => {
      scene.addLayer(layer);
      scene.addLayer(imagelayer);
      scene.addLayer(polygonLayer);
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
