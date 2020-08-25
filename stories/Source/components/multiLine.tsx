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
              type: 'MultiLineString',
              coordinates: [
                [
                  [142.03125, 65.36683689226321],
                  [187.03125, 50.28933925329178],
                  [187.734375, 21.94304553343818],
                  [155.390625, -4.214943141390639],
                ],
                [
                  [217.96875, 70.61261423801925],
                  [257.34375, 51.6180165487737],
                  [257.34375, -39.90973623453718],
                  [223.59375, -45.08903556483102],
                ],
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
