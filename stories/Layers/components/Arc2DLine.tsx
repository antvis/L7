import { LineLayer, Scene } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class Arc2DLineDemo extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const response = await fetch(
      'https://gw.alipayobjects.com/os/rmsportal/UEXQMifxtkQlYfChpPwT.txt',
    );
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [116.2825, 39.9],
        pitch: 0,
        style: 'dark',
        zoom: 2,
      }),
    });
    const lineLayer = new LineLayer({
      blend: 'normal',
      pickingBuffer: 10,
    })
      .source(
        [
          {
            lng1: 84.375,
            lat1: 47.517200697839414,
            lng2: 117.94921874999999,
            lat2: 22.268764039073968,
          },
        ],
        {
          parser: {
            type: 'json',
            x1: 'lng1',
            y1: 'lat1',
            x: 'lng2',
            y: 'lat2',
          },
        },
      )
      .size(2)
      .shape('arc')
      .animate({
        enable: false,
        interval: 0.1,
        trailLength: 0.5,
        duration: 0.5,
      })
      .color('#8C1EB2')
      .style({
        opacity: 1,
      });
    scene.addLayer(lineLayer);
    lineLayer.on('click', (e) => {
      console.log(e);
    });
    scene.render();
    this.scene = scene;
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
      />
    );
  }
}
