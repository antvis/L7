import { vec2, vec3 } from 'gl-matrix';
// @ts-ignore
import { ILngLat, PointLayer, PolygonLayer, Scene } from '@antv/l7';
import { GaodeMap, GaodeMap2 } from '@antv/l7-maps';
import * as React from 'react';

import { mat4 } from 'gl-matrix';

export default class Amap2demo extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap2({
        center: [121.107846, 30.267069],
        pitch: 0,
        style: 'normal',
        zoom: 13,
        animateEnable: false,
      }),
    });
    let originData = [
      {
        lng: 121.107846,
        lat: 30.267069,
      },
      {
        lng: 121.1,
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
      console.log('event test');

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
        .color('rgba(255, 0, 0, 0.9)')
        .size(10)
        .style({
          stroke: '#fff',
          storkeWidth: 2,
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
