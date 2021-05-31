// @ts-ignore
import { LineLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class Amap2demo_arcLineTex extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

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
      scene.addImage(
        '02',
        'https://gw.alipayobjects.com/zos/bmw-prod/ce83fc30-701f-415b-9750-4b146f4b3dd6.svg',
      );

      let data = [
        // {
        //   lng1: 91.111891,
        //   lat1: 40.662557,
        //   lng2: 120.342625,
        //   lat2: 37.373799,
        // },
        // {
        //   lng1: 116.98242187499999,
        //   lat1: 43.004647127794435,
        //   lng2: 105.64453124999999,
        //   lat2: 28.998531814051795,
        // },
        {
          lng1: 75.76171875,
          lat1: 36.31512514748051,
          lng2: 46.23046874999999,
          lat2: 52.802761415419674,
        },
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
        // .texture('02')
        .color('#8C1EB2')
        .style({
          forward: false,
          // lineTexture: true, // 开启线的贴图功能
          // iconStep: 100, // 设置贴图纹理的间距
        })
        .animate(true)
      scene.addLayer(layer);

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
