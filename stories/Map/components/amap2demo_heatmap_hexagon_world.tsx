import { Scene, HeatmapLayer } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class Amap2demo_heatmap_hexagon_world extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        // pitch: 58.5,
        pitch: 43,
        center: [120.13383079335335, 29.651873105004427],
        zoom: 7.068989519212174,
        viewMode: '3D',
        style: 'blank',
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/bmw-prod/3dadb1f5-8f54-4449-8206-72db6e142c40.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const layer = new HeatmapLayer({
            autoFit: true,
          })
            .source(data, {
              transforms: [
                {
                  type: 'hexagon',
                  size: 5 * 100000,
                },
              ],
            })
            .shape('circle')
            .active(false)
            .color('#aaa')
            .style({
              coverage: 0.7,
              angle: 0,
              opacity: 1.0,
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
