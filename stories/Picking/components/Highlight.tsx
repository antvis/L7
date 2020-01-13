// @ts-ignore
import { PolygonLayer, Scene, PointLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
import * as dat from 'dat.gui';
import * as React from 'react';

export default class Highlight extends React.Component {
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
    const response2 = await fetch(
      'https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json',
    );
    const pointsData = await response2.json();
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        style: 'dark',
        center: [110.19382669582967, 50.258134],
        pitch: 0,
        zoom: 3,
      }),
    });
    const layer = new PolygonLayer({
      enablePicking: true,
      enableHighlight: true,
      highlightColor: [0, 0, 1, 1],
      onHover: (pickedFeature) => {
        // tslint:disable-next-line:no-console
        // console.log(pickedFeature);
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
        opacity: 1.0,
      });
    scene.addLayer(layer);
    const pointLayer = new PointLayer()
      .source(pointsData, {
        cluster: true,
      })
      .shape('circle')
      .scale('point_count', {
        type: 'quantile',
      })
      .size('point_count', [5, 10, 15, 20, 25])
      .animate(false)
      .active(true)
      .color('yellow')
      .style({
        opacity: 0.5,
        strokeWidth: 1,
      });
    scene.addLayer(pointLayer);
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
