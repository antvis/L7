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
        // zoom: 13,
        // zoom: 10,
      }),
    });
    const data = [];
    for (let i = 0; i <= 10; i++) {
      for (let j = 0; j <= 10; j++) {
        data.push({ x: i * 1000, y: j * 1000 });
      }
    }
    // const data = [
    //   {x: 200, y: 200},
    //   {x: 1000, y: 1000}
    // ]
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

    const imagelayer = new ImageLayer({}).source(
      'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*KrvXTrIAnWEAAAAAAAAAAAAAARQnAQ',
      {
        parser: {
          type: 'image',
          // extent: [
          //   100, 100,
          //   200, 500
          // ],
          extent: [4000, 3500, 6000, 6500],
          // extent: [
          //   -172.8, -84.38946720916285,
          //   -144, -80.73800862798672
          // ],
        },
      },
    );

    scene.on('loaded', () => {
      scene.addLayer(layer);
      scene.addLayer(imagelayer);
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
