---
title: 快速上手
order: 0
redirect_from:
  - /zh/docs/tutorial
---

# L7 

Current version:  ![L7 2.0版本号](https://badgen.net/npm/v/@antv/l7/beta)

## 使用方法

###  通过  L7 CDN 使用

Include the L7 JS JavaScript  <head> of your HTML file.

:warning: 如果需要引用第三方地图API，请确保在先引入第三方API，然后引入L7

```html
<head>
<! --引入第三方地图JSAPI--> 
<script src='https://gw.alipayobjects.com/os/antv/pkg/_antv.l7-2.0.0-beta.26/dist/l7.js'>
</script>
</head>
```

- [use Gaode Map](./map/amap)

- [use Mapbox Map ](./map/mapbox)


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

### React中使用

React 组件待开发，期待和大家共建l7-react 目前可以暂时以 Submodule 方式使用

```
import { Scene, PolygonLayer } from '@antv/l7';
import { AMap } from '@antv/l7-maps';
import * as React from 'react';

export default class AMapExample extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const response = await fetch(
      'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json',
    );
    const scene = new Scene({
      id: 'map',
      map: new AMap({
        center: [110.19382669582967, 50.258134],
        pitch: 0,
        style: 'dark',
        zoom: 3,
        token: 'pg.xxx', // 高德或者 Mapbox 的 token
      }),
    });
    const layer = new PolygonLayer({});

    layer
      .source(await response.json())
      .size('name', [0, 10000, 50000, 30000, 100000])
      .color('name', [
        '#2E8AE6',
        '#69D1AB',
        '#DAF291',
        '#FFD591',
        '#FF7A45',
        '#CF1D49',
      ])
      .shape('fill')
      .style({
        opacity: 0.8,
      });
    scene.addLayer(layer);
    this.scene = scene;
  }

  public render() {
    return (
      <div
        id="map"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
    );
  }
}
```

⚠️组件 Unmount 时需要通过 scene.destroy() 手动销毁场景。

更多React使用 [示例查看](https://github.com/antvis/L7/tree/master/stories) 

### Vue 欢迎补充
[1.x Vue 使用](https://codesandbox.io/s/l7-vue1xdemo-wknsz)
### Html
[2.0版本 HTML 使用模板](https://codesandbox.io/s/l7htmltemplate-vp2lp)
