// @ts-ignore
import { PolygonLayer } from '@l7/layers';
// @ts-ignore
import { Scene } from '@l7/scene';
import * as dat from 'dat.gui';
import * as React from 'react';

export default class AdvancedAPI extends React.Component {
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
    const layer = new PolygonLayer({
      enablePicking: true,
      enableHighlight: true,
      highlightColor: [0, 0, 1, 1],
      onHover: (pickedFeature) => {
        // tslint:disable-next-line:no-console
        console.log(pickedFeature);
      },
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
        opacity: 0.8,
      });
    scene.addLayer(layer);
    scene.render();

    this.scene = scene;

    /*** 运行时修改样式属性 ***/
    const gui = new dat.GUI();
    this.gui = gui;
    const styleOptions = {
      enablePicking: true,
      enableHighlight: true,
      highlightColor: [0, 0, 255],
    };
    const pointFolder = gui.addFolder('拾取 & 高亮');
    // pointFolder
    //   .add(styleOptions, 'enablePicking')
    //   .onChange((enablePicking: boolean) => {
    //     // FIXME: 该配置项会影响到初始化阶段 PixelPickingPass 的添加，暂不支持在运行时更改
    //     layer.style({
    //       enablePicking,
    //     });
    //     scene.render();
    //   });
    pointFolder
      .add(styleOptions, 'enableHighlight')
      .onChange((enableHighlight: boolean) => {
        layer.style({
          enableHighlight,
        });
        scene.render();
      });
    pointFolder
      .addColor(styleOptions, 'highlightColor')
      .onChange((highlightColor: number[]) => {
        const [r, g, b] = highlightColor.map((c) => c / 255);
        layer.style({
          highlightColor: [r, g, b, 1],
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
