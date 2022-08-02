// @ts-nocheck
// @ts-ignore
import { Scene, Source } from '@antv/l7';
import { PolygonLayer } from '@antv/l7-layers';
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
    const layer = new PolygonLayer({ workerEnabled: true })
      .source({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [104.4140625, 35.460669951495305],
                  [98.7890625, 24.206889622398023],
                  [111.796875, 27.371767300523047],
                  [104.4140625, 35.460669951495305],
                ],
              ],
            },
          },
        ],
      })
      .shape('fill')
      .color('#f00');

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
