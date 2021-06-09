//@ts-ignore
import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
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
      map: new GaodeMap({
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
      },
      {
        lng: 121.107,
        lat: 30.267069,
      },
      {
        lng: 120.107846,
        lat: 30.267069,
      },
      {
        lng: 38.54,
        lat: 77.02,
      },
    ];
    this.scene = scene;

    scene.on('loaded', () => {
      // console.log('event test');
      // @ts-ignore
      // console.log(scene.map.getProjection().project);
      // @ts-ignore
      // console.log(scene.map.customCoords.lngLatToCoord);
      const layer = new PointLayer()
        .source(originData, {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        })
        // .shape('circle')
        // .shape('normal')
        .shape('fill')
        .color('rgba(255, 0, 0, 0.9)')
        .size(10)
        .style({
          stroke: '#fff',
          storkeWidth: 2,
          offsets: [100, 100],
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
