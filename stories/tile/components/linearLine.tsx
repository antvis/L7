import {
  GeometryLayer,
  Scene,
  IMapService,
  PointLayer,
  LineLayer,
} from '@antv/l7';
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
        pitch: 0,
        style: 'dark',
        center: [114.1, 22.44],
        zoom: 10.5,
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/bmw-prod/2a27d9d2-e137-47de-9814-792b004d7742.json',
      )
        .then((res) => res.json())
        .then((res) => {
          const layer = new LineLayer()
            .source(res)
            .shape('linearline')
            .size(0.6)
            .style({
              rampColors: {
                colors: [
                  '#FF4818',
                  '#F7B74A',
                  '#FFF598',
                  '#91EABC',
                  '#2EA9A1',
                  '#206C7C',
                ],
                positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
              },
            });

          scene.addLayer(layer);
        });
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
