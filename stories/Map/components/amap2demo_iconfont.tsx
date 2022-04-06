import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Mapbox } from '@antv/l7-maps';
import * as React from 'react';
export default class Amap2demo_iconfont extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        pitch: 20,
        style: 'light',
        center: [120, 20],
        zoom: 3,
      }),
    });
    this.scene = scene;
    const fontFamily = 'iconfont';
    // 指定 iconfont 字体文件
    const fontPath =
      '//at.alicdn.com/t/font_2534097_fcae9o2mxbv.woff2?t=1622200439140';
    // 全局添加资源
    scene.addFontFace(fontFamily, fontPath);
    // 全局添加 iconfont 字段的映射;
    scene.addIconFont('icon1', '&#xe6d4;');
    scene.on('loaded', () => {
      const imageLayer = new PointLayer()
        .source(
          [
            {
              j: 118.234433,
              w: 35.007936,
              icon: 'icon1',
              value: 10,
              name: 'AA',
              type: 'dibiaoshui',
            },
          ],
          {
            parser: {
              type: 'json',
              x: 'j',
              y: 'w',
            },
          },
        )
        .color('#44ff00')
        .shape('icon', 'text')
        // .shape('circle')
        // .size(30)
        .size(30)
        .style({
          // textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          // textOffset: [ 40, 0 ], // 文本相对锚点的偏移量 [水平, 垂直]
          padding: [0, 0], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
          stroke: '#ffffff', // 描边颜色
          fontFamily,
          iconfont: true,
          textAllowOverlap: true,
        });
      scene.addLayer(imageLayer);
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
