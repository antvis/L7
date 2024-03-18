// @ts-ignore
import {
  Scene,
  Source,
  PolygonLayer,
  PointLayer,
  LineLayer,
  TileDebugLayer,
} from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const colors = {};
    const GDPSpeed = {
      '520000': 10, //贵州
      '540000': 10, //西藏
      '530000': 8.5, //云南
      '500000': 8.5, //重庆
      '360000': 8.5, //江西
      '340000': 8.0, //安徽
      '510000': 7.5, //四川
      '350000': 8.5, //福建
      '430000': 8.0, //湖南
      '420000': 7.5, //湖北
      '410000': 7.5, //河南
      '330000': 7.0, //浙江
      '640000': 7.5, //宁夏
      '650000': 7.0, //新疆
      '440000': 7.0, //广东
      '370000': 7.0, //山东
      '450000': 7.3, //广西
      '630000': 7.0, //青海
      '320000': 7.0, //江苏
      '140000': 6.5, //山西
      '460000': 7, // 海南
      '310000': 6.5, //上海
      '110000': 6.5, // 北京
      '130000': 6.5, // 河北
      '230000': 6, // 黑龙江
      '220000': 6, // 吉林
      '210000': 6.5, //辽宁
      '150000': 6.5, //内蒙古
      '120000': 5, // 天津
      '620000': 6, // 甘肃
      '610000': 8.5, // 甘肃
      '710000': 6.64, //台湾
      '810000': 6.0, //香港
      '820000': 6.7, //澳门
    };
    const getColorByDGP = function(adcode) {
      if (!colors[adcode]) {
        const gdp = GDPSpeed[adcode];
        if (!gdp) {
          colors[adcode] = 'rgb(227,227,227)';
        } else {
          const rg = 255 - Math.floor(((gdp - 5) / 5) * 255);
          colors[adcode] = 'rgb(' + rg + ',' + rg + ',255)';
        }
      }
      return colors[adcode];
    };

    const scene = new Scene({
      id: 'map',
     
      map: new Map({
        center: [112, 30],

        // zoom: 12,
        zoom: 3,
      }),
    });

    const url =
      'https://mvt.amap.com/district/CHN2/{z}/{x}/{y}/4096?key=309f07ac6bc48160e80b480ae511e1e9&version=';
    const source = new Source(url, {
      parser: {
        type: 'mvt',
        tileSize: 256,
        warp: false,
      },
    });

    scene.on('loaded', () => {
      // 绿地
      // const fill = new PolygonLayer({
      //   sourceLayer: 'CHN_Cities',
      // })
      //   .source(source)
      //   .shape('fill')
      //   .color('adcode_pro', getColorByDGP);

      const line = new LineLayer({
        sourceLayer: 'CHN_Cities_L',
      })
        .source(source)
        .shape('line')
        .color('#FFA500');

      // const line2 = new LineLayer({
      //   sourceLayer: 'CHN_L',
      // })
      //   .source(source)
      //   .shape('line')
      //   .size(0.6)
      //   .color('#053061');

      // const text = new PointLayer({
      //   sourceLayer: 'CHN_Cities',
      //   blend: 'normal',
      // })
      //   .source(source)
      //   .shape('id', 'text')
      //   .size(12)
      //   .color('#000');

      // const debugerLayer = new TileDebugLayer();

      // scene.addLayer(fill);
      scene.addLayer(line);
    
      // scene.addLayer(line2);
      // scene.addLayer(text);
      // scene.addLayer(debugerLayer);
    });
  }, []);
  return (
    <div
      id="map"
      style={{
        height: '60vh',
        position: 'relative',
      }}
    />
  );
};
