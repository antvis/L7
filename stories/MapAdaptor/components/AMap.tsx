import { PointLayer } from '@l7/layers';
import { Scene } from '@l7/scene';
import * as React from 'react';
import data from './data.json';

export default class AMap extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public componentDidMount() {
    const scene = new Scene({
      center: [120.19382669582967, 30.258134],
      id: 'map',
      pitch: 0,
      style: 'dark',
      type: 'amap',
      zoom: 1,
    });
    const pointLayer = new PointLayer({});
    pointLayer.source(data);
    scene.addLayer(pointLayer);
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
