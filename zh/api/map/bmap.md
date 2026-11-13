---
title: "百度地图"
description: "百度地图"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/api/map/bmap/"
---

[资料索引](/llms.txt)

## 简介

L7 地理可视化侧重于地理数据的可视化表达，地图层需要依赖第三方地图，第三方地图通过 Scene 统一创建管理，只需要通过 Scene 传入地图配置项即可。

L7 在内部解决了不同地图底图之间差异，同时 L7 层面统一管理地图的操作方法。

L7 目前支持的百度地图是[API GL版本](https://lbsyun.baidu.com/index.php?title=jspopularGL)，也是百度地图官方推荐使用版本。

### 申请token

使用百度地图之前，需要申请百度地图密钥，如何申请百度地图密钥[点我查看](https://lbs.baidu.com/index.php?title=jspopularGL/guide/getkey)。

⚠️ L7 内部设置了默认 token，仅供测试使用

### import

```javascript
import { BaiduMap } from '@antv/l7-maps';
```

### 实例化

L7 提供 BaiduMap直接实例化地图，也可外部传入方式实例化地图。

新项目推荐 BaiduMap 直接实例化，已有地图项目可外部传入方式，以便快速接入 L7 的能力。

#### BaiduMap 实例化

```js
import { BaiduMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new BaiduMap({
    // 填写百度地图密钥，此为测试token，不可用于生产
    token: 'zLhopYPPERGtpGOgimcdKcCimGRyyIsh',
    center: [103, 30],
    pitch: 4,
    zoom: 10,
    rotation: 19,
  }),
});
```

#### 外部传入实例化

⚠️ scene id 参数需要与 BMapGL.Map 实例是同个容器。

⚠️ 传入地图实例需要自行引入[百度地图的 API](https://lbs.baidu.com/index.php?title=jspopularGL/guide/show)

```javascript
const map = new BMapGL.Map('map', {
  zoom: 11, // 初始化地图层级
  minZoom: 4,
  maxZoom: 23,
  enableWheelZoom: true,
});

const scene = new Scene({
  id: 'map',
  map: new BaiduMap({
    mapInstance: map,
  }),
});
```

BaiduMap [示例地址](#baidumap-实例化)、外部传入[示例地址](#外部传入实例化)

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
