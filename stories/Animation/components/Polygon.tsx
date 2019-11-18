// @ts-ignore
import { PolygonLayer } from '@l7/layers';
// @ts-ignore
import { Scene } from '@l7/scene';
import * as dat from 'dat.gui';
import * as React from 'react';

function convertRGB2Hex(rgb: number[]) {
  return (
    '#' + rgb.map((r) => ('0' + Math.floor(r).toString(16)).slice(-2)).join('')
  );
}

export default class Mapbox extends React.Component {
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
    const scene = new Scene({
      id: 'map',
      type: 'mapbox',
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [110.19382669582967, 50.258134],
      pitch: 0,
      zoom: 3,
    });
    this.scene = scene;
    const layer = new PolygonLayer({
      enablePicking: false,
    });

    layer
      .source(await response.json())
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
        opacity: 0.3,
      });
    scene.addLayer(layer);
    scene.render();
    /*** 运行时修改样式属性 ***/
    const gui = new dat.GUI();
    this.gui = gui;
    const styleOptions = {
      color: [0, 0, 0],
      featureRange: {
        startIndex: 0,
        endIndex: Infinity,
      },
    };
    const pointFolder = gui.addFolder('精确更新 feature');
    pointFolder.add(styleOptions.featureRange, 'startIndex', 0, 100, 1);
    pointFolder.add(styleOptions.featureRange, 'endIndex', 0, 100, 1);
    pointFolder.addColor(styleOptions, 'color').onChange((color: number[]) => {
      layer.color('name', [convertRGB2Hex(color)], {
        featureRange: {
          startIndex: styleOptions.featureRange.startIndex,
          endIndex: styleOptions.featureRange.endIndex,
        },
      });
      scene.render();
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
