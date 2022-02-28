// @ts-nocheck
import React from 'react';
import { Scene, GaodeMap, GaodeMapV2, PointLayer } from '@antv/l7';

export default class Amap2demo extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [121.434765, 31.256735],
        zoom: 14.83,
      }),
    });
    this.scene = scene;

    scene.addImage(
      '00',
      'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg',
    );

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const imageLayer = new PointLayer()
            .source(data, {
              parser: {
                type: 'json',
                x: 'longitude',
                y: 'latitude',
              },
            })
            .shape('name', ['00'])
            .size(10);

          let d = {
            coordinates: (2)[(121.4318415, 31.25682515)],
            count: 2,
            id: '5011000005647',
            latitude: 31.25682515,
            longitude: 121.4318415,
            name: '石泉路140弄',
            unit_price: 52256.3,
          };
          const imageLayer1 = new PointLayer()
            .source([], {
              parser: {
                type: 'json',
                x: 'longitude',
                y: 'latitude',
              },
            })
            .shape('name', ['00'])
            .size(25);

          scene.addLayer(imageLayer);
          scene.addLayer(imageLayer1);

          imageLayer.on('click', (e) => {
            // console.log(e);
            // imageLayer1.setBlend('normal')
            imageLayer1.setData([e.feature]);
          });
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
        ></div>
      </>
    );
  }
}
