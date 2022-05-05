import { PointLayer, Scene, LineLayer, PolygonLayer } from '@antv/l7';
import { GaodeMap, Mapbox, Map } from '@antv/l7-maps';
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

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json',
      )
        .then((res) => res.json())
        .then((data) => {
          scene.addImage(
            '00',
            'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg',
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
              // .source([
              //   {
              //     longitude: 121.434765,
              //     latitude: 31.256735,
              //     name: ''
              //   }
              // ], {
              parser: {
                type: 'json',
                x: 'longitude',
                y: 'latitude',
              },
            })
            .shape('name', ['00', '01', '02'])
            .rotate('name', () => Math.random() * Math.PI)
            // .rotate(Math.PI/2)
            .style({
              layerType: 'fillImage',
              rotation: 0,
            })
            .active({
              color: '#00f',
              mix: 0.6,
            })
            .size(30);
          scene.addLayer(imageLayer);

          setTimeout(() => {
            console.log('remove layer');
            scene.removeLayer(imageLayer);
          }, 2000);
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
