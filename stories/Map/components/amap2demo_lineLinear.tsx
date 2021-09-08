import { LineLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class Amap2demo_lineLinear extends React.Component {
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
        zoom: 6,
        viewMode: '3D',
      }),
    });
    this.scene = scene;
    const geoData = {
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
                [113.8623046875, 30.031055426540206],
                [116.3232421875, 30.031055426540206],
                [116.3232421875, 31.090574094954192],
                [113.8623046875, 31.090574094954192],
                [113.8623046875, 30.031055426540206],
              ],
              [
                [117.26806640625, 32.13840869677249],
                [118.36669921875, 32.13840869677249],
                [118.36669921875, 32.47269502206151],
                [117.26806640625, 32.47269502206151],
                [117.26806640625, 32.13840869677249],
              ],
            ],
          },
        },
      ],
    };

    scene.on('loaded', () => {
      fetch(
        // 'https://gw.alipayobjects.com/os/basement_prod/40ef2173-df66-4154-a8c0-785e93a5f18e.json',
        'https://gw.alipayobjects.com/os/bmw-prod/459591a6-8aa5-4ce7-87a1-0e1e7bce3e60.json',
      )
        .then((res) => res.json())
        .then((data) => {
          // @ts-ignore
          const layer = new LineLayer({})
            // .source(data)
            .source(geoData)
            .size(5)
            .shape('line')
            .color('#25d8b7')
            // .animate({
            //   interval: 1, // 间隔
            //   duration: 1, // 持续时间，延时
            //   trailLength: 2, // 流线长度
            // })
            .style({
              opacity: 'testOpacity',
              // opacity: 0,
              // lineTexture: true, // 开启线的贴图功能
              // iconStep: 50, // 设置贴图纹理的间距
              // lineType: 'dash',
              // dashArray: [5, 5],
              // textureBlend: 'replace',
              // textureBlend: 'normal',
              sourceColor: '#f00',
              targetColor: '#0f0',
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
