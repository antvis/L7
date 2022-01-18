---
title: 发布日志
order: 15
---

`markdown:docs/common/style.md`

## 2022.01.17 2.7 正式版本

### ✨ Features

- 新增简单点、简单线
- 新增墙图层
- 新增风场图层

### 🍏 Improvements

- 柱图支持生长动画
- 柱图支持配置渐变、光照、深度
- 点图层支持等面积模式
- 线图层支持配置高度
- 弧线支持动态配置弧度
- 面图层支持配置径向渐变
- 拾取效果支持配置混合，光照计算
- color 增加图层保底颜色设置
- 增加 pointLayer image mipmap 支持
- 优化热力图在 radius 数值比较大时热力点边缘发生裁剪的现象

### 🐞 Bug Fixes

- 修复线图层在存在高度的情况下，不同地图，不同场景下的效果兼容
- 修复 threejs 图层导致 L7 图层失效的问题
- 修复 pointLayer meter 单个数据失效的情况
- 修复 marker 在 cluster getMakers 失效
- 取消在 shape 方法执行后的暴力更新
- 修复纹理贴图在 zoom 大于 12 时存在错位的问题

## 2021.05.31 2.4 正式版本

### ✨ Features

- 支持高德 2.0 JSAPI
- 支持 iconfont 字体图标功能
- 支持 line 纹理
- 支持图层框选

### 🍏 Improvements

- 支持 arc 弧线反向

### 🐞 Bug Fixes

- 修复使用多个文字标注图层时存在的问题

## 2020.04.20 2.2 正式版本

### ✨ Features

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

### ✨ Features

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

### ✨ Features

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
