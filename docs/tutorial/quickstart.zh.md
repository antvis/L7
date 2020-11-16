---
title: 快速上手
order: 0
redirect_from:
  - /zh/docs/tutorial
---
`markdown:docs/common/style.md`
# L7 

Current version:  ![L7 2.0版本号](https://badgen.net/npm/v/@antv/l7)

## 使用方法

###  通过  L7 CDN 使用

Include the L7 JS JavaScript  <head> of your HTML file.

⚠️  如果需要引用第三方地图API，请确保在先引入第三方API，然后引入L7

```html
<head>
<! --引入最新版的L7--> 
<script src = 'https://unpkg.com/@antv/l7'></script>

<! --指定版本号引入L7--> 
<script src = 'https://unpkg.com/@antv/l7@2.0.11'></script>

</head>
```

- [use Gaode Map](./map/amap)

- [use Mapbox Map ](./map/mapbox)


## 通过 Module  bundle 使用

Install the npm package.

```bash

// L7 依赖
npm install --save @antv/l7

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
## 不同项目使用模板

不同项目模板在CodeSandbox你可以预览，也可以下载到本地

### React

[地址](https://codesandbox.io/s/l720react-jfwyz)

### Vue

[地址](https://codesandbox.io/s/l720vue-uef1x)

### Angular

[地址](https://codesandbox.io/s/angulartest-chpff)

### HTML CDN
[地址](https://codesandbox.io/s/l7cdndemo-gfg9m)
