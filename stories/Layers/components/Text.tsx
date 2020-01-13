import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import * as React from 'react';
import * as dat from 'dat.gui';
// @ts-ignore
import data from '../data/data.json';
export default class TextLayerDemo extends React.Component {
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
    const response = await fetch(
      'https://gw.alipayobjects.com/os/rmsportal/oVTMqfzuuRFKiDwhPSFL.json',
    );
    const pointsData = await response.json();

    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        center: [120.19382669582967, 30.258134],
        pitch: 0,
        style: 'dark',
        zoom: 3,
      }),
    });
    // scene.on('loaded', () => {
    const pointLayer = new PointLayer({})
      .source(pointsData.list, {
        parser: {
          type: 'json',
          x: 'j',
          y: 'w',
        },
      })
      .shape('m', 'text')
      .size(12)
      .color('#fff')
      .style({
        // fontWeight: 200,
        // textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
        // textOffset: [0, 0], // 文本相对锚点的偏移量 [水平, 垂直]
        // spacing: 2, // 字符间距
        // padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
        // stroke: 'red', // 描边颜色
        // strokeWidth: 2, // 描边宽度
        // strokeOpacity: 1.0,
      });
    scene.addLayer(pointLayer);

    this.scene = scene;

    const gui = new dat.GUI();
    this.gui = gui;
    const styleOptions = {
      textAnchor: 'center',
      strokeWidth: 1,
    };
    const rasterFolder = gui.addFolder('栅格可视化');
    rasterFolder
      .add(styleOptions, 'textAnchor', [
        'center',
        'left',
        'right',
        'top',
        'bottom',
        'top-left',
        'bottom-right',
        'bottom-left',
        'top-right',
      ])
      .onChange((anchor: string) => {
        pointLayer.style({
          textAnchor: anchor,
        });
        scene.render();
      });
    // });
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
