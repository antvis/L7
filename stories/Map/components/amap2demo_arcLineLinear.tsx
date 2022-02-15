import { LineLayer, Scene } from '@antv/l7';
import { GaodeMapV2 } from '@antv/l7-maps';
import * as React from 'react';

export default class Amap2demo_arcLineLinear extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMapV2({
        pitch: 40,
        center: [60, 40],
        zoom: 2.9142882493605033,
        viewMode: '3D',
        style: 'dark',
        version: '2.0.4',
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      let data = [
        {
          lng1: 75.76171875,
          lat1: 36.31512514748051,
          lng2: 46.23046874999999,
          lat2: 52.802761415419674,
        },
      ];
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
        .size(20)
        .shape('arc')
        .color('#f00')
        .active(true)
        .style({
          // forward: false,
          // opacity: 0.5,
          // opacity: 0.2,
          // lineType: 'dash',
          // dashArray: [5, 5],
          // textureBlend: 'replace',
          // textureBlend: 'normal',
          sourceColor: '#f00',
          targetColor: '#0f0',
          // thetaOffset: 0.5
        });
      // .animate({
      //   duration: 50,
      //   interval: 0.3,
      //   trailLength: 0.1,
      // });
      scene.addLayer(layer);

      layer.on('click', (e) => {
        console.log(e);
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
