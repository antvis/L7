import { Scene, GaodeMap } from '@antv/l7';
import { IconFontLayer } from '@antv/l7-composite-layers';

// 详情可见：https://l7plot.antv.antgroup.com/api/composite-layers/icon-font-layer

fetch('https://gw.alipayobjects.com/os/bmw-prod/9eb3f1b5-0c3b-49b2-8221-191d4ba8aa5e.json')
  .then((response) => response.json())
  .then((data) => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        pitch: 0,
        style: 'dark',
        zoom: 3,
        center: [120.19660949707033, 30.234747338474293],
      }),
    });
    scene.on('loaded', () => {
      const iconLayer = new IconFontLayer({
        id: 'iconImageLayer1',
        autoFit: true,
        source: {
          data,
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        },
        // color:{
        //   value:'red',
        // },
        iconAtlas: {
          fontFamily: 'iconfont',
          fontPath: '//at.alicdn.com/t/font_2534097_ao9soua2obv.woff2?t=1622021146076',
          iconFonts: [
            ['smallRain', '&#xe6f7;'],
            ['middleRain', '&#xe61c;'],
            ['hugeRain', '&#xe6a6;'],
            ['sun', '&#xe6da;'],
            ['cloud', '&#xe8da;'],
          ],
        },
        icon: {
          field: 'iconType',
          value: 'text',
        },
        iconStyle: {
          textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          textOffset: [-10, 10], // 文本相对锚点的偏移量 [水平, 垂直]
          fontFamily: 'iconfont',
          textAllowOverlap: true,
          iconfont: true,
        },
        fillColor: 'blue',
        radius: 40,
        opacity: 1,
        label: {
          visible: false,
          field: 'weather',
          style: {
            fill: '#fff',
            opacity: 0.6,
            fontSize: 12,
            textAnchor: 'top',
            textOffset: [0, 20],
            spacing: 1,
            padding: [5, 5],
            stroke: '#ffffff',
            strokeWidth: 0.3,
            strokeOpacity: 1.0,
          },
        },
        state: {
          active: {
            color: 'red',
          },
          select: {
            radius: 20,
            opacity: 1,
          },
        },
      });
      scene && iconLayer.addTo(scene);
    });
  });
