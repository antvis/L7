import { LineLayer, Scene, PointLayer, Marker, MarkerLayer } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Mapbox, Map } from '@antv/l7-maps';
import * as React from 'react';

export default class SimpleLine extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMapV2({
        center: [96.328125, 38.685509760012],
        // pitch: 75,
        zoom: 4,
        // rotation: -30,
        // style: 'blank',
      }),
    });
    this.scene = scene;

    const layer = new LineLayer({})
      .source({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                [90.791015625, 38.75408327579141],
                [90.87890625, 33.797408767572485],
                [95.185546875, 32.76880048488168],
                [95.537109375, 34.08906131584994],
                [96.328125, 38.685509760012],
                [100.107421875, 38.34165619279595],
                [101.953125, 36.80928470205937],
                [100.107421875, 34.95799531086792],
              ],
            },
          },
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                [90.791015625, 38.75408327579141],
                [95, 45],
              ],
            },
          },
        ],
      })
      .size(1)
      .shape('simple')
      .color('rgb(22, 119, 255)')
      .style({
        sourceColor: '#f00',
        targetColor: '#0f0',
      });

    scene.on('loaded', () => {
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
