import { PointLayer, Scene, LineLayer, PolygonLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';
export default class Amap2demo_image extends React.Component {
  // @ts-ignore
  private scene: Scene;
  private imageLayer: any;

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
        zoom: 12,
        viewMode: '3D',
      }),
    });
    this.scene = scene;
    let originData = [
      {
        id: '5011000000404',
        name: '铁路新村(华池路)',
        longitude: 121.4316962,
        latitude: 31.26082325,
        unit_price: 71469.4,
        count: 2,
        opacity: 0.5,
        offsets: [0, 0],
      },
      {
        id: '5011000002716',
        name: '金元坊',
        longitude: 121.3810096,
        latitude: 31.25302026,
        unit_price: 47480.5,
        count: 2,
        opacity: 0.5,
        offsets: [100, 0],
      },
      {
        id: '5011000003403',
        name: '兰溪路231弄',
        longitude: 121.4086229,
        latitude: 31.25291206,
        unit_price: 55218.4,
        count: 2,
        opacity: 0.8,
      },
      {
        id: '5011000003652',
        name: '兰溪公寓',
        longitude: 121.409227,
        latitude: 31.251014,
        unit_price: 55577.8,
        count: 2,
        opacity: 0.8,
      },
      {
        id: '5011000004139',
        name: '梅岭新村',
        longitude: 121.400946,
        latitude: 31.24946565,
        unit_price: 63028.1,
        count: 2,
        opacity: 1.0,
      },
    ];
    scene.addImage(
      '00',
      'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg'
      // "https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*qYtMTanpMOcAAAAAAAAAAAAAARQnAQ"
      // 'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*nGW2RZ3j8c8AAAAAAAAAAAAAARQnAQ'
      // 'https://gw.alipayobjects.com/zos/bmw-prod/8eee5dbd-c3f5-4806-a9b5-5c8e90d8510c.svg'
    );
    scene.addImage(
      '01',
      'https://gw.alipayobjects.com/zos/basement_prod/30580bc9-506f-4438-8c1a-744e082054ec.svg',
    );
    scene.addImage(
      '02',
      'https://gw.alipayobjects.com/zos/basement_prod/7aa1f460-9f9f-499f-afdf-13424aa26bbf.svg',
    );

    scene.on('loaded', () => {
      this.imageLayer = new PointLayer()
      .source(originData, {
          parser: {
            type: 'json',
            x: 'longitude',
            y: 'latitude',
          },
        })
        .shape('name', ['00', '01','02'])
        .size(20)
      scene.addLayer(this.imageLayer)
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
