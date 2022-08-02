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
        zoom: 5,
      }),
    });

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/337ddbb7-aa3f-4679-ab60-d64359241955.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const layer = new HeatmapLayer({})
            .source(data, {
              transforms: [
                {
                  type: 'hexagon',
                  size: 90000,
                  field: 'capacity',
                  method: 'sum',
                },
              ],
            })
            .shape('hexagon')
            .style({
              coverage: 0.9,
              angle: 0,
              opacity: 1.0,
            })
            .color(
              'sum',
              [
                '#3F4BBA',
                '#3F4BBA',
                '#3F4BBA',
                '#3F4BBA',
                '#3C73DA',
                '#3C73DA',
                '#3C73DA',
                '#0F62FF',
                '#0F62FF',
                '#30B2E9',
                '#30B2E9',
                '#40C4CE',
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
