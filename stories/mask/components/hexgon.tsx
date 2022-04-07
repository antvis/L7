import {
  LineLayer,
  Scene,
  MaskLayer,
  HeatmapLayer,
  PointLayer,
} from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class MaskPoints extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      stencil: true,
      map: new GaodeMap({
        center: [120.165, 30.26],
        pitch: 0,
        zoom: 6,
        style: 'dark',
      }),
    });
    this.scene = scene;
    scene.addImage(
      '00',
      'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg',
    );
    const maskData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [117.20214843749999, 30.29701788337205],
                  [119.66308593749999, 30.050076521698735],
                  [117.20214843749999, 29.286398892934763],
                ],
              ],
              [
                [
                  [119.13574218749999, 28.188243641850313],
                  [119.64111328125, 29.19053283229458],
                  [120.60791015625, 27.955591004642553],
                ],
              ],
            ],
          },
        },
      ],
    };

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/a1a8158d-6fe3-424b-8e50-694ccf61c4d7.csv',
      )
        .then((res) => res.text())
        .then((data) => {
          // const layer = new HeatmapLayer({ mask: true })
          const layer = new HeatmapLayer({
            mask: true,
            maskInside: false,
            maskfence: maskData,
            maskOpacity: 0.5,
            maskColor: '#00f',
          })
            .source(data, {
              parser: {
                type: 'csv',
                x: 'lng',
                y: 'lat',
              },
              transforms: [
                {
                  type: 'hexagon',
                  size: 2500,
                  field: 'v',
                  method: 'sum',
                },
              ],
            })
            .size('sum', (sum) => {
              return sum * 20000;
            })
            .shape('hexagonColumn')
            .style({
              coverage: 0.8,
              angle: 0,
              opacity: 1.0,
            })
            .color('sum', [
              '#094D4A',
              '#146968',
              '#1D7F7E',
              '#289899',
              '#34B6B7',
              '#4AC5AF',
              '#5FD3A6',
              '#7BE39E',
              '#A1EDB8',
              '#C3F9CC',
              '#DEFAC0',
              '#ECFFB1',
            ]);
          scene.addLayer(layer);
        });
    });
  }

  public render() {
    return (
      <>
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
      </>
    );
  }
}
