import { HeatmapLayer, Scene } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
// @ts-ignore
import * as React from 'react';

export default class HeatMapLayerDemo extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        style: 'dark',
        pitch: 8.5,
        center: [116.49434030056, 39.868073421167621],
        zoom: 13,
      }),
    });
    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/c3f8bda2-081b-449d-aa9f-9413b779205b.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const layer = new HeatmapLayer({
            autoFit: true,
          })
            .source(data, {
              parser: {
                type: 'json',
                x: 'lng',
                y: 'lat',
              },
            })
            .size('count', [0, 1])
            .shape('heatmap')
            // weight映射通道
            .style({
              intensity: 10,
              radius: 20,
              opacity: 1.0,
              rampColors: {
                colors: [
                  '#2E8AE6',
                  '#69D1AB',
                  '#DAF291',
                  '#FFD591',
                  '#FF7A45',
                  '#CF1D49',
                ],
                positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
              },
            });
          scene.addLayer(layer);
          setTimeout(() => {
            layer.style({
              rampColors: {
                colors: [
                  '#fee5d9',
                  '#fcbba1',
                  '#fc9272',
                  '#fb6a4a',
                  '#de2d26',
                  '#a50f15',
                ],
                positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
              },
            });
            scene.render();
            console.log('更新完成');
          }, 2000);
        });
    });

    this.scene = scene;
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
