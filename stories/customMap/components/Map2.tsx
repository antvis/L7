// @ts-ignore
import { Scene } from '@antv/l7';
import {
  PolygonLayer,
  PointLayer,
  LineLayer,
  HeatmapLayer,
} from '@antv/l7-layers';
import { Map } from '@antv/l7-maps';
import * as React from 'react';

export default class ScaleComponent extends React.Component {
  private scene: Scene;
  private el: HTMLCanvasElement;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public setCanvas() {
    this.el.width = 400;
    this.el.height = 300;
    this.el.style.width = '300px';
    this.el.style.height = '150px';
    this.el.style.zIndex = '10';
    this.el.style.position = 'absolute';
    this.el.style.top = '0';
    this.el.style.left = '0';
    this.el.style.border = '1px solid';
  }

  public async componentDidMount() {
    this.setCanvas();

    const scene = new Scene({
      id: 'map',
      // canvas: this.el,
      map: new Map({
        hash: true,
        center: [110.19382669582967, 30.258134],
        pitch: 0,
        zoom: 2,
      }),
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
    let layer = new PointLayer()
      .source(originData, {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      })
      .shape('circle')
      .color('rgba(255, 0, 0, 1.0)')
      .size(10);

    const polygondata = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            testOpacity: 0.4,
          },
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [110.5224609375, 32.731840896865684],
                  [113.0712890625, 32.731840896865684],
                  [113.0712890625, 34.56085936708384],
                  [110.5224609375, 34.56085936708384],
                  [110.5224609375, 32.731840896865684],
                ],
                [
                  [111.26953125, 33.52307880890422],
                  [111.26953125, 34.03445260967645],
                  [112.03857421875, 34.03445260967645],
                  [112.03857421875, 33.52307880890422],
                  [111.26953125, 33.52307880890422],
                ],
              ],
              [
                [
                  [115.04882812499999, 34.379712580462204],
                  [114.9609375, 33.46810795527896],
                  [115.8837890625, 33.50475906922609],
                  [115.86181640625001, 34.379712580462204],
                  [115.04882812499999, 34.379712580462204],
                ],
              ],
            ],
          },
        },
        {
          type: 'Feature',
          properties: {
            testOpacity: 0.8,
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [113.8623046875, 30.031055426540206],
                [116.3232421875, 30.031055426540206],
                [116.3232421875, 31.090574094954192],
                [113.8623046875, 31.090574094954192],
                [113.8623046875, 30.031055426540206],
              ],
              [
                [117.26806640625, 32.13840869677249],
                [118.36669921875, 32.13840869677249],
                [118.36669921875, 32.47269502206151],
                [117.26806640625, 32.47269502206151],
                [117.26806640625, 32.13840869677249],
              ],
            ],
          },
        },
      ],
    };

    const polygonlayer = new PolygonLayer({
      // autoFit: true,
    })
      .source(polygondata)
      .shape('fill')
      .color('red')
      .style({
        opacity: 1.0,
      });

    let lineData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'MultiLineString',
            coordinates: [
              [
                [20, 30],
                [150, 30],
              ],
            ],
          },
        },
      ],
    };

    const linelayer = new LineLayer()
      .source(lineData)
      .size(8)
      .shape('line')
      .color('rgb(20, 180, 90)');

    scene.on('loaded', () => {
      console.log('loaded ');
      scene.addLayer(layer);
      scene.addLayer(linelayer);
      scene.addLayer(polygonlayer);
    });

    fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/3dadb1f5-8f54-4449-8206-72db6e142c40.json',
    )
      .then((res) => res.json())
      .then((data) => {
        var heatlayer = new HeatmapLayer()
          .source(data, {
            transforms: [
              {
                type: 'hexagon',
                size: 5 * 100000,
              },
            ],
          })
          .shape('circle')
          .active(false)
          .color('#aaa')
          .style({
            coverage: 0.7,
            angle: 0,
            opacity: 1.0,
          });
        console.log('add heatLayer');
        scene.addLayer(heatlayer);
      });

    // fetch(
    //   'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json',
    // )
    //   .then((res) => res.json())
    //   .then((data) => {
    //     const textLayer = new PointLayer({})
    //       .source(
    //         [
    //           {
    //             lng: 120.5,
    //             lat: 31.3,
    //             iconType: 'cloud',
    //             iconColor: '#F0F8FF',
    //             weather: '多云 - 今日适宜出门',
    //             textOffset: [-40, 0],
    //           },
    //         ],
    //         {
    //           parser: {
    //             type: 'json',
    //             x: 'lng',
    //             y: 'lat',
    //           },
    //         },
    //       )
    //       .shape('weather', 'text')
    //       .size(16)
    //       .color('#f00')
    //       .style({
    //         textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
    //         textOffset: [0, 0], // 文本相对锚点的偏移量 [水平, 垂直]
    //         spacing: 2, // 字符间距
    //         padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
    //         fontFamily: 'Times New Roman',
    //         textAllowOverlap: true,
    //       });
    //     scene.addLayer(textLayer);

    //     const layer = new PolygonLayer({
    //       name: '01',
    //     });

    //     layer
    //       .source(data)
    //       .size('name', [0, 10000, 50000, 30000, 100000])
    //       .color('name', [
    //         '#2E8AE6',
    //         '#69D1AB',
    //         '#DAF291',
    //         '#FFD591',
    //         '#FF7A45',
    //         '#CF1D49',
    //       ])
    //       .shape('fill')
    //       .select(true)
    //       .style({
    //         opacity: 1.0,
    //       });
    //     scene.addLayer(layer);
    //   });
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
        <canvas ref={(el) => (this.el = el as HTMLCanvasElement)}></canvas>
      </div>
    );
  }
}
