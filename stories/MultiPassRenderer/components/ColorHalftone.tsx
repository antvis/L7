// @ts-ignore
import { PolygonLayer, PointLayer, Scene } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
import * as dat from 'dat.gui';
import * as React from 'react';

export default class ColorHalftone extends React.Component {
  private gui: dat.GUI;
  private $stats: Node;
  // @ts-ignore
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
      // enablePicking: true,
      enablePicking: false,
      // enableHighlight: true,
      enableMultiPassRenderer: true,
      passes: [
        [
          'colorHalftone',
          {
            size: 8,
          },
        ],
      ],
    });

    layer
      .source(data)
      .size('name', [0, 10000, 50000, 30000, 100000])
      .active(true)
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

    let pointLayer = new PointLayer({ zIndex: 2 })
      .source([{ lng: 130, lat: 30 }], {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      })
      .shape('circle')
      .size(20)
      .color('red');
    scene.addLayer(pointLayer);

    this.scene = scene;

    /*** 运行时修改样式属性 ***/
    const gui = new dat.GUI();
    this.gui = gui;
    const styleOptions = {
      angle: 0,
      size: 8,
      centerX: 0.5,
      centerY: 0.5,
    };
    const pointFolder = gui.addFolder('ColorHalftone 配置');
    pointFolder
      .add(styleOptions, 'centerX', 0, 1)
      .onChange((centerX: number) => {
        layer.style({
          passes: [
            [
              'colorHalftone',
              {
                center: [centerX, styleOptions.centerY],
              },
            ],
          ],
        });
        scene.render();
      });
    pointFolder
      .add(styleOptions, 'centerY', 0, 1)
      .onChange((centerY: number) => {
        layer.style({
          passes: [
            [
              'colorHalftone',
              {
                center: [styleOptions.centerX, centerY],
              },
            ],
          ],
        });
        scene.render();
      });
    pointFolder.add(styleOptions, 'angle', 0, 10).onChange((angle: number) => {
      layer.style({
        passes: [
          [
            'colorHalftone',
            {
              angle,
            },
          ],
        ],
      });
      scene.render();
    });
    pointFolder.add(styleOptions, 'size', 0, 20).onChange((size: number) => {
      layer.style({
        passes: [
          [
            'colorHalftone',
            {
              size,
            },
          ],
        ],
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
