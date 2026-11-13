---
title: "Options"
description: "Options"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/api/tile/common/options/"
---

[Resource index](/llms.txt)

#### sourceLayer

_string_ **required**

Only valid for vector layers, used to set the data source of vector layers.

🌟 Generally, there are multiple layers of data in the data returned by the vector service, and we need to select from them.

```javascript
const layer = new PointLayer({
  sourceLayer: 'city',
});
```

#### featureId

_string_ **optional** *default:*automatic numbering

Only vector layers take effect, used to specify the encoding of vector layers.`id`。

🌟 Encoding`id`Used when a layer is highlighted.

```javascript
const layer = new PointLayer({
  featureId: 'id',
});
```
