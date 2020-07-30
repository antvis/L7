import { LineLayer, PointLayer, PolygonLayer, Popup, Scene } from '@antv/l7';
import { DrawLine } from '@antv/l7-draw';
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
        center: [79.8046875, 52.482780222078226],
        zoom: 4,
      }),
    });
    this.scene = scene;
    const line = scene.on('loaded', () => {
      const drawLine = new DrawLine(scene, {
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [
                  [79.8046875, 52.482780222078226],
                  [110.74218749999999, 36.87962060502676],
                  [111.4453125, 19.973348786110602],
                  [112.8515625, 9.795677582829743],
                  [95.2734375, -6.664607562172573],
                  [82.265625, -14.264383087562637],
                  [74.53125, -25.799891182088306],
                  [68.203125, -30.145127183376115],
                  [41.484375, -16.63619187839765],
                ],
              },
            },
          ],
        },
      });
      drawLine.enable();
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
