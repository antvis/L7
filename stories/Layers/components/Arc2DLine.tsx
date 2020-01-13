import { LineLayer, Scene } from '@antv/l7';
import { Mapbox, GaodeMap } from '@antv/l7-maps';
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
    const lineLayer = new LineLayer()
      .source(await response.text(), {
        parser: {
          type: 'csv',
          x: 'lng1',
          y: 'lat1',
          x1: 'lng2',
          y1: 'lat2',
        },
      })
      .size(4)
      .shape('greatcircle')
      .color('rgb(13,64,140)')
      .animate({
        interval: 0.5,
        duration: 2,
        trailLength: 0.4,
      })
      .style({
        opacity: 0.6,
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
