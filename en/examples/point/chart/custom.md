---
title: "自定义水位图"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/examples/point/chart/custom/"
---

# 自定义水位图

[Live example](https://l7.antv.antgroup.com/en/examples/point/chart/custom/)

[Resource index](/llms.txt)

Provide a DOM element with `id="container"`. The original example source follows.

## Source

```js
import { CanvasLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
let x = 0;
function draw(option) {
  const { size, ctx, mapService } = option;
  const [width, height] = size;

  const radius = 30,
    rectWidth = radius * 2;
  const rectHeight = rectWidth;

  ctx.clearRect(0, 0, width, height);

  const points = [
    {
      lng: 108.544921875,
      lat: 30.977609093348686,
      level: 85,
      color: 'rgba(	220,20,60, 0.6)',
    },
    {
      lng: 110.654296875,
      lat: 31.090574094954192,
      level: 75,
      color: 'rgba(	255,140,0, 0.6)',
    },
    {
      lng: 112.5,
      lat: 29.80251790576445,
      level: 65,
      color: 'rgba(255,165,0, 0.6)',
    },
    {
      lng: 114.78515624999999,
      lat: 30.64867367928756,
      level: 40,
      color: 'rgba(30,144,255, 0.6)',
    },
    {
      lng: 116.49902343749999,
      lat: 29.84064389983441,
      level: 50,
      color: 'rgba(30,144,255, 0.6)',
    },
    {
      lng: 118.21289062499999,
      lat: 31.16580958786196,
      level: 20,
      color: 'rgba(	127,255,0, 0.6)',
    },
    {
      lng: 119.091796875,
      lat: 32.509761735919426,
      level: 50,
      color: 'rgba(30,144,255, 0.6)',
    },
    {
      lng: 121.0693359374999,
      lat: 31.80289258670676,
      level: 45,
      color: 'rgba(30,144,255, 0.6)',
    },
  ];
  ctx.fillStyle = 'rgb(35,75,225)';
  ctx.font = 'normal small-caps bold 14px arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  points.map((point) => {
    const pixelCenter = mapService.lngLatToContainer([point.lng, point.lat]);
    pixelCenter.x *= window.devicePixelRatio;
    pixelCenter.y *= window.devicePixelRatio;
    const rectStartX = pixelCenter.x - radius;
    const rectStartY = pixelCenter.y - radius;

    ctx.save();

    ctx.fillText(point.level + '%', pixelCenter.x, pixelCenter.y);

    ctx.beginPath();
    ctx.arc(pixelCenter.x, pixelCenter.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(135,206,250,0.2)';
    ctx.closePath();
    ctx.fill();
    ctx.clip();

    ctx.beginPath();
    ctx.fillStyle = point.color;
    ctx.moveTo(rectStartX, pixelCenter.y);

    const waterheight = rectStartY + ((100 - point.level) / 100) * rectHeight;
    for (let i = 0; i <= rectWidth; i += 10) {
      ctx.lineTo(rectStartX + i, waterheight + Math.sin(Math.PI * 2 * (i / rectWidth) + x) * 3 + 1);
    }

    ctx.lineTo(pixelCenter.x + radius, pixelCenter.y + radius);
    ctx.lineTo(rectStartX, pixelCenter.y + radius);
    ctx.lineTo(rectStartX, pixelCenter.y);
    ctx.closePath();

    ctx.fill();

    ctx.restore();
    return '';
  });
  return '';
}

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'fresh',
    center: [115, 31],
    zoom: 5.0,
  }),
});
scene.on('loaded', () => {
  const layer = new CanvasLayer({
    zIndex: 10,
    trigger: 'change',
  });
  layer.draw(draw);
  scene.addLayer(layer);

  setInterval(() => {
    x += 0.1;
    scene.render();
    return '';
  }, 30);

  layer.on('add', () => {
    layer.getCanvas().addEventListener('click', (e) => {
      console.log(e);
    });
  });
});
```

## Runtime environment

Before evaluating the example, await this setup in a page containing #container. Supporting files follow below.

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/point/chart/demo/custom.js" });
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
