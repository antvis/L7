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
    const response = await fetch(
      'https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json',
    );
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        center: [121.268, 30.3628],
        pitch: 0,
        style: 'dark',
        zoom: 12,
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
            'rgba(33,102,172,0)',
            'rgb(103,169,207)',
            'rgb(209,229,240)',
            'rgb(253,219,199)',
            'rgb(239,138,98)',
            'rgb(178,24,43)',
          ],
          positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
        },
      });
    scene.addLayer(layer);
    scene.on('zoom', () => {
      console.log(scene.getZoom());
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
