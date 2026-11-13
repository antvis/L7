---
title: "一带一路GDP"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/examples/gallery/story/yidaiyilu2/"
---

# 一带一路GDP

[Live example](https://l7.antv.antgroup.com/en/examples/gallery/story/yidaiyilu2/)

[Resource index](/llms.txt)

Provide a DOM element with `id="container"`. The original example source follows.

## Source

```js
import { Control, DOM, LayerPopup, LineLayer, PolygonLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
const styleElement = document.createElement('style');

// 在<style>元素中添加样式规则
styleElement.textContent = `
            .info {
                padding: 6px 8px;
                font: 14px/16px Arial, Helvetica, sans-serif;
                background: white;
                background: rgba(255,255,255,0.8);
                box-shadow: 0 0 15px rgba(0,0,0,0.2);
                border-radius: 5px;
            }
            .info h4 {
                margin: 0 0 5px;
                color: #777;
            }
              .legend {
                line-height: 18px;
                color: #555;
            }
            .legend i {
                width: 40px;
                height: 20px;
                float: left;
                margin-top: 5px;
                margin-right: 0px;
                opacity: 1;
                color: #000;
                font-weight: bold;
            }
            `;

// 将<style>元素添加到<head>元素中，实现样式注入
document.head.appendChild(styleElement);

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [116.368652, 39.93866],
    zoom: 0,
    maxZoom: 5,
    token: '6f025e700cbacbb0bb866712d20bb35c',
  }),
});
function getColor(d, color) {
  return d > 100000
    ? color[4]
    : d > 10000
      ? color[3]
      : d > 5000
        ? color[2]
        : d > 1000
          ? color[1]
          : d > 0
            ? color[0]
            : 'rgba(0,0,0,0)';
}
scene.on('loaded', async () => {
  const data = await (
    await fetch(
      'https://mdn.alipayobjects.com/afts/file/A*6dU9SL6RD8IAAAAAAAAAAAAADrd2AQ/world_gdp.json',
    )
  ).json();
  const data_line = await (
    await fetch(
      'https://mdn.alipayobjects.com/afts/file/A*5NgLQrPivBgAAAAAAAAAAAAADrd2AQ/line_2.json',
    )
  ).json();

  const features_1 = data.features.filter((fe) => fe.properties.flag === true);
  const features_2 = data.features.filter((fe) => fe.properties.flag === false);
  const layer1 = new PolygonLayer({})
    .source({
      type: 'FeatureCollection',
      features: features_1,
    })
    .color('gdp', ['#fdd49e', '#fdbb84', '#fc8d59', '#e34a33', '#b30000'])
    .shape('fill')
    .scale('gdp', {
      type: 'threshold',
      domain: [0, 1000, 5000, 10000, 100000, 300000],
    })
    .active(false)
    .style({
      opacity: 0.6,
    });

  const layer2 = new PolygonLayer({})
    .source({
      type: 'FeatureCollection',
      features: features_2,
    })
    .color('gdp', ['#c7e9b4', '#7fcdbb', '#41b6c4', '#2c7fb8', '#253494'])
    .shape('fill')
    // .filter('flag',flag=>!falg)
    .scale('gdp', {
      type: 'threshold',
      domain: [0, 1000, 5000, 10000, 100000, 300000],
    })
    .style({
      opacity: 0.6,
    })

    .active(false);
  const lineLayer = new LineLayer()
    .source(data_line)
    .filter('type', (t) => {
      return t === '11' || t === '1';
    })
    .color('#09f')
    .size(0.6)
    .shape('line')
    .style({
      lineType: 'dash',
      dashArray: [3, 3],
    });

  const lineLayer2 = new LineLayer()
    .source(data_line)
    .filter('type', (t) => {
      return t === '10';
    })
    .color('#09f')
    .size(0.6)
    .shape('line')
    .style({
      lineType: 'dash',
      dashArray: [2, 2],
    });

  const lineLayer3 = new LineLayer()
    .source(data_line)
    .filter('type', (t) => {
      return t === '0' || t === '9' || t === '7' || t === '2';
    })
    .color('type', (t) => {
      return t === '0' ? 'red' : t === '9' || t === '2' ? '#09f ' : '#fff';
    })
    .size(0.8)
    .shape('line');

  // const lineLayer4 = new LineLayer().source(data_line).filter('type',(t)=>{
  //     return t === '0'
  // }).color('red').size(1).shape('line').style();
  const layerPopup1 = new LayerPopup({
    items: [
      {
        layer: layer1,
        fields: [
          {
            field: 'NAME_CHN',
            formatField: () => '国家',
          },
          {
            field: 'gdp',
            formatField: () => 'GDP',
            formatValue: (val) => {
              return val < 0.00001 ? `${val * 10000 * 10000}美元` : `${val.toFixed(2)}亿美元`;
            },
          },
          {
            field: 'industries',
            formatField: () => '行业',
            formatValue: (val) => {
              return val || '';
            },
          },
          {
            field: 'relations',
            formatField: () => '关系',
            formatValue: (val) => {
              return val || '';
            },
          },
        ],
      },
    ],
  });
  const layerPopup2 = new LayerPopup({
    items: [
      {
        layer: layer2,
        fields: [
          {
            field: 'NAME_CHN',
            formatField: () => '国家',
          },
          {
            field: 'gdp',
            formatField: () => 'GDP',
            formatValue: (val) => {
              return val < 0.00001 ? `${val * 10000 * 10000}美元` : `${val.toFixed(2)}亿美元`;
            },
          },
        ],
      },
    ],
  });

  scene.addPopup(layerPopup1);
  scene.addPopup(layerPopup2);

  scene.addLayer(layer1);
  scene.addLayer(layer2);
  scene.addLayer(lineLayer);
  scene.addLayer(lineLayer2);
  scene.addLayer(lineLayer3);

  const legend = new Control({ position: 'bottomright' });
  // 0, 1000, 5000, 10000, 100000, 300000
  legend.onAdd = () => {
    var div = DOM.create('div', 'info legend'),
      grades = [0, 1000, 5000, 10000, 100000, -999],
      grades2 = [0, '1千', '5千', '1万', '10万', '30万/亿美元'];

    // loop through our density intervals and generate a label with a colored square for each interval

    for (var i = 0; i < grades.length; i++) {
      if (i < grades.length - 1) {
        div.innerHTML +=
          '<i style="background:' +
          getColor(grades[i] + 1, ['#c7e9b4', '#7fcdbb', '#41b6c4', '#2c7fb8', '#253494']) +
          '"></i>';
      } else {
        div.innerHTML +=
          '<i style=" width: 100px; margin-left: 10px; background:' +
          getColor(grades[i] + 1, ['#c7e9b4', '#7fcdbb', '#41b6c4', '#2c7fb8', '#253494']) +
          '">非一带一路国家</i>';
      }
    }
    div.innerHTML += '<br>';
    for (let i = 0; i < grades.length; i++) {
      if (i < grades.length - 1) {
        div.innerHTML +=
          '<i style="background:' +
          getColor(grades[i] + 1, ['#fdd49e', '#fdbb84', '#fc8d59', '#e34a33', '#b30000']) +
          '"></i>';
      } else {
        div.innerHTML +=
          '<i style=" width: 100px; margin-left: 10px; background:' +
          getColor(grades[i] + 1, ['#c7e9b4', '#7fcdbb', '#41b6c4', '#2c7fb8', '#253494']) +
          '">一带一路国家</i>';
      }
    }
    div.innerHTML += '<br>';

    for (let i = 0; i < grades2.length; i++) {
      if (i < grades.length - 1) {
        div.innerHTML += `<i>${grades2[i]}</>`;
      } else {
        div.innerHTML += `<i style=" width: 100px;">${grades2[i]}</>`;
      }
    }
    return div;
  };

  scene.addControl(legend);
});
```

## Runtime environment

Before evaluating the example, await this setup in a page containing #container. Supporting files follow below.

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/gallery/story/demo/yidaiyilu2.js" });
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
