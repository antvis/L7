// @ts-ignore
import { Scene } from '@antv/l7';
import { PolygonLayer, PointLayer } from '@antv/l7-layers';
import { Map } from '@antv/l7-maps';
import * as React from 'react';

export default class ScaleComponent extends React.Component {
  private scene: Scene;
  private el: HTMLCanvasElement;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  setCanvas() {
    this.el.width = 400;
    this.el.height = 300;
    this.el.style.width = '400px';
    this.el.style.height = '300px';
  }

  public async componentDidMount() {
    this.setCanvas();
    const scene = new Scene({
      id: 'map',
      // @ts-ignore
      ctx: this.el.getContext('webgl') as WebGLRenderingContext,
      map: new Map({
        hash: true,
        center: [110.19382669582967, 30.258134],
        pitch: 0,
        zoom: 2,
      }),
    });
    fetch(
      'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json',
    )
      .then((res) => res.json())
      .then((data) => {
        const textLayer = new PointLayer({})
          .source(
            [
              {
                lng: 120.5,
                lat: 31.3,
                iconType: 'cloud',
                iconColor: '#F0F8FF',
                weather: '多云 - 今日适宜出门',
                textOffset: [-40, 0],
              },
            ],
            {
              parser: {
                type: 'json',
                x: 'lng',
                y: 'lat',
              },
            },
          )
          .shape('weather', 'text')
          .size(16)
          .color('#f00')
          .style({
            textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
            textOffset: [0, 0], // 文本相对锚点的偏移量 [水平, 垂直]
            spacing: 2, // 字符间距
            padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
            fontFamily: 'Times New Roman',
            textAllowOverlap: true,
          });
        // scene.addLayer(textLayer);

        const layer = new PolygonLayer({
          name: '01',
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
          .select(true)
          .style({
            opacity: 1.0,
          });
        // scene.addLayer(layer);
      });

    let originData = [
      {
        lng: 121.107846,
        lat: 30.267069,
      },
      {
        lng: 121.107,
        lat: 30.267069,
      },
    ];

    scene.on('loaded', () => {
      let pointlayer = new PointLayer()
        .source(originData, {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        })
        .shape('circle')
        .color('rgba(255, 0, 0, 1.0)')
        // .size(10)
        .size([10, 10, 100]);
      scene.addLayer(pointlayer);
    });
    // console.log('pointlayer')
    // scene.addLayer(pointlayer);
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
      >
        <canvas
          style={{
            position: 'absolute',
            top: 0,
            border: '1px solid',
          }}
          ref={(el) => (this.el = el as HTMLCanvasElement)}
        ></canvas>
      </div>
    );
  }
}
