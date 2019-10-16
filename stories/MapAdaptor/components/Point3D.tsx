import { Point } from '@l7/layers';
import { Scene } from '@l7/scene';
import * as React from 'react';
import data from './data.json';

export default class Point3D extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public componentDidMount() {
    const scene = new Scene({
      center: [120.19382669582967, 30.258134],
      id: 'map',
      pitch: 0,
      type: 'mapbox',
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom: 1,
    });
    const pointLayer = new Point({});
    const p1 = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [83.671875, 44.84029065139799],
          },
        },
      ],
    };
    pointLayer
      .source(data)
      .color('blue')
      .shape('scalerank', [ 'triangleColumn', 'squareColumn', 'hexagonColumn' ,'cylinder' ])
      .size([25, 10]);
    scene.addLayer(pointLayer);
    // function run() {
    //   scene.render();
    //   requestAnimationFrame(run);
    // }
    // requestAnimationFrame(run);
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
