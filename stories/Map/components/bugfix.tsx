// @ts-nocheck
import React from 'react';
import { Scene, GaodeMap, GaodeMapV2, Mapbox, Map, PointLayer } from '@antv/l7';


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
        // center: [121.434765, 31.256735],
        // zoom: 14.83,
        pitch: 0,
        style: 'light',
        center: [122.5, 30],
        zoom: 4
      }),
    });
    this.scene = scene;

    const layer = new PointLayer()
    .source([
      {lng: 120, lat: 30, c: '#ff0'},
      {lng: 125, lat: 30, c: '#0f0'}
    ], {
      parser: {
        type: 'json',
        x: 'lng',
        y: 'lat'
      }
    })
    .shape('circle')
    .size(20)
    .color('c')

    scene.on('loaded', () => {
      scene.addLayer(layer);
      // layer.on('dataUpdate', (e) => {
      //   const le = layer.getLegendItems('color')
      //   console.log(le)
      // })
      layer.on('dataUpdate', (e) => {
        const le = layer.getLegendItems('color')
        console.log('scale', le)
      })
      layer.setData([
        {lng: 121, lat: 30, c: '#000'}
      ])
      // layer.color('#f00')
      scene.render()
      
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
