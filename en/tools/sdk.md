---
title: "Data SDK"
description: "Data SDK"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/tools/sdk/"
---

[Resource index](/llms.txt)

[Interactive content](<https://l7.antv.antgroup.com/en/tools/sdk/>)



## 简介

DistrictData SDK 通过前端 JS SDK 更好的使用行政区划，无需下载数据， 数据服务托管在 npm 服务器。

## 数据源介绍

### RDBSource

基于于权威的行政区划数据，制作的一套 2015 年-2022 年的长时间序列的、具有符合民政部属性的、开放获取的行政区划数据

## 安装

### npm 安装

```bash
npm i district-data

```

### cdn 引用

```html
<script href='https://unpkg.com/district-data/dist/umd/district-data.min.js'>

```

## 使用

### option

- version 数据版本
- type 坐标系

**注意在使用 `type` 之前请保证 `version` 为 `2024` 及以上。**

```ts
import { RDBSource } from 'district-data';
const source = new RDBSource({
  version: 2024,
  type: 'gcj02', // 默认
});
```

### getdata(options)

- level 区划等级 `'country' | 'province'| 'city'| 'district'| 'jiuduanxian'`

```ts
// 获取全国的数据
source.getData({
  level: 'country',
});
```

```ts
// 获取全国省级数据
source.getData({
  level: 'province',
});
```



Before evaluating the example, await this setup in a page containing #container. Supporting files follow below.

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/docs/tools/demo/city.tsx" });
```

```ts
import { createRoot } from 'react-dom/client';
import '../../../src/demo/amap';
// https://unpkg.com/xinzhengqu@1.0.0/data/2023_xian.pbf

// @ts-ignore
import { PolygonLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import { RDBSource } from 'district-data';
import { useEffect } from 'react';

// import geobuf from 'geobuf';
// import Pbf from 'pbf';

const Example = () => {
  // @ts-ignore
  useEffect(() => {
    let disposed = false;
    const scene = new Scene({
      id: 'map1',
      map: new GaodeMap({
        center: [121.4, 31.258134],
        zoom: 2,
        pitch: 0,
        style: 'normal',
        doubleClickZoom: false,
      }),
    });

    const source = new RDBSource({});
    source.getData({ level: 'province' }).then((data) => {
      if (disposed) return;
      const fill = new PolygonLayer({
        autoFit: true,
      })
        .source(data)
        .shape('fill')
        .color('name', [
          '#a6cee3',
          '#1f78b4',
          '#b2df8a',
          '#33a02c',
          '#fb9a99',
          '#e31a1c',
          '#fdbf6f',
          '#ff7f00',
          '#cab2d6',
          '#6a3d9a',
          '#ffff99',
          '#b15928',
        ])
        .active(false);
      scene.addLayer(fill);
    });
    return () => {
      disposed = true;
      scene.destroy();
    };
  }, []);
  return (
    <div
      id="map1"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};

createRoot(document.getElementById('container')!).render(<Example />);
```



### getChildrenData(options)

- parentAdcode 父级 adcode
- parentLevel 父级 等级 `'country' | 'province'| 'city'| 'district'| 'jiuduanxian'`
- childrenLevel 子层级 `'country' | 'province'| 'city'| 'district'| 'jiuduanxian'`

```ts

// 获取浙江省围栏
source.getChildrenData({
    parentAdcode:330000
    parentLevel:'province',
    childrenLevel:'province'
});

```

```ts

// 获取浙江省所有的市
source.getChildrenData({
    parentAdcode:330000
    parentLevel:'province',
    childrenLevel:'city'
});

```

```ts
// 获取浙江省所有县
source.getChildrenData({
    parentAdcode:330000
    parentLevel:'province',
    childrenLevel:'county'
});

```



Before evaluating the example, await this setup in a page containing #container. Supporting files follow below.

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/docs/tools/demo/zhejiang.tsx" });
```

```ts
import { createRoot } from 'react-dom/client';
import '../../../src/demo/amap';
// https://unpkg.com/xinzhengqu@1.0.0/data/2023_xian.pbf

// @ts-ignore
import { PolygonLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import { RDBSource } from 'district-data';
import { useEffect } from 'react';

// import geobuf from 'geobuf';
// import Pbf from 'pbf';

const Example = () => {
  // @ts-ignore
  useEffect(() => {
    let disposed = false;
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [121.4, 31.258134],
        zoom: 2,
        pitch: 0,
        style: 'normal',
        doubleClickZoom: false,
      }),
    });

    const source = new RDBSource({});
    source
      .getChildrenData({
        parentAdcode: 110000,
        parentLevel: 'city',
        childrenLevel: 'county',
      })
      .then((data) => {
        if (disposed) return;
        const fill = new PolygonLayer({
          autoFit: true,
        })
          .source(data)
          .shape('fill')
          .color('name', [
            '#a6cee3',
            '#1f78b4',
            '#b2df8a',
            '#33a02c',
            '#fb9a99',
            '#e31a1c',
            '#fdbf6f',
            '#ff7f00',
            '#cab2d6',
            '#6a3d9a',
            '#ffff99',
            '#b15928',
          ])
          .active(false);
        scene.addLayer(fill);
      });
    return () => {
      disposed = true;
      scene.destroy();
    };
  }, []);
  return (
    <div
      id="map"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};

createRoot(document.getElementById('container')!).render(<Example />);
```
### src/demo/setup.ts

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
### src/demo/map.css

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
### src/demo/amap.ts

```ts
import AMapLoader from '@amap/amap-jsapi-loader';

// Preserve the site's development and production SDK registrations.
const credentials = import.meta.env.DEV
  ? { key: '6f025e700cbacbb0bb866712d20bb35c', securityJsCode: '290ddc4b0d33be7bc9b354bc6a4ca614' }
  : { key: 'f59bcf249433f8b05caaee19f349b3d7', securityJsCode: '2653011adeb04230b3a26cc9a780a800' };
window._AMapSecurityConfig = { securityJsCode: credentials.securityJsCode };
await AMapLoader.load({ key: credentials.key, version: '2.0', plugins: ['Map3D'] });
```
