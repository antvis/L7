import { PointLayer } from '@l7/layers';
import { Scene } from '@l7/scene';
import * as dat from 'dat.gui';
import * as React from 'react';
import data from './data2.json';

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
    const scene = new Scene({
      id: 'map',
      type: 'mapbox',
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [120.19382669582967, 30.258134],
      pitch: 0,
      zoom: 2,
    });
    const pointLayer = new PointLayer({});

    // TODO: new GeoJSONSource()
    pointLayer.source(data);
    // .size('mag', [2, 10])
    // .color('mag', [
    //   '#2E8AE6',
    //   '#69D1AB',
    //   '#DAF291',
    //   '#FFD591',
    //   '#FF7A45',
    //   '#CF1D49',
    // ]);
    scene.addLayer(pointLayer);
    scene.render();

    this.scene = scene;

    /*** 运行时修改样式属性 ***/

    const gui = new dat.GUI();
    this.gui = gui;
    const pointFolder = gui.addFolder('Point 样式属性');
    pointFolder
      .addColor(pointLayer.styleOptions, 'pointColor')
      .onChange((pointColor: [number, number, number]) => {
        pointLayer.style({
          pointColor,
        });
        scene.render();
      });

    pointFolder
      .add(pointLayer.styleOptions, 'strokeWidth', 1, 10, 0.1)
      .onChange((strokeWidth: number) => {
        pointLayer.style({
          strokeWidth,
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
