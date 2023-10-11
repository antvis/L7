<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18"> [English](./README.en-US.md) | 简体中文

<h1 align="center">L7</h1>

<div align="center">

🌍 地理空间数据可视分析引擎

[![travis ci](https://travis-ci.com/antvis/L7.svg?branch=master)](https://travis-ci.com/antvis/L7) [![](https://flat.badgen.net/npm/v/@antv/l7?icon=npm)](https://www.npmjs.com/package/@antv/l7) ![最近提交](https://badgen.net/github/last-commit/antvis/L7)

<p align="center">
  <a href="https://l7.antv.antgroup.com/tutorial/quickstart">教程</a> •
  <a href="https://l7.antv.antgroup.com/api/scene">文档</a> •
  <a href="https://l7.antv.antgroup.com/examples">示例</a> •
  <a href="./.github/CONTRIBUTING.md">贡献</a>
</p>

![L7 demo](https://gw.alipayobjects.com/mdn/rms_855bab/afts/img/A*S-73QpO8d0YAAAAAAAAAAABkARQnAQ)

</div>

L7 是由蚂蚁金服 AntV 数据可视化团队推出的基于 WebGL 的开源大规模地理空间数据可视分析开发框架。L7 中的 L 代表 Location，7 代表世界七大洲，寓意能为全球位置数据提供可视分析的能力。L7 专注数据可视化化表达，通过颜色、大小、纹理，方向，体积等视觉变量设置实现从数据到信息清晰，有效的表达。

L7 能够满足常见的地图图表，BI 系统的可视化分析、以及 GIS，交通，电力，国土，农业，城市等领域的空间信息管理，分析等应用系统开发需求。

## 🌟 核心特性

🌏 数据驱动可视化展示

数据驱动，灵活数据映射，从数到形，支持丰富的地图可视化类型，更好洞察数据。

🌏 2D，3D 一体化的海量数据高性能渲染

海量空间数据实时，可交互，动态渲染，

🌏 简单灵活的数据接入

支持 CSV，JSON，GeoJSON 等数据格式接入，可以根据需求自定义数据格式，无需复杂的空间数据转换。

🌏 多地图底图支持，支持离线内网部署

屏蔽不同底图之间的差异，用户只需要关注数据层表达，交互。高德地图国内合法合规的地理底图，Mapbox 满足国际化业务需求。

## 🌈 支持丰富的图表类型

#### 点图层

- 气泡图
- 散点图
- 符号地图
- 3D 柱状地图
- 聚合地图
- 复合图表地图
- 自定义 Marker

#### 线图层

- 路径地图
- 弧线，支持 2D 弧线、3D 弧线以及大圆航线
- 等值线

#### 面图层

- 填充图
- 3D 填充图

#### 热力图

- 经典热力图
- 蜂窝热力图
- 网格热力图

#### 栅格地图

- 图片
- Raster

## 📦 如何使用

### 安装

```bash
npm install @antv/l7
```

### 初始化地图

```javascript
import { Scene } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    style: 'light',
    pitch: 0,
    center: [107.054293, 35.246265],
    zoom: 4.056,
  }),
});
```

### 添加图层

```javascript
import { PointLayer } from '@antv/l7';

const pointLayer = new PointLayer()
  .source(data)
  .shape('circle')
  .size('mag', [1, 25])
  .color('mag', ['#5B8FF9', '#5CCEA1'])
  .style({
    opacity: 0.3,
    strokeWidth: 1,
  });

scene.addLayer(pointLayer);
```

## 🔗 Links

- [L7Draw](https://github.com/antvis/L7Draw)
- [L7Plot](https://github.com/antvis/L7Plot)
- [LarkMap](https://github.com/antvis/LarkMap)
- [L7VP](https://locationinsight.antv.antgroup.com)
- [L7Editor](https://l7editor.antv.antgroup.com/)

## ✅ License

[MIT license](./LICENSE).
