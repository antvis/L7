import { Scene, HeatmapLayer } from '@antv/l7';
import { GaodeMap, Mapbox, Map } from '@antv/l7-maps';
import * as React from 'react';

export default class Amap2demo_heatmap extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Map({
        // pitch: 0,
        // center: [127.5671666579043, 7.445038892195569],
        // zoom: 2.632456779444394,
        style: 'dark',
        pitch: 0,
        center: [120, 30],
        zoom: 4,
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      // fetch(
      //   'https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json',
      // )
      //   .then((res) => res.json())
      //   .then((data) => {
      //     const layer = new HeatmapLayer({})
      //       .source(data)
      //       .shape('heatmap')
      //       .size('mag', [0, 1.0]) // weight映射通道
      //       .style({
      //         intensity: 2,
      //         radius: 20,
      //         opacity: 1.0,
      //         rampColors: {
      //           colors: [
      //             '#FF4818',
      //             '#F7B74A',
      //             '#FFF598',
      //             '#91EABC',
      //             '#2EA9A1',
      //             '#206C7C',
      //           ].reverse(),
      //           positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
      //         },
      //       });
      //     scene.addLayer(layer);
      //   });

      fetch(
        'https://gw.alipayobjects.com/os/bmw-prod/95d5a2c3-f8fa-47f3-8664-ecb8459565ee.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const layer = new HeatmapLayer({})
            .source(data)
            .shape('heatmap')
            .size('weight', [0, 1.0]) // weight映射通道
            .style({
              intensity: 3,
              radius: 24,
              opacity: 1.0,
              rampColors: {
                colors: ['#030EAB', '#0F41EB', '#40D785', '#F1D41A', '#FE0257'],
                positions: [0, 0.25, 0.5, 0.75, 1.0],
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
