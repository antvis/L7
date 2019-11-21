import { ArcLineLayer } from '@l7/layers';
import { Scene } from '@l7/scene';
import * as React from 'react';

export default class ArcLineDemo extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const response = await fetch(
      'https://gw.alipayobjects.com/os/rmsportal/UEXQMifxtkQlYfChpPwT.txt',
    );
    const scene = new Scene({
      center: [116.2825, 39.9],
      id: 'map',
      pitch: 0,
      type: 'mapbox',
      style: 'mapbox://styles/mapbox/dark-v9',
      zoom: 2,
    });
    const lineLayer = new ArcLineLayer({})
      .source(await response.text(), {
        parser: {
          type: 'csv',
          x: 'lng1',
          y: 'lat1',
          x1: 'lng2',
          y1: 'lat2',
        },
      })
      .size(0.5)
      .shape('arc')
      .color('rgb(13,64,140)');
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
