import { PointLayer, CityBuildingLayer, Scene } from '@antv/l7';
import { GaodeMap, GaodeMap2 } from '@antv/l7-maps';
import * as React from 'react';

export default class Amap2demo_citybuilding extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const response = await fetch(
      'https://gw.alipayobjects.com/os/rmsportal/vmvAxgsEwbpoSWbSYvix.json',
    );
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap2({
        style: 'dark',
        center: [121.507674, 31.223043],
        pitch: 65.59312320916906,
        zoom: 15.4,
      }),
    });
    const pointLayer = new CityBuildingLayer();
    pointLayer
      .source(await response.json())
      .size('floor', [0, 500])
      .color('rgba(242,246,250,1.0)')
      .animate({
        enable: false,
      })
      .style({
        opacity: 0.7,
        baseColor: 'rgb(16,16,16)',
        windowColor: 'rgb(30,60,89)',
        brightColor: 'rgb(255,176,38)',
      });
    scene.addLayer(pointLayer);

    this.scene = scene;
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
