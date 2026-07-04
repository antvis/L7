import { PointLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const iconfont: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [120.5, 30.45],
      style: 'dark',
      zoom: 8.1,
    },
  });

  const config = {
    iconSize: 28,
    iconFill: 'white' as 'black' | 'white' | 'red' | 'blue' | 'green',
    backgroundColor: '#E81A1A',
    backgroundPadding: 2,
    backgroundRadius: 4,
    backgroundShape: 'circle' as 'rect' | 'circle' | 'circle-rect',
    backgroundFill: 'red' as 'red' | 'green' | 'blue' | 'yellow' | 'white',
    stroke: '#F8A3A3',
    strokeWidth: 0,
  };

  const backgroundColorMap = {
    red: '#E81A1A',
    green: '#18C964',
    blue: '#1677FF',
    yellow: '#F5C400',
    white: '#FFFFFF',
  } as const;

  const iconColorMap = {
    black: '#000000',
    white: '#FFFFFF',
    red: '#F5222D',
    blue: '#1677FF',
    green: '#18C964',
  } as const;

  const fontFamily = 'iconfont';
  // 从 iconfont.cn 上拷贝的字体文件链接
  const fontPath = 'https://at.alicdn.com/t/font_2534097_ao9soua2obv.woff2?t=1622021146076';

  // 注册字体
  const fontLoaded = new Promise<void>((resolve) => {
    scene.once('fontloaded', () => {
      resolve();
    });
  });
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
      iconColorKey: 'icon',
      temperature: '22℃',
      weather: '晴',
    },
    {
      lng: 120.2,
      lat: 30.5,
      iconType: 'cloud',
      iconColorKey: 'icon',
      temperature: '24℃',
      weather: '多云',
    },
    {
      lng: 120.6,
      lat: 30.8,
      iconType: 'smallRain',
      iconColorKey: 'icon',
      temperature: '21℃',
      weather: '小雨',
    },
  ];

  const pointParser = {
    parser: {
      type: 'json' as const,
      x: 'lng',
      y: 'lat',
    },
  };

  const referenceLayer = new PointLayer({ zIndex: 10 })
    .source(originData, pointParser)
    .shape('circle')
    .size(3)
    .active(false)
    .color('#FF4D4F')
    .style({ opacity: 1 });

  const pointIconFontLayer = new PointLayer({})
    .source(originData, pointParser)
    .shape('iconType', 'text') // 使用 iconType 字段来指定图标名称
    .size(config.iconSize)
    .color('iconColorKey', [iconColorMap[config.iconFill]])
    .style({
      textAnchor: 'bottom', // 图标中心点对齐到坐标位置
      fontFamily,
      iconfont: true, // 开启 iconfont 模式
      backgroundColor: config.backgroundColor,
      backgroundPadding: config.backgroundPadding,
      backgroundRadius: config.backgroundRadius,
      backgroundShape: config.backgroundShape,
      stroke: config.stroke,
      strokeWidth: config.strokeWidth,
      textAllowOverlap: true,
    });

  scene.addLayer(referenceLayer);

  await fontLoaded;
  scene.addLayer(pointIconFontLayer);

  iconfont.extendGUI = (gui) => {
    const sizeController = gui
      .add(config, 'iconSize', 18, 48, 1)
      .name('图标大小')
      .onChange((value: number) => {
        pointIconFontLayer.size(value);
        scene.render();
      });

    const iconColorController = gui
      .add(config, 'iconFill', Object.keys(iconColorMap))
      .name('图标颜色')
      .onChange((value: keyof typeof iconColorMap) => {
        config.iconFill = value;
        pointIconFontLayer.color('iconColorKey', [iconColorMap[value]]);
        scene.render();
      });

    const paddingController = gui
      .add(config, 'backgroundPadding', 0, 24, 1)
      .name('背景 Padding')
      .onChange((value: number) => {
        pointIconFontLayer.style({ backgroundPadding: value });
        scene.render();
      });

    const radiusController = gui
      .add(config, 'backgroundRadius', 0, 24, 1)
      .name('背景圆角')
      .onChange((value: number) => {
        pointIconFontLayer.style({ backgroundRadius: value });
        scene.render();
      });

    const shapeController = gui
      .add(config, 'backgroundShape', ['rect', 'circle', 'circle-rect'])
      .name('背景形状')
      .onChange((value: 'rect' | 'circle' | 'circle-rect') => {
        pointIconFontLayer.style({ backgroundShape: value });
        scene.render();
      });

    const fillController = gui
      .add(config, 'backgroundFill', Object.keys(backgroundColorMap))
      .name('背景填充色')
      .onChange((value: keyof typeof backgroundColorMap) => {
        const backgroundColor = backgroundColorMap[value];
        config.backgroundColor = backgroundColor;
        pointIconFontLayer.style({ backgroundColor });
        scene.render();
      });

    const strokeWidthController = gui
      .add(config, 'strokeWidth', 0, 4, 0.5)
      .name('描边宽度')
      .onChange((value: number) => {
        pointIconFontLayer.style({ strokeWidth: value });
        scene.render();
      });

    return [
      sizeController,
      iconColorController,
      paddingController,
      radiusController,
      shapeController,
      fillController,
      strokeWidthController,
    ];
  };

  return scene;
};
