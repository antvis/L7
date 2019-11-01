import { HeatMapLayer } from '@l7/layers';
import { Scene } from '@l7/scene';
// @ts-ignore
import * as React from 'react';

export default class HeatMapLayerDemo extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const response = await fetch(
      'https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json',
    );
    const scene = new Scene({
      center: [121.268, 30.3628],
      id: 'map',
      pitch: 0,
      type: 'mapbox',
      style: 'mapbox://styles/mapbox/dark-v10',
      zoom: 2,
    });
    const layer = new HeatMapLayer({});
    layer
      .source(await response.json())
      .size('mag', [0, 1]) // weight映射通道
      .style({
        intensity: 2,
        radius: 20,
        opacity: 1,
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
    console.log(layer);
    // requestAnimationFrame(run);
    scene.render();
    this.scene = scene;
    // function run() {
    //   scene.render();
    //   requestAnimationFrame(run);
    // }
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
