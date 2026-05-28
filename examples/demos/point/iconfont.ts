import { PointLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const iconfont: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [120.5, 30.2],
      style: 'dark',
      zoom: 7.5,
    },
  });

  const fontFamily = 'iconfont';
  // 从 iconfont.cn 上拷贝的字体文件链接
  const fontPath = 'https://at.alicdn.com/t/font_2534097_ao9soua2obv.woff2?t=1622021146076';

  // 注册字体
  scene.addFontFace(fontFamily, fontPath);

  // 注册图标
  scene.addIconFonts([
    ['smallRain', '&#xe6f7;'],
    ['middleRain', '&#xe61c;'],
    ['hugeRain', '&#xe6a6;'],
    ['sun', '&#xe6da;'],
    ['cloud', '&#xe8da;'],
  ]);

  // 数据
  const originData = [
    {
      lng: 120.5,
      lat: 30.2,
      iconType: 'sun',
      iconColor: '#f29d0b',
      temperature: '22℃',
      weather: '晴',
    },
    {
      lng: 120.2,
      lat: 30.5,
      iconType: 'cloud',
      iconColor: '#58a3ff',
      temperature: '24℃',
      weather: '多云',
    },
    {
      lng: 120.6,
      lat: 30.8,
      iconType: 'smallRain',
      iconColor: '#74caff',
      temperature: '21℃',
      weather: '小雨',
    },
  ];

  const pointIconFontLayer = new PointLayer({})
    .source(originData, {
      parser: {
        type: 'json',
        x: 'lng',
        y: 'lat',
      },
    })
    .shape('iconType', 'text') // 使用 iconType 字段来指定图标名称
    .size(40)
    .color('iconColor') // 使用 iconColor 字段来指定图标颜色
    .style({
      textAnchor: 'center',
      fontFamily,
      iconfont: true, // 开启 iconfont 模式
      textAllowOverlap: true,
    });

  scene.addLayer(pointIconFontLayer);

  return scene;
};
