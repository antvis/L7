---
title: "中国城市地图"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/examples/tile/vector/chinamap/"
---

# 中国城市地图

[运行示例](https://l7.antv.antgroup.com/zh/examples/tile/vector/chinamap/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```ts
// @ts-ignore
import { LineLayer, PointLayer, PolygonLayer, Scene, Source } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';

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
const getColorByDGP = function (adcode) {
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
  const fill = new PolygonLayer({
    sourceLayer: 'CHN_Cities',
  })
    .source(source)
    .shape('fill')
    .color('adcode_pro', getColorByDGP);

  const line = new LineLayer({
    sourceLayer: 'CHN_Cities_L',
  })
    .source(source)
    .shape('line')
    .color('#FFA500');

  const line2 = new LineLayer({
    sourceLayer: 'CHN_L',
  })
    .source(source)
    .shape('line')
    .size(0.6)
    .color('#053061');

  const text = new PointLayer({
    sourceLayer: 'CHN_Cities',
    blend: 'normal',
  })
    .source(source)
    .shape('id', 'text')
    .size(12)
    .color('#000');
  scene.addLayer(fill);
  scene.addLayer(line);
  scene.addLayer(line2);
  scene.addLayer(text);
});
```

## 运行环境

运行示例前，先在含有 #container 的页面中等待以下初始化完成。相关文件附于文末。

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/tile/vector/demo/chinamap.ts" });
```


## src/demo/setup.ts

```ts
import type { DemoSetupContext } from '@antv/astro-theme-antv';
import * as District from 'district-data';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default async function setup({ container, path }: DemoSetupContext) {
  // Tool pages provide their own React layout and SDK imports.
  if (!path.startsWith('/examples/')) return;
  // Retain only the original globals still used by gallery examples.
  Object.assign(window, { District, GLTFLoader });
  const map = document.createElement('div');
  map.id = 'map';
  container.append(map);
  await import('./map.css');
  // Match the original gallery's shared AMap environment, including raw AMap demos.
  await import('./amap');
}
```

## src/demo/map.css

```css
#map {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 320px;
}

.labelclass {
  position: absolute;
  display: inline;
  cursor: pointer;
  background: rgb(255, 228, 120);
  border: solid 2px #fff;
  padding: 4px;
  white-space: nowrap;
  font:
    bold 12px/18px arial,
    sans-serif;
  color: #fff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  line-height: 30px;
  /* opacity: 0.7; */
  text-align: center;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
```

## src/demo/amap.ts

```ts
import AMapLoader from '@amap/amap-jsapi-loader';

// Preserve the site's development and production SDK registrations.
const credentials = import.meta.env.DEV
  ? { key: '6f025e700cbacbb0bb866712d20bb35c', securityJsCode: '290ddc4b0d33be7bc9b354bc6a4ca614' }
  : { key: 'f59bcf249433f8b05caaee19f349b3d7', securityJsCode: '2653011adeb04230b3a26cc9a780a800' };
window._AMapSecurityConfig = { securityJsCode: credentials.securityJsCode };
await AMapLoader.load({ key: credentials.key, version: '2.0', plugins: ['Map3D'] });
```
