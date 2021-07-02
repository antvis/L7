import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';
export default class Amap2demo_textOffset extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [121, 30.5],
        pitch: 0,
        style: 'dark',
        zoom: 9,
        zooms: [8, 10],
      }),
    });
    let originData = [
      {
        lng: 120,
        lat: 30,
        iconType: 'sun',
        iconColor: '#FFA500',
        weather: '晴朗',
        textOffset: [10, 0],
      },
      {
        lng: 120.2,
        lat: 30.5,
        iconType: 'sun',
        iconColor: '#FFA500',
        weather: '晴朗 - 高温预警',
        textOffset: [-25, 0],
      },
      {
        lng: 121.5,
        lat: 31.4,
        iconType: 'cloud',
        iconColor: '#F0F8FF',
        weather: '多云',
        textOffset: [10, 0],
      },
      {
        lng: 120,
        lat: 31,
        iconType: 'cloud',
        iconColor: '#F0F8FF',
        weather: '多云 - 温度适宜',
        textOffset: [-25, 0],
      },
      {
        lng: 120.6,
        lat: 30.8,
        iconType: 'cloud',
        iconColor: '#F0F8FF',
        weather: '多云',
        textOffset: [10, 0],
      },
      {
        lng: 120.5,
        lat: 31.3,
        iconType: 'cloud',
        iconColor: '#F0F8FF',
        weather: '多云 - 今日适宜出门',
        textOffset: [-40, 0],
      },
      {
        lng: 121.3,
        lat: 30.2,
        iconType: 'smallRain',
        iconColor: '#6EA0FF',
        weather: '中雨转小雨',
        textOffset: [-10, 0],
      },
      {
        lng: 121,
        lat: 30.5,
        iconType: 'smallRain',
        iconColor: '#6EA0FF',
        weather: '小雨',
        textOffset: [10, 0],
      },
      {
        lng: 120.6,
        lat: 30,
        iconType: 'middleRain',
        iconColor: '#6495ED',
        weather: '中雨',
        textOffset: [10, 0],
      },
      {
        lng: 120.2,
        lat: 29.7,
        iconType: 'smallRain',
        iconColor: '#6EA0FF',
        weather: '小雨',
        textOffset: [10, 0],
      },
      {
        lng: 121.7,
        lat: 29.8,
        iconType: 'middleRain',
        iconColor: '#6495ED',
        weather: '大雨转中雨',
        textOffset: [-15, 0],
      },
      {
        lng: 121.5,
        lat: 30,
        iconType: 'hugeRain',
        iconColor: '#4678D2',
        weather: '大雨',
        textOffset: [10, 0],
      },
    ];
    let fontFamily = 'iconfont';
    let fontPath =
      '//at.alicdn.com/t/font_2534097_ao9soua2obv.woff2?t=1622021146076';
    scene.addIconFonts([
      ['smallRain', '&#xe6f7;'],
      ['middleRain', '&#xe61c;'],
      ['hugeRain', '&#xe6a6;'],
      ['sun', '&#xe6da;'],
      ['cloud', '&#xe8da;'],
    ]);
    scene.addFontFace(fontFamily, fontPath);

    this.scene = scene;
    scene.on('loaded', () => {
      const pointIconFontLayer = new PointLayer({})
        .source(originData, {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        })
        .shape('iconType', 'text')
        .size(30)
        .color('iconColor')
        .style({
          textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          textOffset: 'textOffset', // 文本相对锚点的偏移量 [水平, 垂直]
          fontFamily,
          iconfont: true,
          textAllowOverlap: true,
        });
      scene.addLayer(pointIconFontLayer);

      const textLayer = new PointLayer({})
        .source(originData, {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        })
        .shape('weather', 'text')
        .size(16)
        .color('#fff')
        .style({
          textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          textOffset: [0, 0], // 文本相对锚点的偏移量 [水平, 垂直]
          spacing: 2, // 字符间距
          padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
          fontFamily: 'Times New Roman',
          textAllowOverlap: true,
        });
      scene.addLayer(textLayer);
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
