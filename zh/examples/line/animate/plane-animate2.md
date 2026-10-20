---
title: "航向图"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/examples/line/animate/plane-animate2/"
---

# 航向图

[运行示例](https://l7.antv.antgroup.com/zh/examples/line/animate/plane-animate2/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```js
 
import { LineLayer, PointLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 40,
    center: [40, 40.16797],
    style: 'dark',
    zoom: 2.5,
  }),
});
scene.addImage(
  'plane',
  'https://gw.alipayobjects.com/zos/bmw-prod/0ca1668e-38c2-4010-8568-b57cb33839b9.svg',
);
scene.on('loaded', () => {
  Promise.all([
    fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/2960e1fc-b543-480f-a65e-d14c229dd777.json',
    ).then((d) => d.json()),
    fetch(
      'https://gw.alipayobjects.com/os/basement_prod/4472780b-fea1-4fc2-9e4b-3ca716933dc7.json',
    ).then((d) => d.text()),
    fetch(
      'https://gw.alipayobjects.com/os/basement_prod/a5ac7bce-181b-40d1-8a16-271356264ad8.json',
    ).then((d) => d.text()),
  ]).then(function onLoad([world, dot, flyline]) {
    const dotData = eval(dot);
    // @ts-ignore
    const flydata = eval(flyline).map((item) => {
      // @ts-ignore
      const latlng1 = item.from.split(',').map((e) => {
        return e * 1;
      });
      // @ts-ignore
      const latlng2 = item.to.split(',').map((e) => {
        return e * 1;
      });
      return { coord: [latlng1, latlng2] };
    });

    const worldLine = new LineLayer().source(world).color('#41fc9d').size(0.5).style({
      opacity: 0.4,
    });
    const dotPoint = new PointLayer()
      .source(dotData, {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      })
      .shape('circle')
      .color('#ffed11')
      .animate(true)
      .size(40);
    const flyLine = new LineLayer({ blend: 'normal' })
      .source(flydata, {
        parser: {
          type: 'json',
          coordinates: 'coord',
        },
      })
      .color('#ff6b34')
      .texture('plane')
      .shape('arc')
      .size(15)
      .animate({
        duration: 1,
        interval: 0.2,
        trailLength: 0.05,
      })
      .style({
        textureBlend: 'replace',
        lineTexture: true, // 开启线的贴图功能
        iconStep: 10, // 设置贴图纹理的间距
      });

    const flyLine2 = new LineLayer()
      .source(flydata, {
        parser: {
          type: 'json',
          coordinates: 'coord',
        },
      })
      .color('#ff6b34')
      .shape('arc')
      .size(1)
      .style({
        lineType: 'dash',
        dashArray: [5, 5],
        opacity: 0.5,
      });
    scene.addLayer(worldLine);
    scene.addLayer(dotPoint);
    scene.addLayer(flyLine2);
    scene.addLayer(flyLine);
  });
});
```

## 运行环境

运行示例前，先在含有 #container 的页面中等待以下初始化完成。相关文件附于文末。

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/line/animate/demo/plane-animate2.js" });
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
