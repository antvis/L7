---
title: "天地图"
description: "天地图"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/api/map/tianditu/"
---

[资料索引](/llms.txt)

## 简介

L7 地理可视化侧重于地理数据的可视化表达，地图层需要依赖第三方地图，第三方地图通过 Scene 统一创建管理，只需要通过 Scene 传入地图配置项即可。

L7 在内部解决了不同地图底图之间差异，同时 L7 层面统一管理地图的操作方法。

- [天地图 官网](http://lbs.tianditu.gov.cn/api/js4.0/guide.html)

## 申请 token

天地图 JavaScript API 4.0 支持 HTTP 和 HTTPS，免费对外开放，可直接使用。使用 API 之前，需要[申请应用 Key](https://console.tianditu.gov.cn/api/key)。

## import

```javascript
import { TdtMap } from '@antv/l7-maps';
```

## 使用

```ts
import { Scene } from '@antv/l7';
import { TdtMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new TdtMap({
    token: '你的天地图 token',
    center: [120, 30],
    zoom: 10,
  }),
});

scene.on('loaded', () => {
  // 添加图层
});
```

## 配置项

| 名称        | 说明                 | 类型               | 默认值                           |
| ----------- | -------------------- | ------------------ | -------------------------------- |
| token       | 天地图 API 的 Key    | `string`           | 内置测试 token（生产环境请替换） |
| center      | 地图初始中心经纬度   | `[number, number]` | `[121.30654, 31.25744]`          |
| zoom        | 地图初始缩放等级     | `number`           | `3`                              |
| minZoom     | 地图最小缩放等级     | `number`           | `1`                              |
| maxZoom     | 地图最大缩放等级     | `number`           | `18`                             |
| mapInstance | 传入已有的天地图实例 | `T.Map`            | -                                |

## options

### zoom 初始化缩放等级

_number_

地图初始显示级别 {number} Mapbox （0-24） 高德 （2-19）

### center 地图中心

地图初始中心经纬度 {Lnglat}

### pitch 地图倾角

地图初始俯仰角度 {number} default 0

### bearing 地图偏转角

地图初始旋转角度（相对于正北方向顺时针偏转的度数） {number} default 0

### minZoom 最小缩放等级

地图最小缩放等级 {number} default 0 Mapbox 0-24） 高德 （2-19）

### maxZoom 最大缩放等级

地图最大缩放等级 {number} default 22 Mapbox（0-24） 高德 （2-19）

### minPitch 最小倾角

地图最小俯仰角 {number} default 0

### maxPitch 最大倾角

地图最大俯仰角 {number} default 60

### rotateEnable 是否允许旋转

地图是否可旋转 {Boolean} default true

### interactive 是否允许交互

_boolean_ **optional** _default:_ true

是否允许地图交互（包括鼠标、触摸、键盘等），设为 `false` 后地图变为静态展示状态

### scrollZoom 是否允许滚轮缩放

_boolean_ **optional** _default:_ true

是否启用滚轮缩放交互

### boxZoom 是否允许框选缩放

_boolean_ **optional** _default:_ true

是否启用框选缩放交互（按住 Shift 拖拽）

### dragRotate 是否允许拖拽旋转

_boolean_ **optional** _default:_ true

是否启用拖拽旋转交互

### dragPan 是否允许拖拽平移

_boolean_ **optional** _default:_ true

是否启用拖拽平移交互

### keyboard 是否允许键盘控制

_boolean_ **optional** _default:_ true

是否启用键盘快捷键控制地图

### doubleClickZoom 是否允许双击缩放

_boolean_ **optional** _default:_ true

是否启用双击缩放交互

### touchZoomRotate 是否允许触摸缩放旋转

_boolean_ **optional** _default:_ true

是否启用双指捏合缩放旋转交互

### renderWorldCopies 是否渲染世界副本

_boolean_ **optional** _default:_ true

超出 -180 和 180 经度范围时，是否在两侧重复渲染地图

### maxBounds 地图最大边界范围

限制地图可视范围在指定的地理范围内

### bearingSnap 北向吸附阈值

_number_ **optional** _default:_ 7

当用户旋转地图接近正北方向时，自动吸附到正北方向的角度阈值（度数）

## 地图事件

Scene 统一代理，见 [Scene 文档](/zh/api/scene)

或者

scene.map 直接调用 map 实例方法
