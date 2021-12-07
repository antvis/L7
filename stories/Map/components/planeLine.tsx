import { LineLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class PlaneLine extends React.Component {
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
        center: [110, 35.443],
        zoom: 5,
        viewMode: '3D',
        style: 'dark',
      }),
    });
    this.scene = scene;
    scene.addImage(
      'plane',
      'https://gw.alipayobjects.com/zos/bmw-prod/0ca1668e-38c2-4010-8568-b57cb33839b9.svg',
    );
    // 106.6400729259405 29.72018042111331 重庆
    // 116.5883553580003 40.07680509701226 北京
    let originData = {
      lng1: 106.6400729259405,
      lat1: 29.72018042111331,
      lng2: 116.5883553580003,
      lat2: 40.07680509701226,
    };
    scene.on('loaded', () => {
      let data = [];
      for (let i = 0; i < 11; i++) {
        data.push({
          thetaOffset: -0.5 + i * 0.1,
          ...originData,
        });
      }

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
        .size(1)
        .shape('arc')
        .color('#ccc')
        .style({
          opacity: 1,
          thetaOffset: 'thetaOffset',
        });
      scene.addLayer(layer);

      const layer2 = new LineLayer({
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
        .size(15)
        .texture('plane')
        .shape('arc')
        .color('#8C1EB2')
        .style({
          opacity: 1,
          thetaOffset: 'thetaOffset',
          lineTexture: true, // 开启线的贴图功能
          iconStep: 20, // 设置贴图纹理的间距
          textureBlend: 'replace',
        })
        .animate({
          duration: 0.2,
          interval: 0.5,
          trailLength: 1,
        });
      scene.addLayer(layer2);
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
