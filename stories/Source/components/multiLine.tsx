import { LineLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

function convertRGB2Hex(rgb: number[]) {
  return (
    '#' + rgb.map((r) => ('0' + Math.floor(r).toString(16)).slice(-2)).join('')
  );
}

export default class MultiLine extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        pitch: 0,
        style: 'dark',
        center: [101.775374, 20],
        zoom: 3,
      }),
    });

    const layer = new LineLayer({})
      .source({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                [90.703125, 34.59704151614417],
                [112.8515625, 39.095962936305476],
                [117.42187500000001, 29.53522956294847],
                [127.61718749999999, 34.016241889667015],
                [129.0234375, 40.713955826286046],
                [136.40625, 36.87962060502676],
                [136.40625, 28.304380682962783],
                [130.078125, 25.16517336866393],
                [125.5078125, 20.96143961409684],
                [130.078125, 17.644022027872726],
              ],
            },
          },
        ],
      })
      .shape('line')
      .color('red')
      .size(2)
      .style({
        opacity: 0.5,
        lineType: 'dash',
        dashArray: [2, 2, 4, 2],
      });
    scene.addLayer(layer);
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
