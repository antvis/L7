import { HeatmapLayer, PointLayer, Scene } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import * as dat from 'dat.gui';
import * as React from 'react';
export default class HexagonLayerDemo extends React.Component {
  // @ts-ignore
  private scene: Scene;
  private gui: dat.GUI;

  public componentWillUnmount() {
    this.scene.destroy();
    if (this.gui) {
      this.gui.destroy();
    }
  }
  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        pitch: 0,
        style: 'blank',
        center: [140.067171, 36.26186],
        zoom: 0,
        maxZoom: 0,
      }),
    });
    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/bmw-prod/3dadb1f5-8f54-4449-8206-72db6e142c40.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const pointLayer = new HeatmapLayer({
            autoFit: true,
          })
            .source(data, {
              transforms: [
                {
                  type: 'hexagon',
                  size: 500000,
                  field: 'name',
                  method: 'mode',
                },
              ],
            })
            .shape('hexagon') // 支持 circle, hexagon,triangle
            .color('mode', ['#ffffe5','#fff7bc','#fee391','#fec44f','#fe9929','#ec7014','#cc4c02','#993404','#662506'])
            .active(false)
            .style({
              coverage: 0.7,
              // angle: 0.5,
              opacity: 1.0,
            });
          scene.addLayer(pointLayer);
          console.log(pointLayer.getSource());
          this.scene = scene;
        });
    });
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
