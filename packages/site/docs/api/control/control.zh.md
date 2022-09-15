---
title: 控件
order: 1
---

地图控件指的是悬停在地图四周，可以对地图以及图层等元素进行信息呈现或交互的组件。

![](https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*zgFeTocc-_oAAAAAAAAAAAAAARQnAQ)

# 插槽

当前 L7 中的控件支持插入到地图的**左上、左下、右上、右下、上、左、下、右**八个位置的控件插槽中，并且在同一插槽中的多个控件支持**横向**和**纵向**排列。

在初始化所有的控件类时，可以传入 `position` 参数来设置控件对应的插槽以及排列方式：

- `topleft`: ↖ 左上角，纵向排列
- `lefttop`: ↖ 左上角，横向排列
- `topright`: ↗ 右上角，纵向排列
- `righttop`: ↗ 右上角，横向排列
- `bottomleft`: ↙ 左下角，纵向排列
- `leftbottom`: ↙ 左下角，横向排列
- `bottomright`: ↘ 右下角，纵向排列
- `rightbottom`: ↘ 右下角，横向排列
- `topcenter`: ↑ 上方中央，横向排列
- `bottomcenter`: ↓ 下方中间，横向排列
- `leftcenter`: ← 左边中间，纵向排列
- `rightcenter`: → 右边中间，纵向排列

![](https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*BfG1TI231ysAAAAAAAAAAAAAARQnAQ)

# API

`markdown:docs/common/control/api.md`
