// @ts-nocheck
// @ts-ignore
import { Scene, Source } from '@antv/l7';
import { PointLayer } from '@antv/l7-layers';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class Demo extends React.Component {
  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [110.19382669582967, 30.258134],
        pitch: 0,
        zoom: 2,
      }),
    });

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
              lng: 120,
              lat: 30,
              icon: 'icon1',
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
        .color('#44ff00')
        .shape('icon', 'text')
        .size(30)
        .style({
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
      <div
        id="map"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      ></div>
    );
  }
}
