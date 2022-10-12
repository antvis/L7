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
