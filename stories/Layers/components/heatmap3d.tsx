import { HeatmapLayer, Scene } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
// @ts-ignore
import * as React from 'react';

export default class HeatMapLayerDemo extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const response = await fetch(
      'https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json',
    );
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        center: [121.268, 30.3628],
        pitch: 0,
        style: 'dark',
        zoom: 2,
      }),
    });
    const data = await response.json();

    const layer = new HeatmapLayer();
    layer
      .source(data)
      .shape('heatmap3D')
      .size('mag', [0, 1.0]) // weight映射通道
      .style({
        intensity: 2,
        radius: 20,
        opacity: 1.0,
        rampColors: {
          colors: [
            '#FF4818',
            '#F7B74A',
            '#FFF598',
            '#91EABC',
            '#2EA9A1',
            '#206C7C',
          ].reverse(),
          positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
        },
      });
    scene.addLayer(layer);
    scene.on('loaded', () => {
      console.log('scene loaded');
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
