import { Line } from '@l7/layers';
import { Scene } from '@l7/scene';
import * as React from 'react';

export default class Point3D extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const response = await fetch(
      'https://gw.alipayobjects.com/os/rmsportal/ZVfOvhVCzwBkISNsuKCc.json',
    );
    const testdata = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [91.58203125, 34.95799531086792],
              [96.767578125, 34.379712580462204],
              [99.228515625, 33.7243396617476],
            ],
          },
        },
      ],
    };
    const scene = new Scene({
      center: [102.602992, 23.107329],
      id: 'map',
      pitch: 0,
      type: 'mapbox',
      style: 'mapbox://styles/mapbox/dark-v9',
      zoom: 2,
    });
    const LineLayer = new Line({});

    LineLayer.source(testdata)
      .size(5)
      .color('red')
      .shape('line')
      .size(10);
    scene.addLayer(LineLayer);
    // function run() {
    //   scene.render();
    //   requestAnimationFrame(run);
    // }
    // requestAnimationFrame(run);
    scene.render();
    this.scene = scene;
    console.log(LineLayer);
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
