// @ts-nocheck
// @ts-ignore
import { Scene, Source } from '@antv/l7';
import { LineLayer } from '@antv/l7-layers';
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
    const layer = new LineLayer()
      .source({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                [95.625, 28],
                [115.48828125000001, 28],
              ],
            },
          },
        ],
      })
      .shape('halfLine')
      .color('#f00')
      .size(10)
      .style({
        arrow: {
          enable: true,
        },
      });
    scene.on('loaded', () => {
      scene.addLayer(layer);
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
