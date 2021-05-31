// @ts-ignore
import { LineLayer, Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class Amap2demo_road2 extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [120.165, 30.25],
        pitch: 50,
        zoom: 16.8,
        viewMode: '3D',
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/40ef2173-df66-4154-a8c0-785e93a5f18e.json',
      )
        .then((res) => res.json())
        .then((data) => {
          scene.addImage(
            '02',
            'https://gw.alipayobjects.com/zos/bmw-prod/ce83fc30-701f-415b-9750-4b146f4b3dd6.svg',
          );

          const layer = new LineLayer({})
            .source(data)
            .size(5)
            .shape('line')
            .texture('02')
            // .color('#ccc')
            .color('rgb(20, 180, 90)')
            // .animate({
            //   interval: 1, // 间隔
            //   duration: 1, // 持续时间，延时
            //   trailLength: 2, // 流线长度
            // })
            .style({
              // opacity: 0.5,
              lineTexture: true, // 开启线的贴图功能
              iconStep: 80, // 设置贴图纹理的间距
            });
          scene.addLayer(layer);
        });
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
