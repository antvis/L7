import { LineLayer } from '@l7/layers';
import { Scene } from '@l7/scene';
import * as React from 'react';

export default class LineDemo extends React.Component {
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
      zoom: 13,
    });
    const lineLayer = new LineLayer({})
      .source(await response.json())
      .size(1)
      .shape('line')
      .color(
        'ELEV',
        [
          '#E8FCFF',
          '#CFF6FF',
          '#A1E9ff',
          '#65CEF7',
          '#3CB1F0',
          '#2894E0',
          '#1772c2',
          '#105CB3',
          '#0D408C',
          '#002466',
        ].reverse(),
      )

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
