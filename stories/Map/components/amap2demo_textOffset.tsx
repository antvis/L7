import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap, Map as customMap, Mapbox } from '@antv/l7-maps';
import * as React from 'react';
export default class Amap2demo_textOffset extends React.Component<
  { navList?: any },
  { originData?: any }
> {
  public pointIconFontLayer: any;
  public textLayer: any;
  constructor(props: any) {
    super(props);
    this.state = {
      originData: [
        {
          lng: 120.5,
          lat: 31.3,
          iconType: 'cloud',
          iconColor: '#F0F8FF',
          weather: '多云 - 今日适宜出门',
          textOffset: [-40, 0],
        },
      ],
    };
  }
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        // hash: true,
        center: [121, 30.5],
        pitch: 0,
        style: 'dark',
        zoom: 9,
        zooms: [8, 10],
      }),
    });
    // let originData = [
    //   {
    //     lng: 120,
    //     lat: 30,
    //     iconType: 'sun',
    //     iconColor: '#FFA500',
    //     weather: '晴朗',
    //     textOffset: [10, 0],
    //   },
    //   {
    //     lng: 120.2,
    //     lat: 30.5,
    //     iconType: 'sun',
    //     iconColor: '#FFA500',
    //     weather: '晴朗 - 高温预警',
    //     textOffset: [-25, 0],
    //   },
    //   {
    //     lng: 121.5,
    //     lat: 31.4,
    //     iconType: 'cloud',
    //     iconColor: '#F0F8FF',
    //     weather: '多云',
    //     textOffset: [10, 0],
    //   },
    //   {
    //     lng: 120,
    //     lat: 31,
    //     iconType: 'cloud',
    //     iconColor: '#F0F8FF',
    //     weather: '多云 - 温度适宜',
    //     textOffset: [-25, 0],
    //   },
    //   {
    //     lng: 120.6,
    //     lat: 30.8,
    //     iconType: 'cloud',
    //     iconColor: '#F0F8FF',
    //     weather: '多云',
    //     textOffset: [10, 0],
    //   },
    //   {
    //     lng: 120.5,
    //     lat: 31.3,
    //     iconType: 'cloud',
    //     iconColor: '#F0F8FF',
    //     weather: '多云 - 今日适宜出门',
    //     textOffset: [-40, 0],
    //   },
    //   {
    //     lng: 121.3,
    //     lat: 30.2,
    //     iconType: 'smallRain',
    //     iconColor: '#6EA0FF',
    //     weather: '中雨转小雨',
    //     textOffset: [-10, 0],
    //   },
    //   {
    //     lng: 121,
    //     lat: 30.5,
    //     iconType: 'smallRain',
    //     iconColor: '#6EA0FF',
    //     weather: '小雨',
    //     textOffset: [10, 0],
    //   },
    //   {
    //     lng: 120.6,
    //     lat: 30,
    //     iconType: 'middleRain',
    //     iconColor: '#6495ED',
    //     weather: '中雨',
    //     textOffset: [10, 0],
    //   },
    //   {
    //     lng: 120.2,
    //     lat: 29.7,
    //     iconType: 'smallRain',
    //     iconColor: '#6EA0FF',
    //     weather: '小雨',
    //     textOffset: [10, 0],
    //   },
    //   {
    //     lng: 121.7,
    //     lat: 29.8,
    //     iconType: 'middleRain',
    //     iconColor: '#6495ED',
    //     weather: '大雨转中雨',
    //     textOffset: [-15, 0],
    //   },
    //   {
    //     lng: 121.5,
    //     lat: 30,
    //     iconType: 'hugeRain',
    //     iconColor: '#4678D2',
    //     weather: '大雨',
    //     textOffset: [10, 0],
    //   },
    // ];

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
    // console.log(this.state.originData)
    this.scene = scene;
    scene.on('loaded', () => {
      this.pointIconFontLayer = new PointLayer({})
        // @ts-ignore
        .source(
          [
            {
              lng: 120.5,
              lat: 31.3,
              iconType: 'cloud',
              iconColor: '#F0F8FF',
              weather: '多云 - 今日适宜出门',
              textOffset: [-40, 0],
            },
            {
              lng: 120.5,
              lat: 31.1,
              iconType: 'cloud',
              iconColor: '#F0F8FF',
              weather: '多云 - 今日适宜出门',
              textOffset: [-40, 0],
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
      scene.addLayer(this.pointIconFontLayer);

      this.textLayer = new PointLayer({})
        .source(
          [
            {
              lng: 120.5,
              lat: 31.3,
              iconType: 'cloud',
              iconColor: '#F0F8FF',
              weather: '多云 - 今日适宜出门',
              textOffset: [-40, 0],
            },
            {
              lng: 120.5,
              lat: 31.1,
              iconType: 'cloud',
              iconColor: '#F0F8FF',
              weather: '多云 - 今日适宜出门',
              textOffset: [-40, 0],
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
        .shape('weather', 'text')
        .size(16)
        .color('#f00')
        .style({
          textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          textOffset: [0, 0], // 文本相对锚点的偏移量 [水平, 垂直]
          spacing: 2, // 字符间距
          padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
          fontFamily: 'Times New Roman',
          textAllowOverlap: true,
        });
      scene.addLayer(this.textLayer);
    });
  }

  changeData = () => {
    console.log('changeData');

    // this.textLayer.source([ {
    //   lng: 120.5,
    //   lat: 31.3,
    //   iconType: 'cloud',
    //   iconColor: '#F0F8FF',
    //   weather: '多云 - 今日适宜出',
    //   textOffset: [-40, 0],
    // }], {
    //   parser: {
    //     type: 'json',
    //     x: 'lng',
    //     y: 'lat',
    //   },
    // })
    this.textLayer.setData([
      {
        lng: 120.5,
        lat: 31.3,
        iconType: 'cloud',
        iconColor: '#F0F8FF',
        weather: '多云 - ' + Math.random(),
        textOffset: [-40, 0],
      },
      {
        lng: 120.5,
        lat: 31.1,
        iconType: 'cloud',
        iconColor: '#F0F8FF',
        weather: '多云2 - ' + Math.random(),
        textOffset: [-40, 0],
      },
    ]);
    // this.textLayer.render()
    // this.scene.render()
  };

  public render() {
    return (
      <>
        <button
          style={{
            position: 'absolute',
            right: '100px',
            top: '100px',
            zIndex: 10,
          }}
          onClick={this.changeData}
        >
          123
        </button>
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
