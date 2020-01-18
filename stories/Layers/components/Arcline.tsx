import { LineLayer, Scene } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class ArcLineDemo extends React.Component {
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
      map: new Mapbox({
        center: [116.2825, 39.9],
        pitch: 0,
        style: 'dark',
        zoom: 2,
      }),
    });
    this.scene = scene;
    const lineLayer = new LineLayer({
      blend: 'normal',
    })
      .source(await response.text(), {
        parser: {
          type: 'csv',
          x: 'lng1',
          y: 'lat1',
          x1: 'lng2',
          y1: 'lat2',
        },
      })
      .size(1)
      .shape('arc3d')
      .select({
        color: 'red',
      })
      .active({
        color: 'red',
      })
      .color('rgb(13,64,140)')
      .animate({
        enable: true,
        interval: 0.1,
        duration: 2,
        trailLength: 1.0,
      })
      .style({
        lineType: 'dash',
      });
    scene.addLayer(lineLayer);
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
