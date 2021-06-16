//@ts-ignore
import { PointLayer, Scene } from '@antv/l7';
import { GaodeMapV2 } from '@antv/l7-maps';
import * as React from 'react';
export default class Amap2demo extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMapV2({
        center: [121.107846, 30.267069],
        pitch: 0,
        style: 'normal',
        zoom: 20,
        animateEnable: false,
      }),
    });
    let originData = [
      {
        lng: 121.107846,
        lat: 30.267069,
        opacity2: 0.2,
        strokeOpacity2: 0.2,
      },
      {
        lng: 121.107,
        lat: 30.267069,
        opacity2: 0.4,
        strokeOpacity2: 0.4,
      },
      {
        lng: 121.107846,
        lat: 30.26718,
        opacity2: 0.6,
        strokeOpacity2: 0.6,
      },
      // {
      //   lng: 38.54,
      //   lat: 77.02,
      //   opacity: 0.5
      // },
    ];
    this.scene = scene;

    scene.on('loaded', () => {
      const layer = new PointLayer()
        .source(originData, {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        })
        .shape('circle')
        // .shape('normal')
        // .shape('fill')
        .color('rgba(255, 0, 0, 0.9)')
        .size(10)
        .style({
          stroke: '#000',
          storkeWidth: 2,
          // strokeOpacity: 0.2,
          // strokeOpacity: 'strokeOpacity2',
          strokeOpacity: [
            'strokeOpacity2',
            (d: any) => {
              return d;
            },
          ],
          // strokeOpacity: ['opacity2', [0.2, 0.6]],
          // offsets: [100, 100],
          opacity: 'opacity2',
          // opacity: 0.2
          // opacity: ['opacity2', (d: any) => {
          //   return d
          // }]
          // opacity: ['opacity2', [0.2, 0.6]],
        })
        .active(true);
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
