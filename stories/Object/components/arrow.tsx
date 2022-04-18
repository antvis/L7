import { GeometryLayer, Scene, LineLayer } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class Demo extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        // map: new GaodeMapV2({
        // map: new Mapbox({
        pitch: 0,
        // style: 'dark',
        center: [120, 30],
        zoom: 3,
      }),
    });
    this.scene = scene;

    const layer = new LineLayer()
      // .source([
      //   {
      //     lng1: 100,
      //     lat1: 30.0,
      //     lng2: 105,
      //     lat2: 30,
      //   },
      //   {
      //     lng1: 105,
      //     lat1: 30.0,
      //     lng2: 130,
      //     lat2: 30,
      //   },
      // ], {
      //   parser: {
      //     type: 'json',
      //     x: 'lng1',
      //     y: 'lat1',
      //     x1: 'lng2',
      //     y1: 'lat2',
      //   }
      // })
      .source({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                [100, 30],
                [120, 30],
                [120, 25],
                [125, 25],
              ],
            },
          },
        ],
      })
      .shape('line')
      .size(10)
      // .color('lng1', ['#f00', '#ff0'])
      .color('#f00')
      .style({
        opacity: 0.3,
        arrow: {
          enable: true,
          arrowWidth: 2,
          // arrowHeight: 3,
          tailWidth: 0,
        },
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
