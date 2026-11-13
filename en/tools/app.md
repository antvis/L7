---
title: "Applications"
description: "Applications"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/tools/app/"
---

[Resource index](/llms.txt)

[Interactive content](<https://l7.antv.antgroup.com/en/tools/app/>)


## 应用案例



Before evaluating the example, await this setup in a page containing #container. Supporting files follow below.

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/docs/tools/demo/china.tsx" });
```

```ts
import { createRoot } from 'react-dom/client';
// https://unpkg.com/xinzhengqu@1.0.0/data/2023_xian.pbf

// @ts-ignore
import { LineLayer, Scene } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import { useEffect } from 'react';

const Example = () => {
  // @ts-ignore
  useEffect(() => {
    let disposed = false;
    const scene = new Scene({
      id: 'map',
      map: new Map({
        center: [121.4, 31.258134],
        zoom: 2,
        pitch: 0,
        maxZoom: 4,
        style: 'normal',
        doubleClickZoom: false,
      }),
    });

    const fetchData = () => {
      fetch(
        'https://mdn.alipayobjects.com/afts/file/A*zMVuS7mKBI4AAAAAAAAAAAAADrd2AQ/%E5%85%A8%E5%9B%BD%E8%BE%B9%E7%95%8C.json',
      )
        .then((response) => response.json())
        .then((data) => {
          if (disposed) return;
          const line = new LineLayer({})
            .source(data)
            .size(1)
            .shape('line')
            .color('type', ['#e41a1c', '#ff7f00', '#4daf4a', '#377eb8', '#984ea3', '#377eb8'])
            .scale('type', {
              type: 'cat',
              domain: ['haishangshengjie', 'xianggangjie', 'haianxian', 'guojiexian'],
            })
            .style({ opacity: 1.0 });

          scene.addLayer(line);
        });
    };
    fetchData();
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
