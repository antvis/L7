## L7 地理空间数据可视分析引擎

L7 是由蚂蚁金服 AntV 数据可视化团队推出的基于 WebGL 的开源大规模地理空间数据可视分析开发框架。L7 中的 L 代表 Location，7 代表世界七大洲，寓意能为全球位置数据提供可视分析的能力。L7 以图形符号学为理论基础，将抽象复杂的空间数据转化成 2D、3D 符号，通过颜色、大小、体积、纹理等视觉变量实现丰富的可视化表达。


## l7 visualization demos

![l7 demo](https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*SGU-QIZsnyoAAAAAAAAAAABkARQnAQ)


### Installation

```
 npm install @antv/l7

```


## 核心特性

### 🌏 数据驱动可视化展示

数据驱动，从数到形，支持丰富的地图可视化类型，更好洞察数据。

### 🌏 2D，3D 一体化的海量数据高性能渲染

百万级空间数据实时，动态渲染。

### 🌏简单灵活的数据接入

支持CSV，JSON，geojson等数据格式接入，可以根据需求自定义数据格式，无需复杂的空间数据转换。

### 🌏 多地图底图支持，支持离线内网部署

高德地图国内合法合规的地理底图，Mapbox 满足国际化业务需求。

## 支持丰富的图表类型

### 点图层
 
 - 气泡图
 - 散点图
 - 符号地图
 - 3D柱状地图
 - 聚合地图
 - 复合图表地图
 - 自定义Marker

### 线图层

- 路径地图
- 弧线，支持2D弧线、3D弧线以及大圆航线
- 等值线

### 面图层

- 填充图
- 3D填充图

### 热力图

- 经典热力图
- 蜂窝热力图
- 网格热力图

### 栅格地图
- 图片
- Raster

## L7 2.0 Roadmap

![L7 Road Map](https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*3j9HTLTQT2MAAAAAAAAAAABkARQnAQ)

## Development

使用 Yarn Workspace 完成依赖安装以及各包之间的 link 工作：
```bash
yarn install
```

开发模式：
```bash
yarn watch
```

运行 Demo
```bash
yarn storybook
```

代替 `git commit` 提交：
```bash
yarn commit
```

## view doc example

```bash
  npm  start
```
visit http://localhost:8000/

## Add Package

add new package：
```bash
lerna create my-pack -y
```

将 ui-lib 作为 my-pack 的依赖：
```bash
yarn workspace my-pack add ui-lib/1.0.0
```

将 lodash 添加为所有 package 的依赖(不包含root）
```bash
yarn workspaces run add lodash
```

将 typescript 设置为 root 的开发依赖
```bash
yarn add -W -D typescript jest
```
