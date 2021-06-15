// @ts-ignore
import { LineLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class Line extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [120.19382669582967, 30.258134],
        pitch: 0,
        zoom: 8,
        viewMode: '3D',
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      // @ts-ignore
      const layer = new LineLayer({})
        .source({
          type: 'FeatureCollection',
          name: 'dl2',
          crs: {
            type: 'name',
            properties: {
              name: 'urn:ogc:def:crs:OGC:1.3:CRS84',
            },
          },
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'MultiLineString',
                coordinates: [
                  [
                    [120, 32],
                    [121, 32],
                    [121, 30],
                  ],
                ],
              },
            },
          ],
        })
        .size(5)
        .shape('line')
        .color('#25d8b7');
      scene.addLayer(layer);
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
