import { LineLayer, Scene } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class Amap2demo_lineStreet extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [120.19382669582967, 30.258134],
        pitch: 0,
        zoom: 16,
        style: 'dark',
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
            '00',
            'https://gw.alipayobjects.com/zos/bmw-prod/ce83fc30-701f-415b-9750-4b146f4b3dd6.svg',
          );
          scene.addImage(
            '01',
            'https://gw.alipayobjects.com/zos/basement_prod/30580bc9-506f-4438-8c1a-744e082054ec.svg',
          );
          scene.addImage(
            '02',
            'https://gw.alipayobjects.com/zos/bmw-prod/ce83fc30-701f-415b-9750-4b146f4b3dd6.svg',
          );
          // @ts-ignore
          const layer = new LineLayer({})
            .source(data)
            .size(5)
            .shape('line')
            .texture('00')
            .color('#25d8b7')
            .animate({
              interval: 1, // 间隔
              duration: 1, // 持续时间，延时
              trailLength: 2, // 流线长度
            })
            .style({
              // opacity: 0.5,
              // opacity: 0,
              lineTexture: true, // 开启线的贴图功能
              iconStep: 20, // 设置贴图纹理的间距
              // lineType: 'dash',
              // dashArray: [5, 5],
              // textureBlend: 'replace',
              // textureBlend: 'normal',

              borderWidth: 0.4, // 默认文 0，最大有效值为 0.5
              borderColor: '#fff', // 默认为 #ccc
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
