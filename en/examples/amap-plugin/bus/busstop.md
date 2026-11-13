---
title: "公交线路插件"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/examples/amap-plugin/bus/busstop/"
---

# 公交线路插件

[Live example](https://l7.antv.antgroup.com/en/examples/amap-plugin/bus/busstop/)

[Resource index](/llms.txt)

Provide a DOM element with `id="container"`. The original example source follows.

## Source

```js
import { LineLayer, PointLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [116.475, 39.985],
    zoom: 12.2,
    plugin: ['AMap.ToolBar', 'AMap.LineSearch'],
  }),
});

scene.addImage(
  'road',
  'https://gw.alipayobjects.com/zos/bmw-prod/ce83fc30-701f-415b-9750-4b146f4b3dd6.svg',
);
scene.addImage(
  'start',
  'https://gw.alipayobjects.com/zos/bmw-prod/1c301f25-9bb8-4e67-8d5c-41117c877caf.svg',
);
scene.addImage(
  'end',
  'https://gw.alipayobjects.com/zos/bmw-prod/f3db4998-e657-4c46-b5ab-205ddc12031f.svg',
);

scene.addImage(
  'busStop',
  'https://gw.alipayobjects.com/zos/bmw-prod/54345af2-1d01-43e1-9d11-cd9bb953202c.svg',
);

scene.on('loaded', () => {
  window.AMap.plugin(['AMap.ToolBar', 'AMap.LineSearch'], () => {
    scene.map.addControl(new AMap.ToolBar());

    const linesearch = new AMap.LineSearch({
      pageIndex: 1, // 页码，默认值为1
      pageSize: 1, // 单页显示结果条数，默认值为20，最大值为50
      city: '北京', // 限定查询城市，可以是城市名（中文/中文全拼）、城市编码，默认值为『全国』
      extensions: 'all', // 是否返回公交线路详细信息，默认值为『base』
    });

    // 执行公交路线关键字查询
    linesearch.search('536', function (status, result) {
      // 打印状态信息status和结果信息result

      const { path, via_stops } = result.lineInfo[0];
      const startPoint = [path[0]];
      const endpoint = [path[path.length - 1]];
      const budStopsData = via_stops.map((stop) => ({
        lng: stop.location.lng,
        lat: stop.location.lat,
        name: stop.name,
      }));
      const data = [
        {
          id: '1',
          coord: path.map((p) => [p.lng, p.lat]),
        },
      ];

      const busLine = new LineLayer({ blend: 'normal' })
        .source(data, {
          parser: {
            type: 'json',
            coordinates: 'coord',
          },
        })
        .size(5)
        .shape('line')
        .color('rgb(99, 166, 242)')
        .texture('road')
        .animate({
          interval: 1, // 间隔
          duration: 1, // 持续时间，延时
          trailLength: 2, // 流线长度
        })
        .style({
          lineTexture: true,
          iconStep: 25,
        });

      scene.addLayer(busLine);

      const startPointLayer = new PointLayer({ zIndex: 1 })
        .source(startPoint, {
          parser: {
            x: 'lng',
            y: 'lat',
            type: 'json',
          },
        })
        .shape('start')
        .size(20)
        .style({
          offsets: [0, 25],
        });
      scene.addLayer(startPointLayer);

      const endPointLayer = new PointLayer({ zIndex: 1 })
        .source(endpoint, {
          parser: {
            x: 'lng',
            y: 'lat',
            type: 'json',
          },
        })
        .shape('end')
        .size(25)
        .style({
          offsets: [0, 25],
        });
      scene.addLayer(endPointLayer);

      const busStops = new PointLayer()
        .source(budStopsData, {
          parser: {
            x: 'lng',
            y: 'lat',
            type: 'json',
          },
        })
        .shape('busStop')
        .size(13)
        .style({
          offsets: [20, 0],
        });
      scene.addLayer(busStops);

      const busStopsName = new PointLayer()
        .source(budStopsData, {
          parser: {
            x: 'lng',
            y: 'lat',
            type: 'json',
          },
        })
        .shape('name', 'text')
        .size(12)
        .color('#000')
        .style({
          textAnchor: 'left',
          textOffset: [80, 0],
          stroke: '#fff',
          strokeWidth: 1,
        });
      scene.addLayer(busStopsName);
    });
  });
});
```

## Runtime environment

Before evaluating the example, await this setup in a page containing #container. Supporting files follow below.

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/amap-plugin/bus/demo/busstop.js" });
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
