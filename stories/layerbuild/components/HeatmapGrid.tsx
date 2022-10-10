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
        pitch: 0,
        zoom: 2,
      }),
    });

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/7359a5e9-3c5e-453f-b207-bc892fb23b84.csv',
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
                  type: 'grid',
                  size: 20000,
                  field: 'v',
                  method: 'sum',
                },
              ],
            })
            .shape('square')
            .style({
              coverage: 1,
              angle: 0,
            })
            .color(
              'count',
              [
                '#0B0030',
                '#100243',
                '#100243',
                '#1B048B',
                '#051FB7',
                '#0350C1',
                '#0350C1',
                '#0072C4',
                '#0796D3',
                '#2BA9DF',
                '#30C7C4',
                '#6BD5A0',
                '#A7ECB2',
                '#D0F4CA',
              ].reverse(),
            );

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
