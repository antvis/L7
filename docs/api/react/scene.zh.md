---
title: 高德地图
order: 1
---

## Scene Props

| prop name     | Type       | Default    | Description                            |
| ------------- | ---------- | ---------- | -------------------------------------- |
| style         | `Object`   | `null`     | scene css 样式                         |
| className     | `string`   | `null`     | 样式名称                               |
| map           | `Object`   | `Required` | map option [地图配置项]()              |
| option        | `Object`   | `void`     | scene option 配置项 [详情](#map-props) |
| onSceneLoaded | `Function` | `void`     | scene 加载回调函数                     |

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
