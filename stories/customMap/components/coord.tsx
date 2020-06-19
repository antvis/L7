// @ts-ignore
import { Scene } from '@antv/l7';
import { PolygonLayer } from '@antv/l7-layers';
import { Map } from '@antv/l7-maps';
import * as React from 'react';

export default class ScaleComponent extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Map({
        coord: 'simple',
        hash: true,
        center: [200, 200],
        pitch: 0,
        zoom: 0,
      }),
    });

    const layer = new PolygonLayer({
      name: '01',
    });

    layer
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
                  [20, 20],
                  [400, 20],
                  [400, 400],
                  [20, 400],
                  [20, 20],
                ],
              ],
            },
          },
        ],
      })
      .color('#2E8AE6')
      .shape('fill')
      .style({
        opacity: 1.0,
      });
    scene.addLayer(layer);
    scene.on('loaded', () => {
      console.log(scene.getCenter());
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
      />
    );
  }
}
