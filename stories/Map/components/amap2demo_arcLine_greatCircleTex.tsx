import { LineLayer, Scene } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class Amap2demo_arcLine_greatCircle extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        pitch: 0,
        center: [107.77791556935472, 35.443286920228644],
        zoom: 2.9142882493605033,
        viewMode: '3D',
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      scene.addImage(
        '00',
        'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg',
        // "https://gw-office.alipayobjects.com/bmw-prod/ae2a8580-da3d-43ff-add4-ae9c1bfc75bb.svg"
      );
      scene.addImage(
        '01',
        'https://gw.alipayobjects.com/zos/basement_prod/30580bc9-506f-4438-8c1a-744e082054ec.svg',
      );
      scene.addImage(
        '02',
        'https://gw.alipayobjects.com/zos/bmw-prod/0ca1668e-38c2-4010-8568-b57cb33839b9.svg',
      );

      const layer = new LineLayer({ blend: 'normal' })
        .source(
          [
            {
              lng1: 75.9375,
              lat1: 37.71859032558816,
              lng2: 123.3984375,
              lat2: 39.639537564366684,
              testOpacity: 0.5,
            },
          ],
          {
            parser: {
              type: 'json',
              x: 'lng1',
              y: 'lat1',
              x1: 'lng2',
              y1: 'lat2',
            },
          },
        )
        .size(20)
        .shape('greatcircle')
        .color('#ff0000')
        .texture('02')
        .style({
          opacity: 'testOpacity',
          // textureBlend: 'replace',
          // textureBlend: 'normal',
          blur: 0.99,
          lineTexture: true, // 开启线的贴图功能
          iconStep: 5, // 设置贴图纹理的间距

          // lineType: 'dash',
          // dashArray: [5, 5],
          // sourceColor: '#f00',
          // targetColor: '#0f0',
        })
        .animate({
          duration: 5,
          interval: 0.2,
          trailLength: 0.4,
        });
      // .animate(true);
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
