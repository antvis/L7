// @ts-ignore
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
    let fontFamily = 'iconfont';
    let fontPath =
      '//at.alicdn.com/t/font_2534097_ao9soua2obv.woff2?t=1622021146076';

    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [121, 30.5],
        pitch: 0,
        style: 'amap://styles/453e2f8e11603fc8f7548fe18959e9e9',
        zoom: 9,
        zooms: [8, 10],
        // viewMode: '2D',
      }),
    });
    this.scene = scene;

    scene.addIconFonts([
      ['smallRain', '&#xe6f7;'],
      ['middleRain', '&#xe61c;'],
      ['hugeRain', '&#xe6a6;'],
      ['sun', '&#xe6da;'],
      ['cloud', '&#xe8da;'],
    ]);

    scene.addFontFace(fontFamily, fontPath);
    scene.on('loaded', () => {
      let originData = [
        {
          lng: 120,
          lat: 30,
          iconType: 'sun',
          iconColor: '#FFA500',
          backgoundColor: '#00BFFF',
          temperature: '28℃',
          weather: '晴朗',
          opacity: 0.5,
          strokeWidth2: 1,
          stroke: "#f00",
          testTextOffset: [5, -55]
        },
        {
          lng: 120.2,
          lat: 30.5,
          iconType: 'sun',
          iconColor: '#FFA500',
          backgoundColor: '#00BFFF',
          temperature: '28℃',
          weather: '晴朗',
          opacity: 0.5,
          strokeWidth2: 1,
          stroke: "#f00",
          testTextOffset: [5, -55]
        },
        {
          lng: 121.5,
          lat: 31.4,
          iconType: 'cloud',
          iconColor: '#F0F8FF',
          backgoundColor: '#1E90FF',
          temperature: '22℃',
          weather: '多云',
          opacity: 0.5,
          strokeWidth2: 1,
          stroke: "#f00",
          testTextOffset: [5, -55]
        },
        {
          lng: 120,
          lat: 31,
          iconType: 'cloud',
          iconColor: '#F0F8FF',
          backgoundColor: '#1E90FF',
          temperature: '22℃',
          weather: '多云',
          opacity: 0.5,
          strokeWidth2: 1,
          stroke: "#f00",
          testTextOffset: [5, -55]
        },
        {
          lng: 120.6,
          lat: 30.8,
          iconType: 'cloud',
          iconColor: '#F0F8FF',
          backgoundColor: '#1E90FF',
          temperature: '22℃',
          weather: '多云',
          opacity: 0.5,
          strokeWidth2: 1,
          stroke: "#f00",
          testTextOffset: [5, -55]
        },
        {
          lng: 120.5,
          lat: 31.3,
          iconType: 'cloud',
          iconColor: '#F0F8FF',
          backgoundColor: '#1E90FF',
          temperature: '22℃',
          weather: '多云',
          opacity: 1,
          strokeWidth2: 3,
          stroke: "#ff0",
          testTextOffset: [5, -55]
        },
        {
          lng: 121.3,
          lat: 30.2,
          iconType: 'smallRain',
          iconColor: '#6EA0FF',
          backgoundColor: '#4678AA',
          temperature: '22℃',
          weather: '小雨',
          opacity: 1,
          strokeWidth2: 3,
          stroke: "#ff0",
          testTextOffset: [5, -55]
        },
        {
          lng: 121,
          lat: 30.5,
          iconType: 'smallRain',
          iconColor: '#6EA0FF',
          backgoundColor: '#4678AA',
          temperature: '22℃',
          weather: '小雨',
          opacity: 1,
          strokeWidth2: 3,
          stroke: "#ff0",
          testTextOffset: [5, -55]
        },
        {
          lng: 120.6,
          lat: 30,
          iconType: 'middleRain',
          iconColor: '#6495ED',
          backgoundColor: '#326EA0',
          temperature: '24℃',
          weather: '中雨',
          opacity: 1,
          strokeWidth2: 3,
          stroke: "#ff0",
          testTextOffset: [5, -55]
        },
        {
          lng: 120.2,
          lat: 29.7,
          iconType: 'smallRain',
          iconColor: '#6EA0FF',
          backgoundColor: '#4678AA',
          temperature: '22℃',
          weather: '小雨',
          opacity: 1,
          strokeWidth2: 3,
          stroke: "#ff0",
          testTextOffset: [5, -55]
        },
        {
          lng: 121.7,
          lat: 29.8,
          iconType: 'middleRain',
          iconColor: '#6495ED',
          backgoundColor: '#326EA0',
          temperature: '24℃',
          weather: '中雨',
          opacity: 1,
          strokeWidth2: 3,
          stroke: "#ff0",
          testTextOffset: [5, -55]
        },
        {
          lng: 121.5,
          lat: 30,
          iconType: 'hugeRain',
          iconColor: '#4678D2',
          backgoundColor: '#285A8C',
          temperature: '20℃',
          weather: '大雨-',
          opacity: 1,
          strokeWidth2: 3,
          stroke: "#ff0",
          testTextOffset: [10, -55]
        },
      ];

      const layer = new PointLayer()
        .source(originData, {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        })
        .shape('circle')
        .color('backgoundColor')
        .size(40);
      scene.addLayer(layer);

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
          textOffset: [38, 10], // 文本相对锚点的偏移量 [水平, 垂直]
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
        .shape('temperature', 'text')
        .size(10)
        .color('#ffffff')
        .style({
          textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          // textOffset: [5, -55], // 文本相对锚点的偏移量 [水平, 垂直]
          textOffset: 'testTextOffset', // 文本相对锚点的偏移量 [水平, 垂直]
          spacing: 2, // 字符间距
          padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
          fontFamily: 'Times New Roman',
          textAllowOverlap: true,
          stroke: 'iconColor', // 描边颜色
          strokeWidth: 'strokeWidth2', // 描边宽度
          opacity: "opacity"
        });
      scene.addLayer(textLayer);

      const textLayer2 = new PointLayer({})
        .source(originData, {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        })
        .shape('weather', 'text')
        .size(14)
        .color('#ffffff')
        .style({
          textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          textOffset: [5, -15], // 文本相对锚点的偏移量 [水平, 垂直]
          spacing: 2, // 字符间距
          padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
          stroke: '#ffffff', // 描边颜色
          strokeWidth: 0.3, // 描边宽度
          strokeOpacity: 1.0,
          fontFamily: 'Times New Roman',
          textAllowOverlap: true,
        });
      scene.addLayer(textLayer2);
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
