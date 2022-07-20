// @ts-nocheck
// @ts-ignore
import { Scene, Source } from '@antv/l7';
import { PointLayer, EarthLayer } from '@antv/l7-layers';
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

    const pointlayer = new PointLayer({ layerType: 'earthExtrude' })
      .source(
        [
          { lng: 121.61865234375, lat: 25.29437116258816 },
          { lng: 121.058349609375, lat: 25.015928763367857 },
          { lng: 120.7177734375, lat: 24.587090339209634 },
          { lng: 120.28930664062499, lat: 23.936054914599815 },
          { lng: 120.12451171875, lat: 23.553916518321625 },
          { lng: 121.124267578125, lat: 22.806567100271522 },
          { lng: 121.56372070312499, lat: 23.915970370510227 },
          { lng: 121.88232421875, lat: 24.557116164309626 },
          { lng: 121.95922851562501, lat: 25.075648445630527 },
          { lng: 109.97314453125, lat: 20.076570104545173 },
          { lng: 108.896484375, lat: 19.663280219987662 },
          { lng: 108.61083984375, lat: 18.979025953255267 },
          { lng: 108.80859375, lat: 18.47960905583197 },
          { lng: 109.599609375, lat: 18.35452552912664 },
          { lng: 110.32470703125, lat: 18.771115062337024 },
          { lng: 111.005859375, lat: 19.78738018198621 },
          { lng: 110, lat: 30 },
        ],
        {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        },
      )
      .shape('cylinder')
      .color('#f00')
      .size([1, 1, 10])
      .active(true);
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
      scene.addLayer(pointlayer);

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
