---
title: "Options"
description: "Options"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/api/tile/common/options/"
---

[资料索引](/llms.txt)

#### sourceLayer

_string_ **required**

只有矢量图层生效，用于设置矢量图层的数据源。

🌟 一般矢量服务返回的数据中存在多个图层的数据，我们需要从中进行选取。

```javascript
const layer = new PointLayer({
  sourceLayer: 'city',
});
```

#### featureId

_string_ **optional** _default:_ 自动数字编号

只有矢量图层生效，用于指定矢量图层的编码 `id`。

🌟 编码 `id` 用于在图层高亮时使用。

```javascript
const layer = new PointLayer({
  featureId: 'id',
});
```
