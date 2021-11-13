import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import * as dat from 'dat.gui';
import * as React from 'react';
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
      map: new GaodeMap({
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
      .shape(['s', 'm'], (...args) => args.map((i) => `${i}\n`).join(''))
      // .shape('circle')
      .size(18)
      .filter('t', (t) => {
        return t < 5;
      })
      .color('#f00')
      .style({
        textAllowOverlap: false,
        // fontWeight: 200,
        // textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
        // textOffset: [0, 0], // 文本相对锚点的偏移量 [水平, 垂直]
        // spacing: 2, // 字符间距
        // padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
        stroke: '#fff', // 描边颜色
        strokeWidth: 1, // 描边宽度
        // strokeOpacity: 1.0,
      });
    scene.addLayer(pointLayer);
    this.scene = scene;

    const gui = new dat.GUI();
    this.gui = gui;
    const styleOptions = {
      field: 'w',
      strokeWidth: 0,
      fontWeight: 500,
      stroke: '#fff',
      textAllowOverlap: false,
      opacity: 1,
      size: 8,
      color: '#fff',
      halo: 0.5,
      gamma: 2.0,
    };
    const rasterFolder = gui.addFolder('文本可视化');
    rasterFolder
      .add(styleOptions, 'field', ['w', 's', 'l', 'm', 'j', 'h'])
      .onChange((anchor: string) => {
        pointLayer.shape(anchor, 'text');
        scene.render();
      });

    rasterFolder
      .add(styleOptions, 'strokeWidth', 0, 10)
      .onChange((strokeWidth: number) => {
        pointLayer.style({
          strokeWidth,
        });
        // pointLayer.setData(pointsData.list.slice(0, strokeWidth));
        scene.render();
      });

    rasterFolder.add(styleOptions, 'size', 5, 30).onChange((size: number) => {
      pointLayer.size(size);
      // pointLayer.setData(pointsData.list.slice(0, strokeWidth));
      scene.render();
    });

    rasterFolder.add(styleOptions, 'gamma', 0, 10).onChange((gamma: number) => {
      pointLayer.style({
        gamma,
      });
      // pointLayer.setData(pointsData.list.slice(0, strokeWidth));
      scene.render();
    });

    rasterFolder.add(styleOptions, 'halo', 0, 10).onChange((halo: number) => {
      pointLayer.style({
        halo,
      });
      // pointLayer.setData(pointsData.list.slice(0, strokeWidth));
      scene.render();
    });
    rasterFolder
      .add(styleOptions, 'textAllowOverlap', 0, 10)
      .onChange((textAllowOverlap: boolean) => {
        pointLayer.style({
          textAllowOverlap,
        });
        scene.render();
      });
    rasterFolder
      .add(styleOptions, 'opacity', 0, 1)
      .onChange((opacity: number) => {
        pointLayer.style({
          opacity,
        });
        scene.render();
        setTimeout(() => {
          scene.render();
        }, 10);
      });
    rasterFolder.addColor(styleOptions, 'color').onChange((color: string) => {
      pointLayer.color(color);
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
