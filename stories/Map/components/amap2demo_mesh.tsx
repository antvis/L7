import { PointLayer, Scene, PolygonLayer, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';
export default class Amap2demo_mesh extends React.Component {
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
        pitch: 40,
        center: [118.8, 32.056],
        zoom: 12.5,
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
            .shape('fill')
            .color('count', ['rgb(194, 143, 133)', 'rgb(148, 167, 192)'])
            // .color('count', [
            //   '#87CEFA',
            //   '#00BFFF',

            //   '#7FFFAA',
            //   '#00FF7F',
            //   '#32CD32',

            //   '#F0E68C',
            //   '#FFD700',

            //   '#FF7F50',
            //   '#FF6347',
            //   '#FF0000'
            // ])
            .style({
              opacity: 0.5,
            });
          scene.addLayer(filllayer);

          const linelayer = new LineLayer({
            zIndex: 5,
            name: 'line2',
          })
            .source(data)
            .shape('line')
            .size(1)
            .color('#fff')
            .style({
              opacity: 0.3,
            });
          scene.addLayer(linelayer);

          const pointLayer = new PointLayer({
            zIndex: 10,
          })
            .source(data)
            .shape('icon', 'text')
            .size(30)
            .color('count', (t) => {
              let c = Number(t.replace('℃', ''));
              return colors[Math.floor(((c - 18) / 16) * 10)];
            })
            .style({
              textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
              textOffset: [30, 5],
              padding: [2, 2],
              fontFamily,
              iconfont: true,
              // textAllowOverlap: true
            });
          scene.addLayer(pointLayer);

          const tempertureLayer = new PointLayer({
            zIndex: 10,
          })
            .source(data)
            .shape('count', 'text')
            .size(12)
            // .color('count', [
            //   '#87CEFA',
            //   '#00BFFF',

            //   '#7FFFAA',
            //   '#00FF7F',
            //   '#32CD32',

            //   '#F0E68C',
            //   '#FFD700',

            //   '#FF7F50',
            //   '#FF6347',
            //   '#FF0000'
            // ])
            .color('count', (t) => {
              let c = Number(t.replace('℃', ''));
              return colors[Math.floor(((c - 18) / 16) * 10)];
            })
            .style({
              textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
              textOffset: [35, 30],
              padding: [1, 1],
            });
          scene.addLayer(tempertureLayer);
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
