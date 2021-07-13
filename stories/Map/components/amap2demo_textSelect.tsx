import { ILngLat, PointLayer, PolygonLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';
export default class Amap2demo_textSelect extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    let fontFamily = 'iconfont';
    let fontPath =
      '//at.alicdn.com/t/font_2534097_99x8u6zpili.woff2?t=1621842922496';

    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [120, 30.258134],
        pitch: 0,
        style: 'light',
        zoom: 3,
        // viewMode: "3D",
        // mask
      }),
    });
    this.scene = scene;
    scene.addIconFont('icon1', '&#xe98c;');
    // scene.addIconFont("icon2", "&#xe64c;")

    // scene.addIconFonts([
    //   ['icon1', '&#xe64b;'],
    //   ['icon2', '&#xe64c;'],
    // ]);

    scene.addFontFace(fontFamily, fontPath);
    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/bmw-prod/70408903-80db-4278-a318-461604acb2df.json',
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data.list[0]);
          const pointLayer = new PointLayer({})
            .source(data.list, {
              parser: {
                type: 'json',
                x: 'j',
                y: 'w',
              },
            })
            .shape('icon', 'text')
            .size(12)
            .color('w', ['#f00', '#f00', '#0f0'])
            .style({
              textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
              textOffset: [-10, 0], // 文本相对锚点的偏移量 [水平, 垂直]
              spacing: 2, // 字符间距
              padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
              stroke: '#ffffff', // 描边颜色
              strokeWidth: 0.3, // 描边宽度
              strokeOpacity: 1.0,
              fontFamily,
              // fontFamily: "Times New Roman",
              iconfont: true,
              // textAllowOverlap: true,
            });
          scene.addLayer(pointLayer);
          pointLayer.boxSelect([0, 0, 155, 278], (f) => {
            console.log('======');
            console.log(f);
          });
        });

      fetch(
        'https://gw.alipayobjects.com/os/rmsportal/oVTMqfzuuRFKiDwhPSFL.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const pointLayer = new PointLayer({})
            .source(data.list, {
              parser: {
                type: 'json',
                x: 'j',
                y: 'w',
              },
            })
            .shape('m', 'text')
            .size(12)
            .color('w', ['#0e0030', '#0e0030', '#0e0030'])
            .style({
              textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
              textOffset: [0, 0], // 文本相对锚点的偏移量 [水平, 垂直]
              spacing: 2, // 字符间距
              padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
              stroke: '#ffffff', // 描边颜色
              strokeWidth: 0.3, // 描边宽度
              strokeOpacity: 1.0,
              // textAllowOverlap: true
            });
          scene.addLayer(pointLayer);
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
