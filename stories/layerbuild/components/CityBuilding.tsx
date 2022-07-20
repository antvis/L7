// @ts-nocheck
// @ts-ignore
import { Scene, Source } from '@antv/l7';
import { CityBuildingLayer } from '@antv/l7-layers';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class Demo extends React.Component {
  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [ 120.145, 30.238915 ],
        pitch: 60,
        zoom: 13.2
      }),
    });

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/rmsportal/ggFwDClGjjvpSMBIrcEx.json'
      ).then(async res => {
        const pointLayer = new CityBuildingLayer();
        pointLayer
          .source(await res.json())
          .size('floor', [ 0, 500 ])
          .color('rgba(242,246,250,1.0)')
          .animate({
            enable: true
          })
          .active({
            color: '#0ff',
            mix: 0.5
          })
          .style({
            opacity: 0.7,
            baseColor: 'rgb(16, 16, 16)',
            windowColor: 'rgb(30, 60, 89)',
            brightColor: 'rgb(255, 176, 38)',
            sweep: {
              enable: true,
              sweepRadius: 2,
              sweepColor: '#1990FF',
              sweepSpeed: 0.5,
              sweepCenter: [ 120.145319, 30.238915 ]
            }
          });
        scene.addLayer(pointLayer);
      });
    });
  }

  public render() {
    return (
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
    );
  }
}
