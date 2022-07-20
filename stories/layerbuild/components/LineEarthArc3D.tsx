// @ts-nocheck
// @ts-ignore
import { Scene, Source } from '@antv/l7';
import { LineLayer, EarthLayer } from '@antv/l7-layers';
import { GaodeMap, Earth } from '@antv/l7-maps';
import * as React from 'react';

export default class Demo extends React.Component {
  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Earth({
        center: [120, 30],
        pitch: 0,
        zoom: 3,
      }),
    });

    const layer = new LineLayer()
    .source({
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "LineString",
            "coordinates": [
              [
                95.625,
                38.47939467327645
              ],
              [
                115.48828125000001,
                28.92163128242129
              ]
            ]
          }
        }
      ]
    })
    .shape('earthArc3d')
    .color('#f00')
    .size(2)
    const earthlayer = new EarthLayer()
      .source(
        'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*3-3NSpqRqUoAAAAAAAAAAAAAARQnAQ',
        {
          parser: {
            type: 'image',
          },
        },
      )
      .shape('base')
      .style({
        globelOtions: {
          ambientRatio: 0.6, // 环境光
          diffuseRatio: 0.4, // 漫反射
          specularRatio: 0.1, // 高光反射
          earthTime: 0.1,
        },
      })
      .animate(true);

    const atomLayer = new EarthLayer()
      .color('#2E8AE6')
      .shape('atomSphere')
      .style({
        opacity: 1,
      });

    const bloomLayer = new EarthLayer().color('#fff').shape('bloomSphere');

    scene.on('loaded', () => {
      scene.addLayer(earthlayer);
      scene.addLayer(layer);

      scene.addLayer(atomLayer);
      scene.addLayer(bloomLayer);

      earthlayer.setEarthTime(4.0);
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
