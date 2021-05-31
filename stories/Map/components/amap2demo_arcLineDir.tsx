// @ts-ignore
import { LineLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class Amap2demo_arcLineDir extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  // [116.478935,39.997761],
  // [116.478939,39.997825],
  // [116.478912,39.998549],
  // [116.478912,39.998549],
  // [116.478998,39.998555],
  // [116.478998,39.998555],
  // [116.479282,39.99856],
  // [116.479658,39.998528],
  // [116.480151,39.998453],
  // [116.480784,39.998302],
  // [116.480784,39.998302],
  // [116.481149,39.998184],
  // [116.481573,39.997997],
  // [116.481863,39.997846],
  // [116.482072,39.997718],
  // [116.482362,39.997718],
  // [116.483633,39.998935],
  // [116.48367,39.998968],
  // [116.484648,39.999861]

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        pitch: 40,
        center: [107.77791556935472, 35.443286920228644],
        zoom: 2.9142882493605033,
        viewMode: '3D',
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      let data = [
        {
          lng1: 91.111891,
          lat1: 40.662557,
          lng2: 120.342625,
          lat2: 37.373799,
        },
        {
          lng1: 116.98242187499999,
          lat1: 43.004647127794435,
          lng2: 105.64453124999999,
          lat2: 28.998531814051795,
        },
        {
          lng1: 75.76171875,
          lat1: 36.31512514748051,
          lng2: 46.23046874999999,
          lat2: 52.802761415419674,
        },
      ];
      let data2 = [
        {
          lng1: 88.59374999999999,
          lat1: 52.53627304145948,
          lng2: 119.794921875,
          lat2: 46.07323062540835,
        },
        // {
        //   lng2: 88.59374999999999,
        //   lat2: 52.53627304145948,
        //   lng1: 119.794921875,
        //   lat1: 46.07323062540835
        // }
      ];

      const layer = new LineLayer({
        blend: 'normal',
      })
        .source(data, {
          parser: {
            type: 'json',
            x: 'lng1',
            y: 'lat1',
            x1: 'lng2',
            y1: 'lat2',
          },
        })
        .size(10)
        .shape('arc')
        .color('#8C1EB2')
        .style({
          forward: false,
        });
      scene.addLayer(layer);

      const layer2 = new LineLayer({ blend: 'normal' })
        .source(data, {
          parser: {
            type: 'json',
            x: 'lng1',
            y: 'lat1',
            x1: 'lng2',
            y1: 'lat2',
          },
        })
        .size(10)
        .shape('arc')
        .color('#8C1EB2');
      scene.addLayer(layer2);

      const layer3 = new LineLayer({ blend: 'normal' })
        .source(data2, {
          parser: {
            type: 'json',
            x: 'lng1',
            y: 'lat1',
            x1: 'lng2',
            y1: 'lat2',
          },
        })
        .size(10)
        .shape('arc')
        .color('#8C1EB2')
        .animate(true);
      scene.addLayer(layer3);

      const layer4 = new LineLayer({ blend: 'normal' })
        .source(data2, {
          parser: {
            type: 'json',
            x: 'lng1',
            y: 'lat1',
            x1: 'lng2',
            y1: 'lat2',
          },
        })
        .size(10)
        .shape('arc')
        .color('#8C1EB2')
        .style({
          forward: false,
        })
        .animate({
          duration: 4,
          interval: 0.3,
          trailLength: 0.5,
        });
      scene.addLayer(layer4);
    });
  }

  public render() {
    return (
      <>
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
      </>
    );
  }
}
