import { PolygonLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

function convertRGB2Hex(rgb: number[]) {
  return (
    '#' + rgb.map((r) => ('0' + Math.floor(r).toString(16)).slice(-2)).join('')
  );
}

export default class Polygon3D extends React.Component {
  private gui: dat.GUI;
  private $stats: Node;
  private scene: Scene;

  public componentWillUnmount() {
    if (this.gui) {
      this.gui.destroy();
    }
    if (this.$stats) {
      document.body.removeChild(this.$stats);
    }
    this.scene.destroy();
  }

  public async componentDidMount() {
    const response = await fetch(
      'https://gw.alipayobjects.com/os/basement_prod/972566c5-a2b9-4a7e-8da1-bae9d0eb0117.json',
    );
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        pitch: 0,
        style: 'dark',
        center: [114.050008, 22.529272],
        zoom: 14.1,
      }),
    });

    const layer = new PolygonLayer({})
      .source(await response.json())
      .shape('extrude')
      .size('h20', [10, 12, 16, 20, 26, 50])
      .active({ color: 'blue' })
      .color('h20', [
        '#816CAD',
        '#A67FB5',
        '#C997C7',
        '#DEB8D4',
        '#F5D4E6',
        '#FAE4F1',
        '#FFF3FC',
      ])
      .style({
        opacity: 1.0,
      });
    scene.addLayer(layer);
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
