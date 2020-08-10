import { LineLayer, PointLayer, PolygonLayer, Popup, Scene } from '@antv/l7';
import { DrawPoint } from '@antv/l7-draw';
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
        center: [113.775374, 28.31067],
        zoom: 12,
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      const drawPoint = new DrawPoint(scene, {
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: [88.9453125, 53.330872983017066],
              },
            },
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: [109.3359375, 28.613459424004414],
              },
            },
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: [97.734375, 35.460669951495305],
              },
            },
          ],
        },
      });
      drawPoint.enable();
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
