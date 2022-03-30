import { CityBuildingLayer, Scene, LineLayer } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Mapbox, Map } from '@antv/l7-maps';
import * as React from 'react';

export default class Amap2demo_citybuilding extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        style: 'dark',
        center: [120.160514, 30.243209],
        pitch: 45,
        zoom: 14,
        viewMode: '3D',
      }),
    });
    fetch(
      'https://gw.alipayobjects.com/os/rmsportal/ggFwDClGjjvpSMBIrcEx.json',
    ).then(async (res) => {
      const pointLayer = new CityBuildingLayer();
      pointLayer
        .source(await res.json())
        .size('floor', [0, 500])
        .color('rgba(242,246,250,1.0)')
        // .animate({
        //   enable: true,
        // })
        .active({
          color: '#0ff',
          mix: 0.5,
        })
        .style({
          // opacity: 0.7,
          baseColor: 'rgb(16, 16, 16)',
          windowColor: 'rgb(30, 60, 89)',
          brightColor: 'rgb(255, 176, 38)',
          // sweep: {
          //   enable: true,
          //   sweepRadius: 2,
          //   sweepColor: '#1990FF',
          //   sweepSpeed: 0.5,
          // },
        });
      scene.addLayer(pointLayer);
    });

    fetch(
      'https://gw.alipayobjects.com/os/basement_prod/40ef2173-df66-4154-a8c0-785e93a5f18e.json',
    )
      .then((res) => res.json())
      .then((data) => {
        const layer = new LineLayer({
          zIndex: 0,
          // depth: true
        })
          .source(data)
          .size(1)
          .shape('line')
          .color('#1990FF')
          .style({
            depth: true,
          })
          .animate({
            interval: 1, // 间隔
            duration: 2, // 持续时间，延时
            trailLength: 2, // 流线长度
          });
        scene.addLayer(layer);
      });
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
