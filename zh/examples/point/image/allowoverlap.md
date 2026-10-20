---
title: "图片标注压盖控制"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/examples/point/image/allowoverlap/"
---

# 图片标注压盖控制

[运行示例](https://l7.antv.antgroup.com/zh/examples/point/image/allowoverlap/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```js
import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [104.0, 36.0],
    zoom: 4,
  }),
});

scene.addImage(
  'marker',
  'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg',
);

// 在中国范围内生成密集随机点，使压盖效果明显
function generateData(count) {
  const points = [];
  for (let i = 0; i < count; i++) {
    points.push({
      lng: 99 + Math.random() * 20,
      lat: 25 + Math.random() * 18,
      id: i,
    });
  }
  return points;
}

scene.on('loaded', () => {
  const data = generateData(300);

  const layer = new PointLayer()
    .source(data, {
      parser: { type: 'json', x: 'lng', y: 'lat' },
    })
    .shape('marker')
    .size(15)
    .style({
      allowOverlap: false, // 默认关闭压盖，开启碰撞避让
    });

  scene.addLayer(layer);

  // 控制面板
  const panel = document.createElement('div');
  panel.style.cssText =
    'position:absolute;top:10px;left:10px;z-index:100;background:#fff;padding:12px 16px;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,.15);font-size:13px;';

  panel.innerHTML = `
    <div style="margin-bottom:10px;font-weight:600;">Image allowOverlap</div>
    <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
      <input type="checkbox" id="overlap-toggle" />
      <span id="overlap-label">allowOverlap: false（碰撞避让开启）</span>
    </label>
    <div style="margin-top:8px;color:#888;font-size:12px;">
      点数量：300 &nbsp;|&nbsp; 缩放地图可触发重新计算
    </div>
  `;

  document.getElementById('map').appendChild(panel);

  const checkbox = document.getElementById('overlap-toggle');
  const label = document.getElementById('overlap-label');

  checkbox.addEventListener('change', () => {
    const allowOverlap = checkbox.checked;
    label.textContent = allowOverlap
      ? 'allowOverlap: true（允许压盖，全部显示）'
      : 'allowOverlap: false（碰撞避让开启）';
    layer.style({ allowOverlap });
  });
});
```

## 运行环境

运行示例前，先在含有 #container 的页面中等待以下初始化完成。相关文件附于文末。

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/point/image/demo/allowoverlap.js" });
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
