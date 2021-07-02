import { LineLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class Amap2demo_arcLine_greatCircle extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        pitch: 0,
        center: [107.77791556935472, 35.443286920228644],
        zoom: 2.9142882493605033,
        viewMode: '3D',
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      const layer = new LineLayer({})
        .source(
          [
            {
              lng1: 75.9375,
              lat1: 37.71859032558816,
              lng2: 123.3984375,
              lat2: 39.639537564366684,
            },
          ],
          {
            parser: {
              type: 'json',
              x: 'lng1',
              y: 'lat1',
              x1: 'lng2',
              y1: 'lat2',
            },
          },
        )
        .size(1)
        .shape('greatcircle')
        .color('#ff0000')
        .style({
          opacity: 0.8,
          blur: 0.99,
        });
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
