// @ts-nocheck
import React from 'react';
import { Scene, GaodeMap, GaodeMapV2, Mapbox, Map, PointLayer, LineLayer } from '@antv/l7';

export default class Amap2demo extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    function initScene() {
      return new Promise((resolve, reject) => {
        const scene = new Scene({
          id: 'map',
          map: new GaodeMapV2({
            // center: [121.434765, 31.256735],
            // zoom: 14.83,
            pitch: 0,
            style: 'light',
            center: [120, 30],
            zoom: 4,
          }),
        });
        scene.on('loaded', () => {
          setTimeout(() => {
            resolve(scene);
          }, 200);
        });
      });
    }

    // for (let i = 0; i < 20; i++) {
    //   console.log('init ' + (i + 1));
    //   let scene = await initScene();
    //   scene.destroy();
    // }

    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        // center: [121.434765, 31.256735],
        // zoom: 14.83,
        pitch: 0,
        style: 'light',
        center: [120, 30],
        zoom: 4,
      }),
    });
    scene.addImage( '00', 'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg');

    scene.on('loaded', () => {

      for(let i = 0;i < 20;i++) {
        //   const layer = new PointLayer().source([
        //     { lng: 120, lat: 30, name: '00' }
        //   ], {
        //     parser: {
        //       type: 'json',
        //       x: 'lng',
        //       y: 'lat'
        //     }
        //   })
        //   .shape('name', ['00'])
        //   .size(20)
    
        // scene.addLayer(layer);

        const lineLayer = new LineLayer()
        .source([{
          lng1: 120,
          lat1: 30,
          lng2: 122,
          lat2: 30
        }], {
          parser: {
            type: 'json',
            x: 'lng1',
            y: 'lat1',
            x1: 'lng2',
            y1: 'lat2'
          }
        }).shape('line')
        .size(2)
        .color('#f00')

        scene.addLayer(lineLayer)
      }



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
