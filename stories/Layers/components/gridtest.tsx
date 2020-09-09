import { HeatmapLayer, Marker, PointLayer, Scene, IPoint } from '@antv/l7';
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
      map: new GaodeMap({
        token: '8e2254ff173dbf7ff5029e9c9df20bc3',
        pitch: 56.499,
        center: [114.07737552216226, 22.542656745583486],
        rotation: 39.19,
        zoom: 12.47985,
      }),
    });

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/513add53-dcb2-4295-8860-9e7aa5236699.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const layer = new HeatmapLayer({})
            .source(data, {
              transforms: [
                {
                  type: 'grid',
                  size: 200,
                  field: 'h12',
                  method: 'sum',
                },
              ],
            })
            .size('sum', [0, 600])
            .shape('squareColumn')
            .style({
              coverage: 1,
              angle: 0,
              opacity: 1.0,
            })
            .color(
              'sum',
              [
                'rgba(0,18,255,1)',
                'rgba(0,144,255,0.9)',
                'rgba(0,222,254,0.8)',
                'rgba(22,226,159,0.6)',
              ].reverse(),
            );
          scene.addLayer(layer);
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
