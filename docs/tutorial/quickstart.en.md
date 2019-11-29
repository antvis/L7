---
title: 快速上手
order: 0
redirect_from:
  - /en/docs/tutorial
---

## L7 

Current version: 2.0.0-beta.10

# 使用方法


##   通过L7 CDN 使用

Include the L7 JS JavaScript  <head> of your HTML file.

```html
<head>
<script src='https://gw.alipayobjects.com/os/antv/pkg/_antv.l7-2.0.0-beta.14/dist/l7.js'>
</script>
</head>
```

- [use Gaode Map](../map/amap.en.md)

- [use Mapbox Map ](../map/mapbox.en.md)


## 通过 Module  bundle 使用

Install the npm package.

```bash

// L7 依赖
npm install --save @antv/l7@beta

// 第三方底图依赖
npm install --save @antv/l7-maps;

```

### 初始化地图

#### 使用 高德 底图

```javascript

import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 35.210526315789465,
    style: 'dark',
    center: [ 104.288144, 31.239692 ],
    zoom: 4.4
  })
});
```

#### 使用Mapbox 底图

```javascript

import { Scene, HeatmapLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    style: 'dark',
    pitch: 0,
    center: [ 127.5671666579043, 7.445038892195569 ],
    zoom: 2.632456779444394
  })
});

```

