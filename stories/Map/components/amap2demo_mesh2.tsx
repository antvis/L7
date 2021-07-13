import { PointLayer, Scene, PolygonLayer, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';
export default class Amap2demo_mesh2 extends React.Component {
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
      '//at.alicdn.com/t/font_2534097_bl34aphh10n.woff2?t=1622180820063';
    scene.addIconFont('up', '&#xe61d;');
    scene.addIconFont('down', '&#xe61e;');
    scene.addFontFace(fontFamily, fontPath);

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/bmw-prod/41802695-0f7e-4a81-ab16-539c4e39df0d.json',
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
            .size(15)
            .color('count', (n) => (n > 0 ? '#0f0' : '#f00'))
            .style({
              textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
              textOffset: [30, 5],
              padding: [2, 2],
              fontFamily,
              iconfont: true,
              // textAllowOverlap: true
            });
          scene.addLayer(pointLayer);

          const textLayer = new PointLayer({
            zIndex: 10,
          })
            .source(data)
            .shape('count', 'text')
            .size(12)
            .color('count', (n) => (n > 0 ? '#0f0' : '#f00'))
            .style({
              textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
              textOffset: [40, 10],
              padding: [1, 1],
            });
          scene.addLayer(textLayer);
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
