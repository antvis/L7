import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [ 120.5, 30.2 ],
    pitch: 0,
    style: 'dark',
    zoom: 8.5,
    zooms: [ 8, 10 ]
  })
});
const dataColor = {
  bigRainBC: '#285A8C',
  middleRainBC: '#326EA0',
  smallRainBC: '#4678AA',
  sunBC: '#00BFFF',
  cloudBC: '#1E90FF'
};
const originData = [
  {
    lng: 121.7,
    lat: 30.6,
    iconType: 'hugeRain',
    iconColor: '#4678D2',
    backgoundColor: dataColor.bigRainBC,
    temperature: '20℃',
    weather: '大雨'
  },
  {
    lng: 119.2,
    lat: 30.0,
    iconType: 'smallRain',
    iconColor: '#6EA0FF',
    backgoundColor: dataColor.smallRainBC,
    temperature: '22℃',
    weather: '小雨'
  },
  {
    lng: 119.67,
    lat: 30.2,
    iconType: 'sun',
    iconColor: '#FFA500',
    backgoundColor: dataColor.sunBC,
    temperature: '28℃',
    weather: '晴朗'
  },
  {
    lng: 119.63,
    lat: 30.6,
    iconType: 'sun',
    iconColor: '#FFA500',
    backgoundColor: dataColor.sunBC,
    temperature: '28℃',
    weather: '晴朗'
  },
  {
    lng: 120,
    lat: 30,
    iconType: 'sun',
    iconColor: '#FFA500',
    backgoundColor: dataColor.sunBC,
    temperature: '28℃',
    weather: '晴朗'
  },
  {
    lng: 120.2,
    lat: 30.5,
    iconType: 'sun',
    iconColor: '#FFA500',
    backgoundColor: dataColor.sunBC,
    temperature: '28℃',
    weather: '晴朗'
  },
  {
    lng: 121.5,
    lat: 31.4,
    iconType: 'cloud',
    iconColor: '#F0F8FF',
    backgoundColor: dataColor.cloudBC,
    temperature: '22℃',
    weather: '多云'
  },
  {
    lng: 120,
    lat: 31,
    iconType: 'cloud',
    iconColor: '#F0F8FF',
    backgoundColor: dataColor.cloudBC,
    temperature: '22℃',
    weather: '多云'
  },
  {
    lng: 120.6,
    lat: 30.8,
    iconType: 'cloud',
    iconColor: '#F0F8FF',
    backgoundColor: dataColor.cloudBC,
    temperature: '22℃',
    weather: '多云'
  },
  {
    lng: 120.5,
    lat: 31.3,
    iconType: 'cloud',
    iconColor: '#F0F8FF',
    backgoundColor: dataColor.cloudBC,
    temperature: '22℃',
    weather: '多云'
  },
  {
    lng: 121.3,
    lat: 30.2,
    iconType: 'smallRain',
    iconColor: '#6EA0FF',
    backgoundColor: dataColor.smallRainBC,
    temperature: '22℃',
    weather: '小雨'
  },
  {
    lng: 121,
    lat: 30.5,
    iconType: 'smallRain',
    iconColor: '#6EA0FF',
    backgoundColor: dataColor.smallRainBC,
    temperature: '22℃',
    weather: '小雨'
  },
  {
    lng: 120.6,
    lat: 30,
    iconType: 'middleRain',
    iconColor: '#6495ED',
    backgoundColor: dataColor.middleRainBC,
    temperature: '24℃',
    weather: '中雨'
  },
  {
    lng: 120.2,
    lat: 29.7,
    iconType: 'smallRain',
    iconColor: '#6EA0FF',
    backgoundColor: dataColor.smallRainBC,
    temperature: '22℃',
    weather: '小雨'
  },
  {
    lng: 121.7,
    lat: 29.8,
    iconType: 'middleRain',
    iconColor: '#6495ED',
    backgoundColor: dataColor.middleRainBC,
    temperature: '24℃',
    weather: '中雨'
  },
  {
    lng: 121.5,
    lat: 30,
    iconType: 'hugeRain',
    iconColor: '#4678D2',
    backgoundColor: dataColor.bigRainBC,
    temperature: '20℃',
    weather: '大雨'
  }
];
const fontFamily = 'iconfont';
const fontPath = '//at.alicdn.com/t/font_2534097_ao9soua2obv.woff2?t=1622021146076';
scene.addFontFace(fontFamily, fontPath);
scene.addIconFonts([
  [ 'smallRain', '&#xe6f7;' ],
  [ 'middleRain', '&#xe61c;' ],
  [ 'hugeRain', '&#xe6a6;' ],
  [ 'sun', '&#xe6da;' ],
  [ 'cloud', '&#xe8da;' ]
]);

scene.on('loaded', () => {

  const layer = new PointLayer()
    .source(originData, {
      parser: {
        type: 'json',
        x: 'lng',
        y: 'lat'
      }
    })
    .shape('circle')
    .color('backgoundColor')
    .size(42);
  scene.addLayer(layer);


  const pointIconFontLayer = new PointLayer({})
    .source(originData, {
      parser: {
        type: 'json',
        x: 'lng',
        y: 'lat'
      }
    }
    )
    .shape('iconType', 'text')
    .size(30)
    .color('iconColor')
    .style({
      textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
      textOffset: [ 38, 10 ], // 文本相对锚点的偏移量 [水平, 垂直]
      fontFamily,
      iconfont: true,
      textAllowOverlap: true
    });
  scene.addLayer(pointIconFontLayer);

  const textLayer = new PointLayer({})
    .source(originData,
      {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat'
        }
      }
    )
    .shape('temperature', 'text')
    .size(10)
    .color('#ffffff')
    .style({
      textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
      textOffset: [ 5, -55 ], // 文本相对锚点的偏移量 [水平, 垂直]
      spacing: 2, // 字符间距
      padding: [ 1, 1 ], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
      stroke: '#ffffff', // 描边颜色
      strokeWidth: 0.3, // 描边宽度
      strokeOpacity: 1.0,
      fontFamily: 'Times New Roman',
      textAllowOverlap: true
    });
  scene.addLayer(textLayer);

  const textLayer2 = new PointLayer({})
    .source(originData,
      {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat'
        }
      }
    )
    .shape('weather', 'text')
    .size(14)
    .color('#ffffff')
    .style({
      textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
      textOffset: [ 5, -15 ], // 文本相对锚点的偏移量 [水平, 垂直]
      spacing: 2, // 字符间距
      padding: [ 1, 1 ], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
      stroke: '#ffffff', // 描边颜色
      strokeWidth: 0.3, // 描边宽度
      strokeOpacity: 1.0,
      fontFamily: 'Times New Roman',
      textAllowOverlap: true
    });
  scene.addLayer(textLayer2);

});
