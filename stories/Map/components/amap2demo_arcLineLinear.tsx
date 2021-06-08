// @ts-ignore
import { LineLayer, Scene } from '@antv/l7';
import { GaodeMap, GaodeMapV1 } from '@antv/l7-maps';
import * as React from 'react';

export default class Amap2demo_arcLineLinear extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      // map: new GaodeMapV1({
      map: new GaodeMap({
        pitch: 40,
        center: [107.77791556935472, 35.443286920228644],
        zoom: 2.9142882493605033,
        viewMode: '3D',
        style: 'dark',
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      scene.addImage(
        '02',
        'https://gw.alipayobjects.com/zos/bmw-prod/0ca1668e-38c2-4010-8568-b57cb33839b9.svg',
      );

      let data = [
        {
          lng1: 75.76171875,
          lat1: 36.31512514748051,
          lng2: 46.23046874999999,
          lat2: 52.802761415419674,
        },
      ];
      // @ts-ignore
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
        .size(20)
        .shape('arc')
        .color('#f00')
        .style({
          // forward: false,
          lineTexture: true, // 开启线的贴图功能
          iconStep: 30, // 设置贴图纹理的间距
          // opacity: 0.5,
          // opacity: 0.2,
          // lineType: 'dash',
          // dashArray: [5, 5],
          // textureBlend: 'replace',
          // textureBlend: 'normal',
          sourceColor: "#f00",
          targetColor: "#0f0"
        })
        // .animate({
        //   duration: 50,
        //   interval: 0.3,
        //   trailLength: 0.1,
        // });
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
