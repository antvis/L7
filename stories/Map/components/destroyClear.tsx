import { LineLayer, Scene, PolygonLayer } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class DestroyClear extends React.Component {
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
        center: [107.77791556935472, 35.443286920228644],
        zoom: 2.9142882493605033,
        viewMode: '3D',
      }),
    });
    this.scene = scene;
    let layer: any = null;

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json',
      )
        .then((res) => res.json())
        .then((data) => {
          let count = 1;
          let timer = setInterval(() => {
            layer = new PolygonLayer({ blend: 'normal' })
              .source(data)
              .size('name', [0, 10000, 50000, 30000, 100000])
              .color('name', [
                '#2E8AE6',
                '#69D1AB',
                '#DAF291',
                '#FFD591',
                '#FF7A45',
                '#CF1D49',
              ])
              .shape('fill')
              .select(true)
              .style({
                opacity: 0.8,
                opacityLinear: {
                  enable: true,
                  dir: 'in', // in - out
                },
              });
            scene.addLayer(layer);
            count++;
            setTimeout(() => {
              if (count > 10) {
                clearInterval(timer);
              }
              scene.removeLayer(layer);
              console.log(scene.getLayers());
            }, 3500);
          }, 4000);
        });
      fetch(
        'https://gw.alipayobjects.com/os/rmsportal/UEXQMifxtkQlYfChpPwT.txt',
      )
        .then((res) => res.text())
        .then((data) => {
          // let count = 1
          // let timer = setInterval(() => {
          //   layer = new LineLayer({})
          //   .source(data, {
          //     parser: {
          //       type: 'csv',
          //       x: 'lng1',
          //       y: 'lat1',
          //       x1: 'lng2',
          //       y1: 'lat2',
          //     },
          //   })
          //   .size(1)
          //   .shape('arc')
          //   .color('#8C1EB2')
          //   .style({
          //     opacity: 0.8,
          //     blur: 0.99,
          //   });
          //   scene.addLayer(layer);
          //   count++
          //   setTimeout(() => {
          //     if(count > 10) {
          //       clearInterval(timer)
          //     }
          //     scene.removeLayer(layer)
          //     console.log(scene.getLayers())
          //   }, 3500 )
          // }, 4000)
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
