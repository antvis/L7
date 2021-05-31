// @ts-ignore
import { ILngLat, PointLayer, PolygonLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class Amap2demo_image extends React.Component {
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
        style: 'light',
        center: [121.434765, 31.256735],
        zoom: 14.83,
        viewMode: '3D',
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json',
      )
        .then((res) => res.json())
        .then((data) => {
          // console.log('data', data)
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
            'https://gw.alipayobjects.com/zos/basement_prod/7aa1f460-9f9f-499f-afdf-13424aa26bbf.svg',
          );
          const imageLayer = new PointLayer()
            .source(data, {
              parser: {
                type: 'json',
                x: 'longitude',
                y: 'latitude',
              },
            })
            .shape('name', ['00', '01', '02'])
            // .color("rgba(255, 0, 0, 0.1)")
            .size(20);
          scene.addLayer(imageLayer);
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
