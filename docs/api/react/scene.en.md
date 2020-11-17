---
title: Scene
order: 1
---

`markdown:docs/common/style.md`

## 使用

在 React 版本中 Mapbox 和高德地图作为两个组件封装的。

```javascript
import { MapboxScene, AmapScene } from '@antv/l7-react';
```

## Scene Props

| prop name     | Type           | Default    | Description                               |
| ------------- | -------------- | ---------- | ----------------------------------------- |
| style         | `Object`       | `null`     | scene css 样式                            |
| className     | `string`       | `null`     | 样式名称                                  |
| map           | `map option`   | `Required` | map option [地图配置项](#map-option)      |
| option        | `scene option` | `void`     | scene option 配置项 [详情](#scene-option) |
| onSceneLoaded | `Function`     | `void`     | scene 加载回调函数                        |

### 高德地图场景

```jsx
import { AMapScene } from '@antv/l7-react';
<AMapScene
  option={{}}
  map={{
    style: 'light',
    center: [112, 20],
    token: '',
  }}
/>;
```

### Mapbox 地图场景

```jsx
import { MapboxScene } from '@antv/l7-react';
<MapboxScene
  option={{}}
  map={{
    style: 'light',
    center: [112, 20],
    token: '',
  }}
/>;
```

### map option

地图配置项

| option   | Type       | Default            | Description                                                                                                     |
| -------- | ---------- | ------------------ | --------------------------------------------------------------------------------------------------------------- |
| style    | `string`   | `light`            | 地图样式 `dark|light|normal|blank` L7 默认提供四种样式，同时也支持自定义样式                                    |
| token    | `string`   | `Required`         | 地图密钥，需要平台申请                                                                                          |
| plugin   | `string[]` | `null`             | 高德地图[API 插件](https://lbs.amap.com/api/javascript-api/guide/abc/plugins) `['AMap.ToolBar','AMap.Driving']` |
| center   | `number`   | null               | 地图中心点                                                                                                      |
| pitch    | `number`   | 0                  | 地图倾角                                                                                                        |
| rotation | `number`   | 0                  | 地图旋转角                                                                                                      |
| zoom     | `number`   | null               | 地图缩放等级                                                                                                    |
| maxZoom  | `number`   | 0                  | 最大缩放等级                                                                                                    |
| minZoom  | `number`   | AMap 18 ,Mapbox 20 | 最小缩放等级                                                                                                    |

其他配置项见地图文档
高德地图 Map [配置项](https://lbs.amap.com/api/javascript-api/reference/map)

Mapbox Map 地图配置项 [配置项](https://docs.mapbox.com/mapbox-gl-js/api/#map)

其他配置项和底图一致

### scene option

| option                | Type      | Default      | Description                                         |
| --------------------- | --------- | ------------ | --------------------------------------------------- |
| logoPosition          | string    | `bottomleft` | logo 位置 `bottomright|topright|bottomleft|topleft` |
| logoVisible           | `boolean` | `true`       | 是否显示 logo                                       |
| antialias             | `boolean` | `true`       | 是否开启抗锯齿                                      |
| preserveDrawingBuffer | `boolean` | `false`      | 是否保留缓冲区数据                                  |

### 获取 scene 对象

#### onSceneLoaded

onSceneLoaded 回调函数能够取到 scene 对象

#### Context API

```jsx
import { SceneContext } from '@antv/l7-react';
<SceneContext.Consumer>
  {(scene) => {
    // use `scene` here
  }}
</SceneContext.Consumer>;
```

## 子组件

### LoadImage

| prop name | Type     | Default | Description |
| --------- | -------- | ------- | ----------- |
| name      | `string` | `null`  | 图标名称    |
| url       | `string` | `null`  | 图标 url    |

```jsx
import LoadImage from '@antv/l7-react';
<LoadImage name="marker" url="xxx.png" />;
```

### Layer 组件

每个图层作为 scene 子组件添加

###  事件组件

| prop name | Type       | Default | Description                         |
| --------- | ---------- | ------- | ----------------------------------- |
| type      | `string`   | `null`  | 事件类型 [详情](../scene/#地图事件) |
| handler   | `Function` | `null`  | scene 回调函数                      |

```javascript
import { SceneEvent, MapboxScene } from '@antv/l7-react';

<MapboxScene>
  <SceneEvent type="click" handler={() => {}} />
</MapboxScene>;
```
