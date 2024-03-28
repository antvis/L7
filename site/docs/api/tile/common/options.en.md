---
title: Options
order: 1
---

<embed src="@/docs/api/common/style.md"></embed>

#### sourceLayer

<description> _string_ **required** </description>

Only valid for vector layers, used to set the data source of vector layers.

🌟 Generally, there are multiple layers of data in the data returned by the vector service, and we need to select from them.

```javascript
const layer = new PointLayer({
  sourceLayer: 'city',
});
```

#### featureId

<description> _string_ **optional** *default:*automatic numbering</description>

Only vector layers take effect, used to specify the encoding of vector layers.`id`。

🌟 Encoding`id`Used when a layer is highlighted.

```javascript
const layer = new PointLayer({
  featureId: 'id',
});
```
