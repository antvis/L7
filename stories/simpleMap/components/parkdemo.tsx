// @ts-nocheck
import {
  Scene,
  PolygonLayer,
  ImageLayer,
  PointLayer,
  Map,
} from '@antv/l7-mini';
import * as React from 'react';

export default class Demo extends React.Component {
  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Map({
        center: [500, 500],
        pitch: 0,
        zoom: 2.5,
        version: 'SIMPLE',
        mapSize: 1000,
        maxZoom: 4,
        minZoom: 2,
      }),
    });
    scene.setBgColor('rgb(94, 182, 140)');

    const textlayer = new PointLayer({ zIndex: 2 })
      .source(
        [
          {
            x: 470,
            y: 520,
            t: '库布齐',
          },
          {
            x: 490,
            y: 580,
            t: '阿拉善',
          },
          {
            x: 530,
            y: 530,
            t: '鄂尔多斯',
          },
          {
            x: 545,
            y: 480,
            t: '武威',
          },
          {
            x: 490,
            y: 470,
            t: '黄山洋湖',
          },
        ],
        {
          parser: {
            type: 'json',
            x: 'x',
            y: 'y',
          },
        },
      )
      .shape('t', 'text')
      .size(14)
      .active(true)
      .color('#0e0030')
      .style({
        // textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
        // textOffset: [ 0, 0 ], // 文本相对锚点的偏移量 [水平, 垂直]
        spacing: 2, // 字符间距
        // padding: [ 1, 1 ], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
        stroke: '#ffffff', // 描边颜色
        strokeWidth: 1.5, // 描边宽度
        // strokeOpacity: 1.0,
        textAllowOverlap: true,
      });

    const imagelayer = new ImageLayer({}).source(
      'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*I0X5R4jAUQ4AAAAAAAAAAAAAARQnAQ',
      {
        parser: {
          type: 'image',
          extent: [360, 400, 640, 600],
        },
      },
    );

    scene.on('loaded', () => {
      // scene.addLayer(imagelayer);

      scene.addLayer(textlayer);
      // console.log(scene.mapService.getSize())
      // setTimeout(() => {
      //   console.log(scene.mapService.getSize())
      // }, 2000 )
      // console.log(scene.mapService.getCenter());
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
