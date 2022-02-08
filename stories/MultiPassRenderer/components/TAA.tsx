// @ts-ignore
import { PolygonLayer, Scene } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
import * as dat from 'dat.gui';
import * as React from 'react';

export default class TAA extends React.Component {
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
      'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json',
    );
    const data = await response.json();
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        style: 'mapbox://styles/mapbox/streets-v9',
        center: [110.19382669582967, 50.258134],
        pitch: 0,
        zoom: 3,
      }),
    });
    const layer = new PolygonLayer({
      enablePicking: true,
      enableHighlight: true,
      enableMultiPassRenderer: true,
      enableTAA: true,
      jitterScale: 1,
    });

    layer
      .source(data)
      .size('name', [0, 10000, 50000, 30000, 100000])
      .color('name', [
        '#2E8AE6',
        '#69D1AB',
        '#DAF291',
        '#FFD591',
        '#FF7A45',
        '#CF1D49',
      ])
      .shape('fill')
      .style({
        opacity: 0.8,
      });

    scene.addLayer(layer);

    this.scene = scene;

    /*** 运行时修改样式属性 ***/
    const gui = new dat.GUI();
    this.gui = gui;
    const styleOptions = {
      jitterScale: 1,
    };
    const pointFolder = gui.addFolder('TAA 配置');
    pointFolder
      .add(styleOptions, 'jitterScale', 0, 100)
      .onChange((jitterScale: number) => {
        layer.style({
          jitterScale,
        });
        scene.render();
      });
    pointFolder.open();
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
