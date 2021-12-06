// @ts-ignore
import { PointLayer, Scene, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class GaodeMapComponent extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [121.107846, 30.267069],
        pitch: 0,
        // style: 'normal',
        zoom: 20,
        animateEnable: false,
      }),
    });
    // normal = 'normal',
    // additive = 'additive',
    // subtractive = 'subtractive',
    // min = 'min',
    // max = 'max',
    // none = 'none',
    const layer = new PointLayer({ zIndex: 2 })
      .source(
        [
          {
            lng: 121.107846,
            lat: 30.267069,
          },
          {
            lng: 121.107,
            lat: 30.267069,
          },
        ],
        {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        },
      )
      .shape('circle')
      // .shape('normal')
      .color('blue')
      .size(10)
      .style({
        stroke: '#fff',
        storkeWidth: 2,
        // offsets: [100, 100],
      });

    this.scene = scene;

    const linelayer = new LineLayer({})
      .source({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'MultiLineString',
              coordinates: [
                [
                  [121.107846, 30.267069],
                  [121.107, 30.267069],
                ],
              ],
            },
          },
        ],
      })
      .shape('line')
      .color('#0ff')
      .size(10);

    scene.on('loaded', () => {
      scene.addLayer(linelayer);
      scene.addLayer(layer);
    });
    layer.on('click', () => console.log('point click'));
    linelayer.on('click', () => console.log('line click'));
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
