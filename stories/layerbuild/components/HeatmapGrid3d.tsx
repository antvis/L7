// @ts-nocheck
// @ts-ignore
import { Scene, Source } from '@antv/l7';
import { HeatmapLayer } from '@antv/l7-layers';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class Demo extends React.Component {
  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [120, 30],
        pitch: 40,
        zoom: 9,
      }),
    });

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/a1a8158d-6fe3-424b-8e50-694ccf61c4d7.csv',
      )
        .then((res) => res.text())
        .then((data) => {
          const layer = new HeatmapLayer({})
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
              return sum * 200;
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
      <div
        id="map"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      ></div>
    );
  }
}
