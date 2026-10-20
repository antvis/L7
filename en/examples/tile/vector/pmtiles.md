---
title: "pmtiles"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/examples/tile/vector/pmtiles/"
---

# pmtiles

[Live example](https://l7.antv.antgroup.com/en/examples/tile/vector/pmtiles/)

[Resource index](/llms.txt)

Provide a DOM element with `id="container"`. The original example source follows.

## Source

```ts
// @ts-ignore
import { PointLayer, PolygonLayer, Scene, Source } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import { Protocol } from 'pmtiles';
const protocol = new Protocol();
Scene.addProtocol('pmtiles', protocol.tile);
const scene = new Scene({
  id: 'map',
  map: new Map({
    center: [11.2438, 43.7799],
    zoom: 12,
  }),
});

const source = new Source(
  'pmtiles://https://mdn.alipayobjects.com/afts/file/A*HYvHSZ-wQmIAAAAAAAAAAAAADrd2AQ/protomaps(vector)ODbL_firenze.bin',
  {
    parser: {
      type: 'mvt',
      tileSize: 256,
      maxZoom: 14,
      extent: [-180, -85.051129, 179, 85.051129],
    },
  },
);

const layer = new PolygonLayer({
  //   featureId: 'COLOR',
  sourceLayer: 'earth', // woods hillshade contour ecoregions ecoregions2 city
});
layer
  .source(source)
  .color('#f7f7f7')

  .style({
    opacity: 0.5,
  });
const boundaries = new PolygonLayer({
  //   featureId: 'COLOR',
  sourceLayer: 'boundaries', // woods hillshade contour ecoregions ecoregions2 city
})
  .source(source)
  .color('#ffffbf')
  .shape('line')
  .size(1)
  .style({
    opacity: 1,
  });

const buildings = new PolygonLayer({
  //   featureId: 'COLOR',
  sourceLayer: 'buildings', // woods hillshade contour ecoregions ecoregions2 city
})
  .source(source)
  .color('#f1b6da')
  .shape('fill')
  .style({
    opacity: 1,
  });

const natural = new PolygonLayer({
  //   featureId: 'COLOR',
  sourceLayer: 'natural', // woods hillshade contour ecoregions ecoregions2 city
})
  .source(source)
  .color('#e6f5d0')
  .shape('fill')

  .style({
    opacity: 1,
  });

const water = new PolygonLayer({
  //   featureId: 'COLOR',
  sourceLayer: 'water', // woods hillshade contour ecoregions ecoregions2 city
})
  .source(source)
  .color('#92c5de')
  .shape('fill')

  .style({
    opacity: 1,
  });
const roads = new PolygonLayer({
  //   featureId: 'COLOR',
  sourceLayer: 'roads', // woods hillshade contour ecoregions ecoregions2 city
})
  .source(source)
  .color('#bababa')
  .shape('line')
  .size(0.5)
  .style({
    opacity: 1,
  });
const transit = new PolygonLayer({
  //   featureId: 'COLOR',
  sourceLayer: 'transit', // woods hillshade contour ecoregions ecoregions2 city
})
  .source(source)
  .color('#542788')
  .shape('line')
  .size(0.5)
  .style({
    opacity: 1,
  });

const point = new PointLayer({
  //   featureId: 'COLOR',
  sourceLayer: 'places', // woods hillshade contour ecoregions ecoregions2 city
})
  .source(source)
  .color('#542788')
  .shape('circle')
  .size(5)
  .style({
    opacity: 1,
  });

scene.on('loaded', () => {
  scene.addLayer(layer);
  scene.addLayer(boundaries);
  scene.addLayer(natural);
  scene.addLayer(buildings);
  scene.addLayer(transit);
  scene.addLayer(roads);
  scene.addLayer(water);
  scene.addLayer(point);
});
```

## Runtime environment

Before evaluating the example, await this setup in a page containing #container. Supporting files follow below.

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/tile/vector/demo/pmtiles.ts" });
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
