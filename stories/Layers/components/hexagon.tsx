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
        zoom: 3,

        maxZoom: 0,
      }),
    });
    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/7359a5e9-3c5e-453f-b207-bc892fb23b84.csv',
      )
        .then((res) => res.text())
        .then((data) => {
          const pointLayer = new HeatmapLayer({
            autoFit: true,
          })
            .source(data, {
              parser: {
                type: 'csv',
                x: 'lng',
                y: 'lat',
              },
              transforms: [
                {
                  type: 'grid',
                  size: 200000,
                  field: 'v',
                  method: 'sum',
                },
              ],
            })
            .size('sum', (value) => {
              return value * 20;
            })
            .shape('squareColumn')
            .color(
              'count',
              [
                '#FF4818',
                '#F7B74A',
                '#FFF598',
                '#FF40F3',
                '#9415FF',
                '#421EB2',
              ].reverse(),
            )
            .style({
              coverage: 1,
              angle: 0,
            });
          scene.addLayer(pointLayer);
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
