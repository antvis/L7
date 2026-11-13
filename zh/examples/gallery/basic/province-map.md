---
title: "福建省地图"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/examples/gallery/basic/province-map/"
---

# 福建省地图

[运行示例](https://l7.antv.antgroup.com/zh/examples/gallery/basic/province-map/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```ts
import { PointLayer, PolygonLayer, Scene } from '@antv/l7';
import { Map } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Map({
    pitch: 0,
    style: 'light',
    center: [118, 24.8],
    zoom: 6,
  }),
});
scene.on('loaded', async () => {
  scene.addImage(
    'province',
    'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*hvqeQa9I6ccAAAAAAAAAAAAADmJ7AQ/original',
  );
  scene.addImage(
    'city',
    'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*sBlgRp8Ah7sAAAAAAAAAAAAADmJ7AQ/original',
  );
  scene.addImage(
    'county',
    'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*ufrWTqCNCScAAAAAAAAAAAAADmJ7AQ/original',
  );
  // 获取数据
  const dataList = [
    // 市级行政区
    'https://mdn.alipayobjects.com/afts/file/A*jPjCTad_s24AAAAAAAAAAAAADrd2AQ/%E5%B8%82%E7%BA%A7%E8%A1%8C%E6%94%BF%E5%8C%BA%E5%B8%82%E7%BA%A7%E8%A1%8C%E6%94%BF%E5%8C%BA.json',
    // 市级行政区一级群列岛名
    'https://mdn.alipayobjects.com/afts/file/A*HW8yQb2joA8AAAAAAAAAAAAADrd2AQ/%E5%B8%82%E7%BA%A7%E8%A1%8C%E6%94%BF%E5%8C%BA%E4%B8%80%E7%BA%A7%E7%BE%A4%E5%88%97%E5%B2%9B%E5%90%8D.json',
    ///市级行政区一级河流名.json
    'https://mdn.alipayobjects.com/afts/file/A*EjtNRrENGToAAAAAAAAAAAAADrd2AQ/市级行政区一级河流名.json',
    //市级行政区一级港湾名.json
    'https://mdn.alipayobjects.com/afts/file/A*lqxATobbMLwAAAAAAAAAAAAADrd2AQ/%E5%B8%82%E7%BA%A7%E8%A1%8C%E6%94%BF%E5%8C%BA%E4%B8%80%E7%BA%A7%E6%B8%AF%E6%B9%BE%E5%90%8D.json',
    //市级行政区一级岛屿名.json
    'https://mdn.alipayobjects.com/afts/file/A*xyeHRZCF8DsAAAAAAAAAAAAADrd2AQ/%E5%B8%82%E7%BA%A7%E8%A1%8C%E6%94%BF%E5%8C%BA%E4%B8%80%E7%BA%A7%E5%B2%9B%E5%B1%BF%E5%90%8D.json',
    //市级行政区县级行政中心.json
    'https://mdn.alipayobjects.com/afts/file/A*vrDfSrB8J4sAAAAAAAAAAAAADrd2AQ/%E5%B8%82%E7%BA%A7%E8%A1%8C%E6%94%BF%E5%8C%BA%E5%8E%BF%E7%BA%A7%E8%A1%8C%E6%94%BF%E4%B8%AD%E5%BF%83.json',
    //市级行政区县级行政区.json
    'https://mdn.alipayobjects.com/afts/file/A*lfffQ5ej7AEAAAAAAAAAAAAADrd2AQ/%E5%B8%82%E7%BA%A7%E8%A1%8C%E6%94%BF%E5%8C%BA%E5%8E%BF%E7%BA%A7%E8%A1%8C%E6%94%BF%E5%8C%BA.json',
    // 市级行政区省级行政中心.json
    'https://mdn.alipayobjects.com/afts/file/A*jtlsTqxTJkoAAAAAAAAAAAAADrd2AQ/%E5%B8%82%E7%BA%A7%E8%A1%8C%E6%94%BF%E5%8C%BA%E7%9C%81%E7%BA%A7%E8%A1%8C%E6%94%BF%E4%B8%AD%E5%BF%83.json',
    //市级行政区山峰.json
    'https://mdn.alipayobjects.com/afts/file/A*DRSfRqBs9qsAAAAAAAAAAAAADrd2AQ/市级行政区山峰.json',
    //市级行政区色带.json
    'https://mdn.alipayobjects.com/afts/file/A*KRD4QbjkZCMAAAAAAAAAAAAADrd2AQ/%E5%B8%82%E7%BA%A7%E8%A1%8C%E6%94%BF%E5%8C%BA%E8%89%B2%E5%B8%A6.json',
    //市级行政区面状水域.json
    'https://mdn.alipayobjects.com/afts/file/A*3e9nSJwXqu0AAAAAAAAAAAAADrd2AQ/%E5%B8%82%E7%BA%A7%E8%A1%8C%E6%94%BF%E5%8C%BA%E9%9D%A2%E7%8A%B6%E6%B0%B4%E5%9F%9F.json',
    //市级行政区境界线.json
    'https://mdn.alipayobjects.com/afts/file/A*tA8nSqhulQQAAAAAAAAAAAAADrd2AQ/%E5%B8%82%E7%BA%A7%E8%A1%8C%E6%94%BF%E5%8C%BA%E5%A2%83%E7%95%8C%E7%BA%BF.json',
    //市级行政区河流.json
    'https://mdn.alipayobjects.com/afts/file/A*2vGmRrYpTjEAAAAAAAAAAAAADrd2AQ/%E5%B8%82%E7%BA%A7%E8%A1%8C%E6%94%BF%E5%8C%BA%E6%B2%B3%E6%B5%81.json',
    //市级行政区海岸线.json
    'https://mdn.alipayobjects.com/afts/file/A*juI9TpBcQ74AAAAAAAAAAAAADrd2AQ/%E5%B8%82%E7%BA%A7%E8%A1%8C%E6%94%BF%E5%8C%BA%E6%B5%B7%E5%B2%B8%E7%BA%BF.json',
    //市级行政区二级群列岛名.json
    'https://mdn.alipayobjects.com/afts/file/A*E4ReSqdYq-cAAAAAAAAAAAAADrd2AQ/%E5%B8%82%E7%BA%A7%E8%A1%8C%E6%94%BF%E5%8C%BA%E4%BA%8C%E7%BA%A7%E7%BE%A4%E5%88%97%E5%B2%9B%E5%90%8D.json',
    //市级行政区地级市行政中心.json
    'https://mdn.alipayobjects.com/afts/file/A*I3HSQaYyQ_UAAAAAAAAAAAAADrd2AQ/%E5%B8%82%E7%BA%A7%E8%A1%8C%E6%94%BF%E5%8C%BA%E5%9C%B0%E7%BA%A7%E5%B8%82%E8%A1%8C%E6%94%BF%E4%B8%AD%E5%BF%83.json',
    //市级行政区大型水库名.json
    'https://mdn.alipayobjects.com/afts/file/A*xxXKTpte0VUAAAAAAAAAAAAADrd2AQ/%E5%B8%82%E7%BA%A7%E8%A1%8C%E6%94%BF%E5%8C%BA%E5%A4%A7%E5%9E%8B%E6%B0%B4%E5%BA%93%E5%90%8D.json',
  ];

  const result = await Promise.all(dataList.map(async (url) => await (await fetch(url)).json()));
  const cityLayer = new PolygonLayer({
    autoFit: true,
  })
    .source(result[6])
    .shape('fill')
    .scale('COLOR', {
      type: 'cat',
      domain: ['Y', 'P', 'G', 'R'],
    })
    .color('COLOR', ['#f7f6c6', '#fceaea', '#e0e7d5', '#f3e4cf']);

  // 陆上轮廓
  const layer2 = new PolygonLayer().source(result[9]).shape('fill').color('#b4cad7');

  // 水域
  const waterLayer = new PolygonLayer().source(result[10]).shape('fill').color('#bcebfe');
  // 面状河流线
  const waterLayerLine = new PolygonLayer()
    .source(result[10])
    .shape('line')
    .size(0.5)
    .color('#50aac8');

  // 线河流线
  const river_Line = new PolygonLayer().source(result[12]).shape('line').size(0.5).color('#50aac8');
  // 群岛标注图层
  const island_name = new PointLayer({
    minZoom: 8,
  })
    .source(result[1])
    .shape('NAME', 'text')
    .size(15)
    .color('#3b474e');

  // 河流标注图层
  const river_name = new PointLayer({ minZoom: 5 })
    .source(result[2])
    .shape('NAME', 'text')
    .size(15)
    .color('#4aa1bd')
    .style({
      fontWeight: 800,
    });
  // 港湾标注
  const gangwan_name = new PointLayer({
    minZoom: 6,
  })
    .source(result[3])
    .shape('NAME', 'text')
    .size(15)
    .color('#4eaed9')
    .style({
      fontWeight: 800,
    });
  // 群岛
  const island_name1 = new PointLayer({
    minZoom: 8,
  })
    .source(result[4])
    .shape('NAME', 'text')
    .size(15)
    .color('#3b474e')
    .style({
      fontWeight: 600,
    });

  // 县界
  const county_Line = new PolygonLayer({
    minZoom: 5,
  })
    .source(result[11])
    .shape('line')
    .size(0.3)
    .color('#a59f97');
  // 城市界
  const city_Line = new PolygonLayer().source(result[0]).shape('line').size(0.5).color('#787269');

  // 海岸线
  const sea_Line = new PolygonLayer().source(result[13]).shape('line').size(0.5).color('#50aac8');

  // 城市标注
  const cityName = new PointLayer({
    maxZoom: 8,
    minZoom: 5,
  })
    .source(result[15])
    .shape('NAME', 'text')
    .size(14)
    .color('#000')
    .style({
      fontWeight: 800,
      textAnchor: 'top',
      textAllowOverlap: true,
      textOffset: [0, 12],
    });

  // 城市点位

  const cityPoint = new PointLayer({
    maxZoom: 7,
    minZoom: 5,
  })
    .source(result[15])
    .shape('city')
    .size(5);

  // 省级市标注
  const provinceCityName = new PointLayer({
    minZoom: 5,
    maxZoom: 7,
  })
    .source(result[7])
    .shape('NAME', 'text')
    .size(14)
    .color('#000')
    .style({
      fontWeight: 800,
      textAnchor: 'top',
      textOffset: [0, 12],
    });

  // 省级市点位
  const provincePoint = new PointLayer({
    minZoom: 5,
    maxZoom: 7,
  })
    .source(result[7])
    .shape('province')
    .size(5);

  // 县标注
  const countyName = new PointLayer({
    minZoom: 8,
  })
    .source(result[5])
    .shape('NAME', 'text')
    .size(14)
    .color('#333')
    .style({
      fontWeight: 600,
      textAnchor: 'top',
      textOffset: [0, 12],
    });
  7;
  // 县点位
  const countyPoint = new PointLayer({
    minZoom: 8,
  })
    .source(result[5])
    .shape('county')
    .size(5);

  // 县标注
  const mountainPoint = new PointLayer({
    minZoom: 6,
  })
    .source(result[8])
    .shape('triangle')
    .size(6)
    .color('#326648');

  // 山标注
  const mountainPoint_name = new PointLayer({
    minZoom: 6,
  })
    .source(result[8])
    .shape('NAME', 'text')
    .size(14)
    .color('#326648')
    .style({
      fontWeight: 800,
      textAnchor: 'top',
      textOffset: [0, 12],
    });

  scene.addLayer(cityLayer);
  scene.addLayer(layer2);
  scene.addLayer(waterLayer);
  scene.addLayer(waterLayerLine);
  scene.addLayer(river_Line);
  scene.addLayer(county_Line);

  scene.addLayer(city_Line);
  scene.addLayer(sea_Line);

  scene.addLayer(cityName);
  scene.addLayer(cityPoint);
  scene.addLayer(countyName);
  scene.addLayer(countyPoint);
  scene.addLayer(provinceCityName);
  scene.addLayer(provincePoint);
  scene.addLayer(island_name);
  scene.addLayer(island_name1);
  scene.addLayer(gangwan_name);
  scene.addLayer(river_name);
  scene.addLayer(mountainPoint);
  scene.addLayer(mountainPoint_name);
  console.log(result);
});
```

## 运行环境

运行示例前，先在含有 #container 的页面中等待以下初始化完成。相关文件附于文末。

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/gallery/basic/demo/province-map.ts" });
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
