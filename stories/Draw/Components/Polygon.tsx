import { Scene } from '@antv/l7';
import { DrawPolygon } from '@antv/l7-draw';
import { GaodeMap, Mapbox } from '@antv/l7-maps';

import * as React from 'react';
export default class Circle extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        pitch: 0,
        style: 'light',
        center: [44.29687499999999, 55.3791104480105],
        zoom: 3,
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      const drawPolygon = new DrawPolygon(scene, {
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [44.29687499999999, 55.3791104480105],
                    [28.4765625, 47.754097979680026],
                    [27.0703125, 38.8225909761771],
                    [42.890625, 33.43144133557529],
                    [73.47656249999999, 37.43997405227057],
                    [85.4296875, 47.989921667414194],
                    [79.1015625, 60.58696734225869],
                    [44.29687499999999, 55.3791104480105],
                  ],
                ],
              },
            },
          ],
        },
      });
      // drawPolygon.enable();
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
