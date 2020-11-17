---
title: 发布日志
order: 10
---

`markdown:docs/common/style.md`

## 2020.04.20 2.2 正式版本

###✨ Features

#### [L7-Draw 地图绘制组件发布](../draw/start)

支持基础图形绘制、平移、修改、删除

- 绘制 UI 组件支持
- 绘制圆形
- 绘制矩形
- 绘制点
- 绘制线
- 绘制面

### 🍏 Improvements

- 要素拾取支持添加 buffer
- 图层拾取支持冒泡机制，默认拾取最上层

### 🐞 Bug Fixes

- pointLayer 聚合支持多种数据格式化
- 修复热力图移动端不能正常渲染
- 修复 3D 热力图高德地图正使用
- L7 版本锁定
- 修复点图层描边模糊问题

## 2020.03.12 2.1 正式版

###✨ Features

- 新增 l7-react 版本
- 可自定义样式的聚合图 MakerLayer
- 新增 quantile、quantize 度量
- 地图导出功能

### 🍏 Improvements

- IE 11 支持
- 更新拾取机制，拾取更高效
- 优化依赖包减少包体积

### 🐞 Bug Fixes

- setData 更新机制
- color,size,shape 更新重绘问题

## 2020.01.06 2.0 正式版

[Github](https://github.com/antvis/L7) https://github.com/antvis/L7 欢迎 Star

###✨ Features

• 新增弧线图，路径图动画功能

• 新增气泡图水波动画功能

• 新增聚合地图

• 新增文本标注，支持避让

• 新增城市建筑图层

• 新增栅格地图，支持卫星遥感数据可视化

• 新增图层交互事件

### 🍏 Improvements

• Marker 支持事件和自定义数据

• 弧线支持虚线样式

• 面图层支持，文本标注，气泡图效果

• 重构了文档结构

• source 支持 map,join,filter 数据处理支持

• source 支持数据更新

• 支持 blend 效果配置

• 支持通过地图实例初始化地图

• 官网新增所有图表概览页面

### 🐞 Bug Fixes

• 修复容器 resize 不能正常响应

• 修复 babel 打包问题

• 修复地图组件加载报错问题

• 修复样式配置 strokeColor- stroke
