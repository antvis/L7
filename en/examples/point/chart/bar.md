---
title: "柱图"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/examples/point/chart/bar/"
---

# 柱图

[Live example](https://l7.antv.antgroup.com/en/examples/point/chart/bar/)

[Resource index](/llms.txt)

Provide a DOM element with `id="container"`. The original example source follows.

## Source

```js
import * as G2 from '@antv/g2';
import { Marker, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [2.6125016864608597, 49.359131],
    zoom: 4.19,
  }),
});
scene.on('loaded', () => {
  addChart();
  scene.render();
});
function addChart() {
  fetch('https://gw.alipayobjects.com/os/basement_prod/0b96cca4-7e83-449a-93d0-2a77053e74ab.json')
    .then((res) => res.json())
    .then((data) => {
      data.nodes.forEach(function (item) {
        const el = document.createElement('div');
        const total = item.gdp.Agriculture + item.gdp.Industry + item.gdp.Service;

        const size = Math.min(parseInt(total / 30000, 10), 70);
        if (size < 30) {
          return;
        }
        const itemData = [
          {
            item: 'Agriculture',
            count: item.gdp.Agriculture,
            percent: item.gdp.Agriculture / total,
          },
          {
            item: 'Industry',
            count: item.gdp.Industry,
            percent: item.gdp.Industry / total,
          },
          {
            item: 'Service',
            count: item.gdp.Service,
            percent: item.gdp.Service / total,
          },
        ];

        const chart = new G2.Chart({
          container: el,
          width: size,
          height: size,
          render: 'svg',
          padding: 0,
        });
        chart.legend(false);
        chart.data(itemData);
        chart.tooltip(false);

        chart.axis('count', false);
        chart.axis('item', false);
        chart.interval().position('item*count').color('item', ['#5CCEA1', '#5D7092', '#5B8FF9']);
        chart.render();
        const marker = new Marker({
          element: el,
        }).setLnglat({
          lng: item.coordinates[0],
          lat: item.coordinates[1],
        });
        scene.addMarker(marker);
      });
    });
}
```

## Runtime environment

Before evaluating the example, await this setup in a page containing #container. Supporting files follow below.

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/point/chart/demo/bar.js" });
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
