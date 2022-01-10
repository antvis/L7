import { PointLayer, PolygonLayer, LineLayer, Scene } from '@antv/l7';
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
        center: [120.15, 30.246],
        pitch: 0,
        zoom: 13.5,
        style: 'dark',
        pitchEnable: false,
        rotation: -90,
      }),
    });
    this.scene = scene;

    scene.addImage(
      'westLakeBuilding',
      'https://gw.alipayobjects.com/zos/bmw-prod/8c3f6415-c1ca-4f7e-8ac6-89571ac75309.svg',
    );
    scene.addImage(
      'arrow',
      'https://gw.alipayobjects.com/zos/bmw-prod/ce83fc30-701f-415b-9750-4b146f4b3dd6.svg',
    );
    scene.addImage(
      'shop',
      'https://gw.alipayobjects.com/zos/bmw-prod/238e7c7c-c26c-454c-9341-35d466c4b991.svg',
    );
    scene.addImage(
      'hospital',
      'https://gw.alipayobjects.com/zos/bmw-prod/fd08bf28-f73e-4b9c-ba8d-2c73d4fca6dc.svg',
    );
    scene.addImage(
      'westlake',
      'https://gw.alipayobjects.com/zos/bmw-prod/7b011298-454d-431b-9637-ab23a752e731.svg',
    );
    scene.addImage(
      'ship',
      'https://gw.alipayobjects.com/zos/bmw-prod/104cfca2-f3c5-49e8-b084-d339f4ba1adc.svg',
    );
    scene.addImage(
      'travel',
      'https://gw.alipayobjects.com/zos/bmw-prod/904d047a-16a5-461b-a921-98fa537fc04a.svg',
    );
    scene.addImage(
      'pavilion',
      'https://gw.alipayobjects.com/zos/bmw-prod/8839795d-43d9-46c5-a5b1-95bf9a1146a0.svg',
    );
    scene.addImage(
      'museum',
      'https://gw.alipayobjects.com/zos/bmw-prod/5436a335-8ec3-40e4-9c93-16d0f844b0e7.svg',
    );
    scene.addImage(
      'bridge',
      'https://gw.alipayobjects.com/zos/bmw-prod/b88e6f2f-ad12-4980-969e-3849cbcd28c6.svg',
    );
    scene.addImage(
      'school',
      'https://gw.alipayobjects.com/zos/bmw-prod/948e665d-ab1e-4010-b75a-236057837bec.svg',
    );

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/bmw-prod/67130c6c-7f49-4680-915c-54e69730861d.json',
      )
        .then((data) => data.json())
        .then(
          ({
            lakeBorderData,
            lakeData,
            landData,
            westLakePoiData,
            poiData,
          }) => {
            const lakeLayer = new PolygonLayer()
              .source(lakeData)
              .shape('fill')
              .color('#1E90FF')
              .style({
                opacity: 0.4,
                opacityLinear: {
                  enable: true,
                  dir: 'out', // in - out
                },
              });
            const landLayer = new PolygonLayer()
              .source(landData)
              .shape('fill')
              .color('#3CB371')
              .style({
                opacity: 0.4,
                opacityLinear: {
                  enable: true,
                  dir: 'in', // in - out
                },
              });

            const lakeBorderLayer = new PolygonLayer()
              .source(lakeBorderData)
              .shape('fill')
              .color('#ccc')
              .style({
                opacity: 0.5,
                opacityLinear: {
                  enable: true,
                  dir: 'in', // in - out
                },
              });

            const westLakePoiLayer = new PointLayer({ zIndex: 1 })
              .source(westLakePoiData, {
                parser: {
                  type: 'json',
                  x: 'lng',
                  y: 'lat',
                },
              })
              .shape('type', (v) => v)
              .size(40);

            const poiLayer = new PointLayer({ zIndex: 1 })
              .source(poiData, {
                parser: {
                  type: 'json',
                  x: 'lng',
                  y: 'lat',
                },
              })
              .shape('type', (v) => v)
              .size(10);

            scene.addLayer(lakeLayer);
            scene.addLayer(lakeBorderLayer);
            scene.addLayer(landLayer);
            scene.addLayer(westLakePoiLayer);
            scene.addLayer(poiLayer);
          },
        );

      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/40ef2173-df66-4154-a8c0-785e93a5f18e.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const colors = ['#66c2a4', '#2ca25f', '#006d2c'];
          // @ts-ignore
          const layer = new LineLayer({})
            .source(data)
            .size(2.5)
            .shape('line')
            .texture('arrow')
            .color('', () => {
              return colors[Math.floor(Math.random() * colors.length)];
            })
            .animate({
              interval: 1, // 间隔
              duration: 1, // 持续时间，延时
              trailLength: 2, // 流线长度
            })
            .style({
              opacity: 0.6,
              lineTexture: true, // 开启线的贴图功能
              iconStep: 20, // 设置贴图纹理的间距
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
