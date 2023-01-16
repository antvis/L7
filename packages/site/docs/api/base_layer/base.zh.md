---
title: 图层基类 BaseLayer
order: 1
---

<embed src="@/docs/common/style.md"></embed>

## 简介

L7 Layer 接口设计遵循图形语法，所有图层都继承于基类（baseLayer）。

语法示例

```javascript
const layer = new BaseLayer(option) // option - 传入构造函数的参数对象，提供 layer 的初始状态
  .source(...)    // 传入图层需要的数据以及相关的解析器
  .filter()       // 数据过滤方法
  .shape(...)     // 为图层指定具体的形状，如：circle/triangle 等
  .color(...)     // 指定图层的颜色配置
  .texture(...)   // 指定图层引用的纹理
  .size(...)      // 设置图层元素的大小
  .animate(...)   // 设置图层元素的动画模式
  .active(...)    // 指定图层元素是否支持划过选中
  .select(...)    // 指定图层元素是否支持点击选中
  .style(...);    // 指定图层自定义样式的配置

scene.addLayer(layer);
```

<embed src="@/docs/common/layer/base.md"></embed>
