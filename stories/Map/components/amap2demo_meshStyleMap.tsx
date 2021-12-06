import { PointLayer, Scene, PolygonLayer, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';
export default class Amap2demo_meshStyleMap extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        style: 'dark',
        pitch: 50,
        center: [118.8, 32.056],
        zoom: 11.5,
      }),
    });

    this.scene = scene;
    let fontFamily = 'iconfont';
    let fontPath =
      '//at.alicdn.com/t/font_2534097_x6rsov3i1g.woff2?t=1622107341225';
    scene.addIconFont('icon', '&#xe69e;');
    scene.addFontFace(fontFamily, fontPath);

    let colors = [
      '#87CEFA',
      '#00BFFF',

      '#7FFFAA',
      '#00FF7F',
      '#32CD32',

      '#F0E68C',
      '#FFD700',

      '#FF7F50',
      '#FF6347',
      '#FF0000',
    ];

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/bmw-prod/94763191-2816-4c1a-8d0d-8bcf4181056a.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const filllayer = new PolygonLayer({
            name: 'fill',
            zIndex: 3,
          })
            .source(data)
            // .shape('fill')
            .shape('extrude')
            // .color('#0ff')
            .color('unit_price', colors)
            .size('unit_price', (unit_price: any) => unit_price * 50)
            // .size(6000000)
            .style({
              // opacity: ['unit_price', (unit_price: any) => {
              //   return unit_price/100000
              // }],
              // opacity: ['unit_price', [0, 1]],
              pickLight: true,
            })
            .active(true);
          scene.addLayer(filllayer);

          // const linelayer = new LineLayer({
          //   zIndex: 5,
          //   name: 'line2',
          // })
          //   .source(data)
          //   .shape('line')
          //   .size(1)
          //   .color('#fff')
          //   .style({
          //     opacity: 0.3,
          //   });
          // scene.addLayer(linelayer);

          // const pointLayer = new PointLayer({
          //   zIndex: 10,
          // })
          //   .source(data)
          //   .shape('icon', 'text')
          //   .size(30)
          //   .color('count', (t) => {
          //     let c = Number(t.replace('℃', ''));
          //     return colors[Math.floor(((c - 18) / 16) * 10)];
          //   })
          //   .style({
          //     textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          //     textOffset: [30, 5],
          //     padding: [2, 2],
          //     fontFamily,
          //     iconfont: true,
          //   });
          // scene.addLayer(pointLayer);

          // const tempertureLayer = new PointLayer({
          //   zIndex: 10,
          // })
          //   .source(data)
          //   .shape('unit_price', 'text')
          //   .size(12)
          //   .color('#fff')
          //   .style({
          //     textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          //     textOffset: ['unit_price', (unit_price: any) => [0, unit_price/150]],
          //     padding: [1, 1],
          //     textAllowOverlap: false,
          //   });
          // scene.addLayer(tempertureLayer);
        });
    });
  }

  public render() {
    return (
      <>
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
      </>
    );
  }
}
